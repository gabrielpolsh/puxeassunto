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
