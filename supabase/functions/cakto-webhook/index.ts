import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Meta CAPI Configuration
const META_PIXEL_ID = '1770822433821202';
const META_ACCESS_TOKEN = 'EAAOMFb4hzEIBQLuZBhM25lOZAm81eK5rkRuodxyVbuZCiwSwZBOZBFnTdqiJlVZBZBruPU0fuoVfHpxtqZANq55jBfmD1zqRTRcsbHv8UkII6tbL8Sp1pPhS59UzUZAEblLHDBsvSh2zRaIgU9AxdXxPffAdy6W5zmNuTqBJ2COjBAlNu8YyMHKt3ykwLpNYwewZDZD';

// SHA256 hash function for Meta CAPI
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Send Purchase event to Meta Conversions API
async function sendPurchaseToMeta(email: string, value: number, currency: string) {
  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash email for Meta CAPI (required)
    const hashedEmail = await sha256(email.toLowerCase().trim());
    
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        action_source: 'website',
        event_id: eventId,
        user_data: {
          em: [hashedEmail],
        },
        custom_data: {
          value: parseFloat(value.toFixed(2)),
          currency: currency.toUpperCase(),
          content_name: 'Plano PRO',
          content_type: 'product',
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
  }
}

serve(async (req) => {
    try {
        // 1. Verify Method
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // 2. Get Payload
        const payload = await req.json();
        console.log('Webhook received:', JSON.stringify(payload));

        // 3. Verify Secret (Optional but recommended)
        // const secret = payload.secret;
        // if (secret !== "31207968-47e0-44e1-aaab-ad01ab8a5bd9") { ... }

        // 4. Extract Data
        // Cakto sends data wrapped in a 'data' object, but sometimes it might be flat (legacy)
        const data = payload.data || payload;

        const status = data.status || data.state;
        const customerEmail = data.customer?.email || data.email;
        
        // Try to find user ID from external reference
        const userId = data.external_reference || data.client_reference_id || data.custom_id || payload.external_reference;

        // Subscription Data
        const subscription = data.subscription;
        const nextPaymentDate = subscription?.next_payment_date || data.next_payment_date;
        const subscriptionId = subscription?.id || data.subscription_id;

        // Check if payment is approved/paid OR subscription is active
        const isPro = status === 'approved' || status === 'paid' || status === 'active' || payload.event === 'purchase_approved';

        if (userId || customerEmail) {
            // 5. Update User in Supabase
            // Initialize Supabase Client (Admin context)
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // First, check current user status
            let currentUser;
            if (userId) {
                const { data } = await supabaseAdmin
                    .from('profiles')
                    .select('id, is_pro, subscription_status')
                    .eq('id', userId)
                    .single();
                currentUser = data;
            } else {
                const { data } = await supabaseAdmin
                    .from('profiles')
                    .select('id, is_pro, subscription_status')
                    .eq('email', customerEmail)
                    .single();
                currentUser = data;
            }

            // PROTECTION: Smart status update logic
            // Allow updates if:
            // 1. User is upgrading to PRO (isPro = true), OR
            // 2. User is NOT PRO (free tier), OR
            // 3. It's a LEGITIMATE cancellation/refund (canceled, refunded, etc)
            
            const isCancellation = 
                status === 'canceled' || 
                status === 'cancelled' ||
                status === 'refunded' || 
                status === 'chargeback' ||
                payload.event === 'subscription.canceled' ||
                payload.event === 'purchase.refunded';

            const shouldUpdate = isPro || !currentUser?.is_pro || isCancellation;

            if (currentUser && currentUser.is_pro && !shouldUpdate) {
                console.log(`PROTECTED: User ${currentUser.id} is PRO. Ignoring irrelevant status update (${status})`);
                return new Response(JSON.stringify({ message: 'Protected PRO user from irrelevant update' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200
                });
            }

            // Prepare update object
            const updateData: any = {
                is_pro: isPro,
                updated_at: new Date().toISOString()
            };

            // Add subscription details if present
            if (subscriptionId) updateData.subscription_id = subscriptionId;
            if (status) updateData.subscription_status = status;
            if (nextPaymentDate) updateData.next_payment_date = nextPaymentDate;

            let error;
            
            if (userId) {
                // Try updating by ID first (more reliable)
                console.log(`Updating user by ID: ${userId}`);
                const result = await supabaseAdmin
                    .from('profiles')
                    .update(updateData)
                    .eq('id', userId);
                error = result.error;
            } else {
                // Fallback to email
                console.log(`Updating user by Email: ${customerEmail}`);
                const result = await supabaseAdmin
                    .from('profiles')
                    .update(updateData)
                    .eq('email', customerEmail);
                error = result.error;
            }

            if (error) {
                console.error('Error updating profile:', error);
                return new Response('Error updating profile', { status: 500 });
            }

            console.log(`User ${userId || customerEmail} updated. PRO: ${isPro}. Status: ${status}`);
            
            // Send Purchase event to Meta CAPI when user becomes PRO
            if (isPro && customerEmail) {
                const value = data.amount || data.value || 15.00; // Default to monthly price
                await sendPurchaseToMeta(customerEmail, parseFloat(value) || 15.00, 'BRL');
            }
            
            return new Response(JSON.stringify({ message: 'User updated' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        return new Response(JSON.stringify({ message: 'Ignored status: ' + status }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }
});
