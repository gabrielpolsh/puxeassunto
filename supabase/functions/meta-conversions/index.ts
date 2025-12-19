import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { event_name, event_time, user_data, custom_data, event_source_url, action_source, event_id } = await req.json()

    const PIXEL_ID = '1770822433821202';
    const ACCESS_TOKEN = 'EAAOMFb4hzEIBQLuZBhM25lOZAm81eK5rkRuodxyVbuZCiwSwZBOZBFnTdqiJlVZBZBruPU0fuoVfHpxtqZANq55jBfmD1zqRTRcsbHv8UkII6tbL8Sp1pPhS59UzUZAEblLHDBsvSh2zRaIgU9AxdXxPffAdy6W5zmNuTqBJ2COjBAlNu8YyMHKt3ykwLpNYwewZDZD';

    if (!ACCESS_TOKEN) {
      console.error('Missing META_CONVERSIONS_API_TOKEN');
      // Return success to not break client, but log error
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Hash user data if provided and not already hashed
    const hashedUserData: any = {};
    if (user_data) {
        if (user_data.em && Array.isArray(user_data.em)) {
             hashedUserData.em = await Promise.all(user_data.em.map(async (e: string) => {
                if (e.match(/^[a-f0-9]{64}$/)) return e;
                return await sha256(e.toLowerCase().trim());
             }));
        }

        if (user_data.ph && Array.isArray(user_data.ph)) {
             hashedUserData.ph = await Promise.all(user_data.ph.map(async (p: string) => {
                if (p.match(/^[a-f0-9]{64}$/)) return p;
                return await sha256(p.replace(/[^0-9]/g, ''));
             }));
        }
        
        // Copy other fields
        if (user_data.client_user_agent) hashedUserData.client_user_agent = user_data.client_user_agent;
        if (user_data.client_ip_address) hashedUserData.client_ip_address = user_data.client_ip_address;
        if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
        if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
        if (user_data.fn) hashedUserData.fn = user_data.fn; // First name (should be hashed if sent, but keeping simple for now)
        if (user_data.ln) hashedUserData.ln = user_data.ln; // Last name
    }

    const payload = {
      data: [
        {
          event_name,
          event_time: event_time || Math.floor(Date.now() / 1000),
          action_source: action_source || 'website',
          event_source_url,
          event_id,
          user_data: hashedUserData,
          custom_data,
        },
      ],
    };

    console.log('Sending payload to Meta:', JSON.stringify(payload));

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log('Meta API Response:', result);

    if (!response.ok) {
        console.error('Meta API Error:', result);
        throw new Error(`Meta API Error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
