import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

                // Prepare update object
                const updateData: any = {
                    is_pro: isPro,
                    updated_at: new Date().toISOString(),
                    subscription_status: status
                };

                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update(updateData)
                    .eq('id', user.id);

                if (updateError) {
                    console.error('Error updating profile:', updateError);
                    return new Response('Error updating profile', { status: 500 });
                }
                
                console.log(`User ${user.id} (${customerEmail}) updated. PRO: ${isPro}`);
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
