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
    
    // Capturar IP real do cliente - Priorizar IPv6
    // Ordem de prioridade para obter o melhor IP disponível
    const getClientIp = (): string => {
      // 1. IP enviado pelo cliente (pode ser IPv6 detectado no frontend)
      if (user_data?.client_ip_address) {
        return user_data.client_ip_address;
      }
      
      // 2. Header CF-Connecting-IPv6 (Cloudflare IPv6 específico)
      const cfIpv6 = req.headers.get('cf-connecting-ipv6');
      if (cfIpv6) return cfIpv6;
      
      // 3. CF-Connecting-IP (Cloudflare - pode ser IPv4 ou IPv6)
      const cfIp = req.headers.get('cf-connecting-ip');
      if (cfIp) return cfIp;
      
      // 4. X-Forwarded-For (pode conter múltiplos IPs, pegar o primeiro)
      const xForwardedFor = req.headers.get('x-forwarded-for');
      if (xForwardedFor) {
        const ips = xForwardedFor.split(',').map(ip => ip.trim());
        // Priorizar IPv6 se houver
        const ipv6 = ips.find(ip => ip.includes(':'));
        if (ipv6) return ipv6;
        return ips[0];
      }
      
      // 5. X-Real-IP
      const xRealIp = req.headers.get('x-real-ip');
      if (xRealIp) return xRealIp;
      
      // 6. True-Client-IP (Akamai, Cloudflare Enterprise)
      const trueClientIp = req.headers.get('true-client-ip');
      if (trueClientIp) return trueClientIp;
      
      return 'unknown';
    };
    
    const clientIp = getClientIp();
    
    // Log para debug do IP capturado
    console.log('[Meta CAPI] IP Headers:', {
      'cf-connecting-ip': req.headers.get('cf-connecting-ip'),
      'cf-connecting-ipv6': req.headers.get('cf-connecting-ipv6'),
      'x-forwarded-for': req.headers.get('x-forwarded-for'),
      'x-real-ip': req.headers.get('x-real-ip'),
      'true-client-ip': req.headers.get('true-client-ip'),
      'client_provided': user_data?.client_ip_address,
      'final_ip': clientIp,
      'is_ipv6': clientIp.includes(':')
    });

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
        if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
        if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
        if (user_data.fn) hashedUserData.fn = user_data.fn;
        if (user_data.ln) hashedUserData.ln = user_data.ln;
        
        // External ID deve ser hasheado
        if (user_data.external_id) {
          if (user_data.external_id.match(/^[a-f0-9]{64}$/)) {
            hashedUserData.external_id = user_data.external_id;
          } else {
            hashedUserData.external_id = await sha256(user_data.external_id.toLowerCase().trim());
          }
        }
    }
    
    // SEMPRE adicionar IP do cliente (obrigatorio pelo Facebook)
    if (clientIp && clientIp !== 'unknown') {
      hashedUserData.client_ip_address = clientIp;
    }
    
    // Validar se temos dados minimos para identificacao
    const hasMinimumIdentification = 
      hashedUserData.fbp || 
      hashedUserData.fbc || 
      hashedUserData.em?.length > 0 || 
      hashedUserData.ph?.length > 0 ||
      hashedUserData.external_id;
    
    if (!hasMinimumIdentification) {
      console.warn('Evento ignorado: dados insuficientes para identificacao do usuario');
      return new Response(JSON.stringify({ 
        warning: 'Event skipped - insufficient user identification data',
        events_received: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Normalizar custom_data para garantir consistência com o Pixel do navegador
    const normalizedCustomData = custom_data ? {
      ...custom_data,
      // Garantir que value seja número com 2 casas decimais
      value: custom_data.value !== undefined ? parseFloat(Number(custom_data.value).toFixed(2)) : undefined,
      // Garantir que currency seja uppercase
      currency: custom_data.currency?.toUpperCase(),
    } : undefined;
    
    // Remover campos undefined do custom_data
    if (normalizedCustomData) {
      Object.keys(normalizedCustomData).forEach(key => {
        if (normalizedCustomData[key] === undefined) {
          delete normalizedCustomData[key];
        }
      });
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
          custom_data: normalizedCustomData,
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
