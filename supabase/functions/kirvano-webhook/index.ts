import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Plan configuration - maps Kirvano product/checkout URLs to plan types
const PLAN_CONFIGS: Record<string, { planType: string; durationMonths: number; price: number }> = {
    // Monthly plan - R$ 15,00
    '1b352195-0b65-4afa-9a3e-bd58515446e9': { planType: 'monthly', durationMonths: 1, price: 15.00 },
    // Quarterly plan - R$ 39,90
    '003f8e49-5c58-41f5-a122-8715abdf2c02': { planType: 'quarterly', durationMonths: 3, price: 39.90 },
    // Yearly plan - R$ 97,90
    'f4254764-ee73-4db6-80fe-4d0dc70233e2': { planType: 'yearly', durationMonths: 12, price: 97.90 },
};

// Helper function to calculate subscription end date
function calculateSubscriptionEndDate(planType: string, startDate: Date = new Date()): Date {
    const endDate = new Date(startDate);
    switch (planType) {
        case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3);
            break;
        case 'yearly':
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        case 'monthly':
        default:
            endDate.setMonth(endDate.getMonth() + 1);
            break;
    }
    return endDate;
}

// Helper function to detect plan type from payload
function detectPlanType(payload: any): { planType: string; durationMonths: number } {
    // Try to extract product/checkout ID from various payload locations
    const productId = 
        payload.data?.product?.id ||
        payload.data?.checkout?.id ||
        payload.product_id ||
        payload.checkout_id ||
        payload.data?.product_id ||
        payload.data?.checkout_id ||
        '';
    
    // Check if we have a matching plan config
    if (PLAN_CONFIGS[productId]) {
        return PLAN_CONFIGS[productId];
    }
    
    // Try to detect from product name or description
    const productName = (
        payload.data?.product?.name ||
        payload.product_name ||
        payload.data?.product_name ||
        ''
    ).toLowerCase();
    
    const productDescription = (
        payload.data?.product?.description ||
        payload.product_description ||
        ''
    ).toLowerCase();
    
    const searchText = `${productName} ${productDescription}`;
    
    if (searchText.includes('anual') || searchText.includes('yearly') || searchText.includes('1 ano') || searchText.includes('12 meses')) {
        return { planType: 'yearly', durationMonths: 12 };
    }
    if (searchText.includes('trimestral') || searchText.includes('quarterly') || searchText.includes('3 meses')) {
        return { planType: 'quarterly', durationMonths: 3 };
    }
    
    // Try to detect from price
    const price = 
        payload.data?.sale?.amount ||
        payload.data?.amount ||
        payload.amount ||
        payload.value ||
        0;
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (numericPrice >= 90 && numericPrice <= 110) {
        // Yearly plan price range
        return { planType: 'yearly', durationMonths: 12 };
    }
    if (numericPrice >= 35 && numericPrice <= 45) {
        // Quarterly plan price range
        return { planType: 'quarterly', durationMonths: 3 };
    }
    
    // Default to monthly
    return { planType: 'monthly', durationMonths: 1 };
}

serve(async (req) => {
    try {
        // 1. Verify Method
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // 2. Get Payload
        const payload = await req.json();
        console.log('Kirvano Webhook received:', JSON.stringify(payload));

        // 3. Extract Data
        // Kirvano structure usually involves 'event', 'customer', 'status'
        // We will try to be flexible
        
        const event = payload.event || payload.type;
        const data = payload.data || payload; // Sometimes data is nested

        // IGNORAR eventos que NÃO devem afetar a assinatura
        // PIX_EXPIRED: Cliente gerou vários PIX e pagou só um, os outros expiram
        // PIX_GENERATED: PIX foi gerado mas ainda não foi pago
        // BOLETO_EXPIRED/BOLETO_GENERATED: Mesmo caso do PIX
        // CARD_DECLINED: Tentativa de pagamento falhou, mas pode tentar de novo
        // ABANDONED_CART: Carrinho abandonado não deve afetar usuário
        const ignoredEvents = [
            'PIX_EXPIRED', 
            'PIX_GENERATED',
            'BOLETO_EXPIRED', 
            'BOLETO_GENERATED',
            'CARD_DECLINED', 
            'SALE_REFUSED',
            'ABANDONED_CART'
        ];
        if (ignoredEvents.includes(event)) {
            console.log(`IGNORADO: Evento ${event} não afeta status de assinatura`);
            return new Response(JSON.stringify({ message: `${event} ignored - does not affect subscription` }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // Extract Email
        // Kirvano usa "cliente" (português) em vez de "customer"
        const customerEmail = 
            data.cliente?.email ||
            data.customer?.email || 
            data.email || 
            payload.cliente?.email ||
            payload.customer?.email || 
            payload.email;

        // Extract Status
        // Common statuses: 'paid', 'approved', 'completed'
        // Normalize to lowercase to avoid case sensitivity issues (Log shows "APPROVED")
        const rawStatus = data.status || payload.status || 'unknown';
        const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : rawStatus;

        // Determine if PRO
        // We consider PRO if status is paid/approved OR event is purchase_approved
        // IMPORTANT: If event is CANCELED or REFUNDED, isPro will be false
        const isPro = 
            (status === 'paid' || 
            status === 'approved' || 
            status === 'completed' || 
            event === 'purchase_approved' ||
            event === 'order.paid' ||
            event === 'SALE_APPROVED' ||        
            event === 'SUBSCRIPTION_RENEWED') &&
            // Explicitly check for negative statuses to be safe
            status !== 'canceled' &&
            status !== 'refunded' &&
            status !== 'chargeback' &&
            event !== 'SUBSCRIPTION_CANCELED' &&
            event !== 'SALE_REFUNDED';

        if (customerEmail) {
            // 4. Update User in Supabase
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // Try to find user by Email
            console.log(`Updating user by Email: ${customerEmail}`);
            
            // First, check if user exists and get current status
            const { data: user, error: fetchError } = await supabaseAdmin
                .from('profiles')
                .select('id, is_pro, subscription_status')
                .eq('email', customerEmail)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching user:', fetchError);
            }

            if (user) {
                // PROTECTION: Smart status update logic
                // Allow updates if:
                // 1. User is upgrading to PRO (isPro = true), OR
                // 2. User is NOT PRO (free tier), OR
                // 3. It's a LEGITIMATE cancellation/refund (canceled, refunded, chargeback)
                
                // Lista de eventos que realmente cancelam a assinatura
                const cancellationEvents = [
                    'SUBSCRIPTION_CANCELED',
                    'SUBSCRIPTION_EXPIRED',
                    'SUBSCRIPTION_OVERDUE',
                    'SALE_REFUNDED',
                    'CHARGEBACK',
                    'CHARGEBACK_DISPUTE'
                ];
                
                // Lista de status que indicam cancelamento real
                const cancellationStatuses = [
                    'canceled', 'cancelado',
                    'refunded', 'reembolsado',
                    'chargeback'
                ];
                
                const isCancellation = 
                    cancellationStatuses.includes(status) ||
                    cancellationEvents.includes(event);

                const shouldUpdate = isPro || !user.is_pro || isCancellation;

                if (!shouldUpdate) {
                    console.log(`PROTECTED: User ${user.id} is PRO. Ignoring irrelevant status update (${status})`);
                    return new Response(JSON.stringify({ message: 'Protected PRO user from irrelevant update' }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 200
                    });
                }

                // Detect plan type and calculate subscription end date
                const { planType, durationMonths } = detectPlanType(payload);
                const subscriptionEndDate = calculateSubscriptionEndDate(planType);
                
                console.log(`Detected plan type: ${planType}, duration: ${durationMonths} months, end date: ${subscriptionEndDate.toISOString()}`);

                // Prepare update object
                const updateData: any = {
                    is_pro: isPro,
                    updated_at: new Date().toISOString(),
                    subscription_status: status,
                    plan_type: isPro ? planType : null,
                    subscription_end_date: isPro ? subscriptionEndDate.toISOString() : null,
                    next_payment_date: isPro ? subscriptionEndDate.toISOString() : null
                };

                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update(updateData)
                    .eq('id', user.id);

                if (updateError) {
                    console.error('Error updating profile:', updateError);
                    return new Response('Error updating profile', { status: 500 });
                }
                
                console.log(`User ${user.id} (${customerEmail}) updated. PRO: ${isPro}, Plan: ${planType}, Expires: ${subscriptionEndDate.toISOString()}`);
            } else {
                console.log(`User with email ${customerEmail} not found in profiles.`);
                // Optionally we could create a profile or log this for manual review
            }

            return new Response(JSON.stringify({ message: 'Webhook processed' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        return new Response(JSON.stringify({ message: 'No email found in payload' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }
});
