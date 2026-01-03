import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Meta CAPI Configuration
const META_PIXEL_ID = '1770822433821202';
const META_ACCESS_TOKEN = 'EAAOMFb4hzEIBQLuZBhM25lOZAm81eK5rkRuodxyVbuZCiwSwZBOZBFnTdqiJlVZBZBruPU0fuoVfHpxtqZANq55jBfmD1zqRTRcsbHv8UkII6tbL8Sp1pPhS59UzUZAEblLHDBsvSh2zRaIgU9AxdXxPffAdy6W5zmNuTqBJ2COjBAlNu8YyMHKt3ykwLpNYwewZDZD';

// Google Analytics 4 Measurement Protocol Configuration
const GA4_MEASUREMENT_ID = 'G-0FH9JM0PWV';
const GA4_API_SECRET = 'PAOylh2dSyOaB7VaGRfR4g';

// SHA256 hash function for Meta CAPI
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Send Purchase event to Google Analytics 4 via Measurement Protocol
// https://developers.google.com/analytics/devguides/collection/protocol/ga4
async function sendPurchaseToGA4(email: string, value: number, currency: string, planType: string, saleId: string) {
  try {
    // Generate a client_id from email (consistent for the same user)
    const clientId = await sha256(email.toLowerCase().trim());
    
    const payload = {
      client_id: clientId.substring(0, 36), // GA4 expects client_id format
      events: [{
        name: 'purchase',
        params: {
          transaction_id: saleId,
          value: parseFloat(value.toFixed(2)),
          currency: currency.toUpperCase(),
          items: [{
            item_id: `pro_${planType}`,
            item_name: `Plano PRO ${planType}`,
            item_category: 'subscription',
            price: parseFloat(value.toFixed(2)),
            quantity: 1,
          }],
        },
      }],
    };

    console.log('[GA4] Sending Purchase event:', JSON.stringify(payload));

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    // GA4 Measurement Protocol returns 204 No Content on success
    if (response.status === 204 || response.ok) {
      console.log('[GA4] Purchase event sent successfully');
    } else {
      const result = await response.text();
      console.error('[GA4] Error sending Purchase event:', response.status, result);
    }
  } catch (error) {
    console.error('[GA4] Failed to send Purchase event:', error);
    // Don't throw - we don't want to fail the webhook because of GA4
  }
}

// Normalize and hash phone number for Meta CAPI
// Meta requires: digits only, with country code, no leading zeros after country code
async function normalizeAndHashPhone(phone: string): Promise<string | null> {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // If starts with 0, remove it (local format)
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // If doesn't start with country code, assume Brazil (+55)
  if (!digits.startsWith('55') && digits.length <= 11) {
    digits = '55' + digits;
  }
  
  // Must have at least 10 digits (country + area + number)
  if (digits.length < 12) return null;
  
  return await sha256(digits);
}

// Send Purchase event to Meta Conversions API
// saleId is used to generate deterministic event_id for deduplication
// Now accepts optional phone, IP, fbp, and fbc for better matching
async function sendPurchaseToMeta(
  email: string, 
  value: number, 
  currency: string, 
  planType: string, 
  saleId: string,
  phone?: string | null,
  clientIp?: string | null,
  fbp?: string | null,
  fbc?: string | null,
  userId?: string | null
) {
  try {
    const eventTime = Math.floor(Date.now() / 1000);
    // Use sale_id from Kirvano for deterministic event_id - enables Facebook deduplication
    // If same sale_id is sent multiple times (webhook retry), Facebook will dedupe it
    const eventId = `purchase_kirvano_${saleId}`;
    
    // Hash email for Meta CAPI (required)
    const hashedEmail = await sha256(email.toLowerCase().trim());
    
    // Hash sale_id for external_id (consistent identifier)
    const hashedExternalId = await sha256(saleId);
    
    // Hash email again for secondary external_id (helps with cross-device matching)
    const hashedEmailId = await sha256(email.toLowerCase().trim() + '_puxeassunto');
    
    // Build external_ids array with all available identifiers
    const externalIds = [hashedExternalId, hashedEmailId];
    
    // Add hashed user ID if available (Supabase user ID)
    if (userId) {
      const hashedUserId = await sha256(userId);
      externalIds.push(hashedUserId);
    }
    
    // Build user_data object with all available parameters
    const userData: Record<string, any> = {
      em: [hashedEmail],
      external_id: externalIds, // Multiple IDs improve matching
    };
    
    // Add hashed phone if available (improves match rate significantly)
    if (phone) {
      const hashedPhone = await normalizeAndHashPhone(phone);
      if (hashedPhone) {
        userData.ph = [hashedPhone];
        console.log('[Meta CAPI] Phone added to Purchase event');
      }
    }
    
    // Add client IP if available (Meta prefers IPv6)
    if (clientIp) {
      userData.client_ip_address = clientIp;
      const isIPv6 = clientIp.includes(':');
      console.log(`[Meta CAPI] IP added to Purchase event: ${clientIp} (${isIPv6 ? 'IPv6 ✓' : 'IPv4'})`);
    }
    
    // Add fbp (Facebook Browser ID) if available - CRITICAL for matching
    if (fbp) {
      userData.fbp = fbp;
      console.log('[Meta CAPI] fbp added to Purchase event');
    }
    
    // Add fbc (Facebook Click ID) if available - CRITICAL for ad attribution
    if (fbc) {
      userData.fbc = fbc;
      console.log('[Meta CAPI] fbc added to Purchase event');
    }
    
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        action_source: 'website',
        event_source_url: 'https://puxeassunto.com/upgrade', // Add source URL for better context
        event_id: eventId,
        user_data: userData,
        custom_data: {
          value: parseFloat(value.toFixed(2)),
          currency: currency.toUpperCase(),
          content_name: `Plano PRO ${planType}`,
          content_type: 'product',
          content_ids: [saleId], // Transaction ID for deduplication
          num_items: 1,
        },
      }],
    };
    
    console.log('[Meta CAPI] Sending Purchase event:', JSON.stringify(payload));
    
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('[Meta CAPI] Purchase event sent successfully:', result);
    } else {
      console.error('[Meta CAPI] Error sending Purchase event:', result);
    }
  } catch (error) {
    console.error('[Meta CAPI] Failed to send Purchase event:', error);
    // Don't throw - we don't want to fail the webhook because of Meta
  }
}

// Plan configuration - maps Kirvano product/checkout URLs to plan types
const PLAN_CONFIGS: Record<string, { planType: string; durationMonths: number; price: number }> = {
    // Monthly plan - R$ 15,90
    '1b352195-0b65-4afa-9a3e-bd58515446e9': { planType: 'monthly', durationMonths: 1, price: 15.90 },
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
    // Try to extract product/checkout/offer ID from various payload locations
    // Kirvano sends offer_id inside products array
    const offerId = 
        payload.products?.[0]?.offer_id ||
        payload.data?.products?.[0]?.offer_id ||
        payload.data?.product?.id ||
        payload.data?.checkout?.id ||
        payload.product_id ||
        payload.checkout_id ||
        payload.offer_id ||
        payload.data?.product_id ||
        payload.data?.checkout_id ||
        payload.data?.offer_id ||
        '';
    
    console.log(`Detecting plan - offer_id: ${offerId}`);
    
    // Check if we have a matching plan config
    if (PLAN_CONFIGS[offerId]) {
        console.log(`Found plan config for offer_id ${offerId}: ${PLAN_CONFIGS[offerId].planType}`);
        return PLAN_CONFIGS[offerId];
    }
    
    // Try to detect from product name or description
    // Kirvano sends product name in products[0].name
    const productName = (
        payload.products?.[0]?.name ||
        payload.data?.products?.[0]?.name ||
        payload.data?.product?.name ||
        payload.product_name ||
        payload.data?.product_name ||
        ''
    ).toLowerCase();
    
    console.log(`Detecting plan - product name: ${productName}`);
    
    const productDescription = (
        payload.products?.[0]?.description ||
        payload.data?.products?.[0]?.description ||
        payload.data?.product?.description ||
        payload.product_description ||
        payload.offer_name ||
        payload.products?.[0]?.offer_name ||
        ''
    ).toLowerCase();
    
    const searchText = `${productName} ${productDescription}`;
    console.log(`Detecting plan - search text: ${searchText}`);
    
    // Yearly plan detection
    if (searchText.includes('anual') || searchText.includes('yearly') || searchText.includes('1 ano') || searchText.includes('12 meses') || searchText.includes('ano')) {
        console.log('Detected yearly plan from text');
        return { planType: 'yearly', durationMonths: 12 };
    }
    // Quarterly plan detection
    if (searchText.includes('trimestral') || searchText.includes('trimestre') || searchText.includes('quarterly') || searchText.includes('3 meses') || searchText.includes('tri')) {
        console.log('Detected quarterly plan from text');
        return { planType: 'quarterly', durationMonths: 3 };
    }
    
    // Try to detect from price
    // Kirvano sends fiscal.total_value as a number
    const price = 
        payload.fiscal?.total_value ||
        payload.fiscal?.net_value ||
        payload.data?.sale?.amount ||
        payload.data?.amount ||
        payload.amount ||
        payload.value ||
        0;
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    console.log(`Detecting plan - price: ${numericPrice}`);
    
    if (numericPrice >= 90 && numericPrice <= 110) {
        // Yearly plan price range
        console.log('Detected yearly plan from price');
        return { planType: 'yearly', durationMonths: 12 };
    }
    if (numericPrice >= 35 && numericPrice <= 50) {
        // Quarterly plan price range (R$ 39,90)
        console.log('Detected quarterly plan from price');
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

        // Extract Sale ID for deduplication
        // Kirvano sends sale_id at root level
        const saleId = payload.sale_id || payload.checkout_id || data.sale_id || data.checkout_id || `unknown_${Date.now()}`;
        console.log(`Sale ID for deduplication: ${saleId}`);

        // Extract Email
        // Kirvano usa "cliente" (português) em vez de "customer"
        const customerEmail = 
            data.cliente?.email ||
            data.customer?.email || 
            data.email || 
            payload.cliente?.email ||
            payload.customer?.email || 
            payload.email;

        // Extract Phone (for Meta CAPI - improves match rate)
        // Kirvano sends phone in cliente/customer object
        const customerPhone = 
            data.cliente?.phone ||
            data.cliente?.telefone ||
            data.cliente?.celular ||
            data.customer?.phone ||
            data.customer?.telefone ||
            payload.cliente?.phone ||
            payload.cliente?.telefone ||
            payload.customer?.phone ||
            payload.phone ||
            payload.telefone ||
            null;
        
        // Extract IP from request headers (Kirvano might forward client IP)
        const clientIp = 
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            req.headers.get('cf-connecting-ip') ||
            null;
        
        console.log(`Customer data - Email: ${customerEmail}, Phone: ${customerPhone ? 'present' : 'not found'}, IP: ${clientIp || 'not found'}`);

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
                
                // Send Purchase event to Meta CAPI when user becomes PRO
                if (isPro) {
                    // Try to get actual price from Kirvano payload
                    // Kirvano structure: payload.fiscal.total_value (number) or payload.products[0].price (string "R$ 15,90")
                    let payloadPrice: number | null = null;
                    
                    // Priority 1: fiscal.total_value (most reliable, already a number)
                    if (payload.fiscal?.total_value && typeof payload.fiscal.total_value === 'number') {
                        payloadPrice = payload.fiscal.total_value;
                    }
                    // Priority 2: fiscal.net_value
                    else if (payload.fiscal?.net_value && typeof payload.fiscal.net_value === 'number') {
                        payloadPrice = payload.fiscal.net_value;
                    }
                    // Priority 3: products[0].price (string like "R$ 15,90")
                    else if (payload.products?.[0]?.price) {
                        const priceStr = payload.products[0].price;
                        // Parse "R$ 15,90" to 15.90
                        const numMatch = priceStr.replace(/[^\d,\.]/g, '').replace(',', '.');
                        payloadPrice = parseFloat(numMatch) || null;
                    }
                    
                    // Fallback to plan config
                    const planConfig = PLAN_CONFIGS[detectPlanType(payload).planType === 'yearly' ? 'f4254764-ee73-4db6-80fe-4d0dc70233e2' : 
                                        detectPlanType(payload).planType === 'quarterly' ? '003f8e49-5c58-41f5-a122-8715abdf2c02' : 
                                        '1b352195-0b65-4afa-9a3e-bd58515446e9'];
                    
                    const price = (payloadPrice && payloadPrice > 0) ? payloadPrice : (planConfig?.price || 15.00);
                    
                    console.log(`[Analytics] Sending Purchase - Email: ${customerEmail}, Phone: ${customerPhone ? 'yes' : 'no'}, IP: ${clientIp || 'no'}, Price: ${price} BRL, Plan: ${planType}, SaleId: ${saleId}, Source: ${payloadPrice ? 'payload' : 'config'}`);
                    
                    // Send to both Meta CAPI and GA4 (for Meta <-> GA4 mapping)
                    await Promise.all([
                        sendPurchaseToMeta(customerEmail, price, 'BRL', planType, saleId, customerPhone, clientIp),
                        sendPurchaseToGA4(customerEmail, price, 'BRL', planType, saleId),
                    ]);
                }
            } else {
                // Usuário não existe - salvar como compra pendente
                // Quando ele criar conta com esse email, já vem PRO automaticamente
                console.log(`User with email ${customerEmail} not found. Saving as pending purchase.`);
                
                if (isPro) {
                    const { planType, durationMonths } = detectPlanType(payload);
                    
                    // Extrair preço do payload
                    let price: number | null = null;
                    if (payload.fiscal?.total_value && typeof payload.fiscal.total_value === 'number') {
                        price = payload.fiscal.total_value;
                    } else if (payload.products?.[0]?.price) {
                        const priceStr = payload.products[0].price;
                        const numMatch = priceStr.replace(/[^\d,\.]/g, '').replace(',', '.');
                        price = parseFloat(numMatch) || null;
                    }
                    
                    // Inserir na tabela pending_purchases
                    const { error: pendingError } = await supabaseAdmin
                        .from('pending_purchases')
                        .upsert({
                            email: customerEmail.toLowerCase().trim(),
                            sale_id: saleId,
                            plan_type: planType,
                            duration_months: durationMonths,
                            price: price,
                            payload: payload
                        }, { onConflict: 'sale_id' });
                    
                    if (pendingError) {
                        console.error('Error saving pending purchase:', pendingError);
                    } else {
                        console.log(`Pending purchase saved for ${customerEmail}. When they create an account, they'll get PRO automatically.`);
                    }
                    
                    // Ainda enviar evento para Meta CAPI
                    const planConfig = PLAN_CONFIGS[detectPlanType(payload).planType === 'yearly' ? 'f4254764-ee73-4db6-80fe-4d0dc70233e2' : 
                                        detectPlanType(payload).planType === 'quarterly' ? '003f8e49-5c58-41f5-a122-8715abdf2c02' : 
                                        '1b352195-0b65-4afa-9a3e-bd58515446e9'];
                    const metaPrice = (price && price > 0) ? price : (planConfig?.price || 15.00);
                    
                    console.log(`[Analytics] Sending Purchase for pending user - Email: ${customerEmail}, Phone: ${customerPhone ? 'yes' : 'no'}, IP: ${clientIp || 'no'}, Price: ${metaPrice} BRL`);
                    
                    // Send to both Meta CAPI and GA4 (for Meta <-> GA4 mapping)
                    await Promise.all([
                        sendPurchaseToMeta(customerEmail, metaPrice, 'BRL', planType, saleId, customerPhone, clientIp),
                        sendPurchaseToGA4(customerEmail, metaPrice, 'BRL', planType, saleId),
                    ]);
                }
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
