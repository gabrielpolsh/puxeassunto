import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    fbq: any;
  }
}

interface MetaEventData {
  eventName: string;
  eventId?: string;
  emails?: string[];
  phones?: string[];
  firstName?: string;
  lastName?: string;
  externalId?: string; // ID do usuário no sistema
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
  contentType?: string;
  customData?: any;
}

// Storage keys for Meta parameters
const FBC_STORAGE_KEY = 'meta_fbc';
const FBCLID_STORAGE_KEY = 'meta_fbclid';
const USER_EMAIL_KEY = 'meta_user_email';
const USER_ID_KEY = 'meta_user_id';

export const metaService = {
  // Generate a unique Event ID
  generateEventId: () => {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Pegar dados do usuário logado automaticamente
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get FBP and FBC cookies
  getCookie: (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  },

  // Set cookie with expiration
  setCookie: (name: string, value: string, days: number = 90) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  // Generate FBC from fbclid in the correct Meta format
  // Format: fb.{subdomain_index}.{creation_time}.{fbclid}
  generateFbc: (fbclid: string): string => {
    const creationTime = Math.floor(Date.now() / 1000);
    // subdomain_index is 1 for single domain, 2 for subdomain
    return `fb.1.${creationTime}.${fbclid}`;
  },

  // Extract fbclid from URL
  getFbclidFromUrl: (): string | null => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fbclid');
  },

  // Get the best available fbc value (cookie > localStorage > generate from stored fbclid)
  getFbc: (): string | null => {
    if (typeof window === 'undefined') return null;

    // 1. Try to get from _fbc cookie (set by Meta Pixel)
    const fbcCookie = metaService.getCookie('_fbc');
    if (fbcCookie) {
      // Also save to localStorage as backup
      try {
        localStorage.setItem(FBC_STORAGE_KEY, fbcCookie);
      } catch (e) {}
      return fbcCookie;
    }

    // 2. Try to get from localStorage
    try {
      const storedFbc = localStorage.getItem(FBC_STORAGE_KEY);
      if (storedFbc) return storedFbc;
    } catch (e) {}

    // 3. Check if we have a stored fbclid and generate fbc from it
    try {
      const storedFbclid = localStorage.getItem(FBCLID_STORAGE_KEY);
      if (storedFbclid) {
        const generatedFbc = metaService.generateFbc(storedFbclid);
        localStorage.setItem(FBC_STORAGE_KEY, generatedFbc);
        return generatedFbc;
      }
    } catch (e) {}

    return null;
  },

  // Initialize: capture fbclid from URL and create fbc cookie/storage
  // Call this on app initialization
  initializeFbc: () => {
    if (typeof window === 'undefined') return;

    const fbclid = metaService.getFbclidFromUrl();
    
    if (fbclid) {
      console.log('[Meta] fbclid detected in URL:', fbclid);
      
      // Store fbclid for future use
      try {
        localStorage.setItem(FBCLID_STORAGE_KEY, fbclid);
      } catch (e) {}

      // Generate and store fbc
      const fbc = metaService.generateFbc(fbclid);
      console.log('[Meta] Generated fbc:', fbc);

      // Set as cookie (Meta Pixel might overwrite this, which is fine)
      metaService.setCookie('_fbc', fbc, 90);

      // Also store in localStorage as backup
      try {
        localStorage.setItem(FBC_STORAGE_KEY, fbc);
      } catch (e) {}
    } else {
      // Even without fbclid in URL, check if we have a stored value
      const existingFbc = metaService.getFbc();
      if (existingFbc) {
        console.log('[Meta] Using stored fbc:', existingFbc);
        // Ensure cookie is set
        if (!metaService.getCookie('_fbc')) {
          metaService.setCookie('_fbc', existingFbc, 90);
        }
      }
    }
  },

  // Store user data for better event matching (call this after login/signup)
  setUserData: (email?: string, userId?: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      if (email) {
        localStorage.setItem(USER_EMAIL_KEY, email.toLowerCase().trim());
        console.log('[Meta] User email stored for event matching');
      }
      if (userId) {
        localStorage.setItem(USER_ID_KEY, userId);
        console.log('[Meta] User ID stored for event matching');
      }
    } catch (e) {
      console.log('[Meta] Failed to store user data:', e);
    }
  },

  // Get stored user email
  getStoredEmail: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(USER_EMAIL_KEY);
    } catch (e) {
      return null;
    }
  },

  // Get stored user ID
  getStoredUserId: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(USER_ID_KEY);
    } catch (e) {
      return null;
    }
  },

  // Clear user data (call this on logout)
  clearUserData: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(USER_EMAIL_KEY);
      localStorage.removeItem(USER_ID_KEY);
      console.log('[Meta] User data cleared');
    } catch (e) {}
  },

  // Build checkout URL with user data (email, fbc) for better tracking and UX
  // SYNC version - uses only localStorage data to avoid popup blockers
  buildCheckoutUrl: (baseUrl: string): string => {
    const url = new URL(baseUrl);
    
    // 1. Add email if available (from localStorage - sync)
    const email = metaService.getStoredEmail();
    if (email) {
      url.searchParams.set('email', email);
      console.log('[Meta] Checkout URL with email:', email);
    }
    
    // 2. Add fbc if available (for Meta conversion tracking on checkout platform)
    const fbc = metaService.getFbc();
    if (fbc) {
      url.searchParams.set('fbc', fbc);
      console.log('[Meta] Checkout URL with fbc:', fbc);
    }
    
    // 3. Add fbp if available
    const fbp = metaService.getCookie('_fbp');
    if (fbp) {
      url.searchParams.set('fbp', fbp);
    }
    
    // 4. Add external_id (user id) if available (from localStorage - sync)
    const userId = metaService.getStoredUserId();
    if (userId) {
      url.searchParams.set('external_id', userId);
    }
    
    return url.toString();
  },

  // Cache for client IP (to avoid multiple API calls)
  _cachedClientIp: null as string | null,
  _ipFetchPromise: null as Promise<string | null> | null,

  // Get client IP address (preferably IPv6)
  // Uses external API to detect the user's real IP
  getClientIp: async (): Promise<string | null> => {
    // Return cached IP if available
    if (metaService._cachedClientIp) {
      return metaService._cachedClientIp;
    }

    // If already fetching, wait for that promise
    if (metaService._ipFetchPromise) {
      return metaService._ipFetchPromise;
    }

    // Start fetching IP
    metaService._ipFetchPromise = (async () => {
      try {
        // Try multiple services to get IPv6
        // 1. Try ipify (supports IPv6)
        const response = await fetch('https://api64.ipify.org?format=json', {
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.ip) {
            metaService._cachedClientIp = data.ip;
            console.log('[Meta] Client IP detected:', data.ip, 'IPv6:', data.ip.includes(':'));
            return data.ip;
          }
        }
      } catch (e) {
        console.log('[Meta] Failed to get client IP from ipify:', e);
      }

      try {
        // 2. Fallback to cloudflare trace
        const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
          signal: AbortSignal.timeout(3000)
        });
        
        if (cfResponse.ok) {
          const text = await cfResponse.text();
          const ipMatch = text.match(/ip=([^\n]+)/);
          if (ipMatch && ipMatch[1]) {
            metaService._cachedClientIp = ipMatch[1];
            console.log('[Meta] Client IP detected (CF):', ipMatch[1], 'IPv6:', ipMatch[1].includes(':'));
            return ipMatch[1];
          }
        }
      } catch (e) {
        console.log('[Meta] Failed to get client IP from Cloudflare:', e);
      }

      return null;
    })();

    const result = await metaService._ipFetchPromise;
    metaService._ipFetchPromise = null;
    return result;
  },

  // Track event
  trackEvent: async ({
    eventName,
    eventId,
    emails,
    phones,
    firstName,
    lastName,
    externalId,
    value,
    currency,
    contentName,
    contentIds,
    contentType,
    customData
  }: MetaEventData) => {
    const finalEventId = eventId || metaService.generateEventId();
    
    // Tentar pegar dados do usuário logado automaticamente
    let userEmails = emails;
    let userId = externalId;
    
    // 1. Primeiro tenta pegar do usuário logado no Supabase
    if (!userEmails || userEmails.length === 0 || !userId) {
      try {
        const currentUser = await metaService.getCurrentUser();
        if (currentUser) {
          if (!userEmails || userEmails.length === 0) {
            userEmails = currentUser.email ? [currentUser.email] : undefined;
          }
          if (!userId) {
            userId = currentUser.id;
          }
          // Salvar os dados para uso futuro
          if (currentUser.email || currentUser.id) {
            metaService.setUserData(currentUser.email, currentUser.id);
          }
        }
      } catch (e) {
        // Ignorar erros ao pegar usuário
      }
    }
    
    // 2. Se ainda não tiver, tenta pegar do localStorage (persistido de login anterior)
    if (!userEmails || userEmails.length === 0) {
      const storedEmail = metaService.getStoredEmail();
      if (storedEmail) {
        userEmails = [storedEmail];
        console.log('[Meta] Using stored email for event matching');
      }
    }
    
    if (!userId) {
      const storedUserId = metaService.getStoredUserId();
      if (storedUserId) {
        userId = storedUserId;
        console.log('[Meta] Using stored userId for event matching');
      }
    }
    
    // 1. Track via Browser Pixel (Client-side)
    if (typeof window !== 'undefined' && window.fbq) {
      const pixelData: any = {
        ...customData,
        value,
        currency,
        content_name: contentName,
        content_ids: contentIds,
        content_type: contentType,
      };
      
      // Clean undefined values
      Object.keys(pixelData).forEach(key => pixelData[key] === undefined && delete pixelData[key]);

      window.fbq('track', eventName, pixelData, { eventID: finalEventId });
    }

    // 2. Track via Conversions API (Server-side)
    try {
      const fbp = metaService.getCookie('_fbp');
      // Use getFbc() to get fbc from cookie, localStorage, or generated from fbclid
      const fbc = metaService.getFbc();
      
      // Log fbc status for debugging
      if (fbc) {
        console.log(`[Meta CAPI] fbc found for ${eventName}:`, fbc);
      } else {
        console.log(`[Meta CAPI] No fbc available for ${eventName}`);
      }
      
      // Verificar se temos dados mínimos para identificação
      // Meta exige pelo menos um: fbp, fbc, email, telefone ou external_id
      const hasMinimumData = fbp || fbc || (userEmails && userEmails.length > 0) || (phones && phones.length > 0) || userId;
      
      if (!hasMinimumData) {
        console.log('CAPI: Ignorando evento - dados insuficientes para identificação do usuário');
        return; // Não envia para CAPI, mas o pixel do browser já foi disparado
      }

      const userData: any = {
        client_user_agent: navigator.userAgent,
      };

      // Try to get client IP (preferably IPv6) for better matching
      try {
        const clientIp = await metaService.getClientIp();
        if (clientIp) {
          userData.client_ip_address = clientIp;
          console.log(`[Meta CAPI] Sending IP for ${eventName}:`, clientIp, 'IPv6:', clientIp.includes(':'));
        }
      } catch (e) {
        console.log('[Meta CAPI] Could not get client IP:', e);
      }
      
      // Só adicionar fbp/fbc se existirem
      if (fbp) userData.fbp = fbp;
      if (fbc) userData.fbc = fbc;

      if (userEmails && userEmails.length > 0) userData.em = userEmails;
      if (phones && phones.length > 0) userData.ph = phones;
      if (userId) userData.external_id = userId;
      // Note: First/Last name should ideally be hashed, but our Edge Function handles hashing for em/ph.
      // For fn/ln, we'll pass them as is and let the Edge Function handle or ignore (currently ignores hashing for fn/ln but passes them).
      // To be safe and compliant, we should probably hash them here or in the edge function.
      // The edge function I wrote only hashes em and ph.
      
      const serverCustomData: any = {
        ...customData,
        value,
        currency,
        content_name: contentName,
        content_ids: contentIds,
        content_type: contentType,
      };
      
      // Clean undefined values
      Object.keys(serverCustomData).forEach(key => serverCustomData[key] === undefined && delete serverCustomData[key]);

      await supabase.functions.invoke('meta-conversions', {
        body: {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: window.location.href,
          action_source: 'website',
          event_id: finalEventId,
          user_data: userData,
          custom_data: serverCustomData,
        },
      });
    } catch (error) {
      console.error('Error sending event to CAPI:', error);
    }
  }
};
