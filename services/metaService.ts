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
const FBC_CREATION_TIME_KEY = 'meta_fbc_creation_time';
const ANONYMOUS_ID_KEY = 'meta_anonymous_id';

// Meta Parameter Config Tool - Version tracking
const META_PARAM_CONFIG_VERSION = '1.1.0';

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
  // Following Meta's Parameter Config Tool specifications
  generateFbc: (fbclid: string, existingCreationTime?: number): string => {
    // Use existing creation time if provided (for consistency)
    // Otherwise use current timestamp in milliseconds (Meta's preferred format)
    const creationTime = existingCreationTime || Date.now();
    
    // Store creation time for future reference
    try {
      localStorage.setItem(FBC_CREATION_TIME_KEY, creationTime.toString());
    } catch (e) {}
    
    // subdomain_index: 1 for main domain, 2 for subdomain
    // Using 1 as default for single domain setup
    return `fb.1.${creationTime}.${fbclid}`;
  },

  // Parse existing fbc to extract components
  parseFbc: (fbc: string): { subdomainIndex: number; creationTime: number; fbclid: string } | null => {
    if (!fbc) return null;
    const parts = fbc.split('.');
    if (parts.length !== 4 || parts[0] !== 'fb') return null;
    return {
      subdomainIndex: parseInt(parts[1], 10),
      creationTime: parseInt(parts[2], 10),
      fbclid: parts[3]
    };
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
        // Try to use stored creation time for consistency
        const storedCreationTime = localStorage.getItem(FBC_CREATION_TIME_KEY);
        const creationTime = storedCreationTime ? parseInt(storedCreationTime, 10) : undefined;
        const generatedFbc = metaService.generateFbc(storedFbclid, creationTime);
        localStorage.setItem(FBC_STORAGE_KEY, generatedFbc);
        // Also set cookie for cross-page persistence
        metaService.setCookie('_fbc', generatedFbc, 90);
        return generatedFbc;
      }
    } catch (e) {}

    // 4. Check URL for fbclid as last resort (might be a direct landing)
    const urlFbclid = metaService.getFbclidFromUrl();
    if (urlFbclid) {
      const newFbc = metaService.generateFbc(urlFbclid);
      try {
        localStorage.setItem(FBCLID_STORAGE_KEY, urlFbclid);
        localStorage.setItem(FBC_STORAGE_KEY, newFbc);
      } catch (e) {}
      metaService.setCookie('_fbc', newFbc, 90);
      return newFbc;
    }

    return null;
  },

  // Initialize: capture fbclid from URL and create fbc cookie/storage
  // Implements Meta's Parameter Config Tool specifications
  // Call this on app initialization
  initializeFbc: () => {
    if (typeof window === 'undefined') return;

    console.log('[Meta Parameter Config] Initializing fbc capture v' + META_PARAM_CONFIG_VERSION);

    const fbclid = metaService.getFbclidFromUrl();
    const existingFbc = metaService.getCookie('_fbc');
    const storedFbc = (() => {
      try { return localStorage.getItem(FBC_STORAGE_KEY); } catch (e) { return null; }
    })();
    
    if (fbclid) {
      console.log('[Meta Parameter Config] fbclid detected in URL:', fbclid.substring(0, 20) + '...');
      
      // Check if we already have fbc with this fbclid
      const parsedExisting = storedFbc ? metaService.parseFbc(storedFbc) : null;
      
      if (parsedExisting && parsedExisting.fbclid === fbclid) {
        // Same fbclid, keep existing fbc with original timestamp
        console.log('[Meta Parameter Config] Existing fbc matches current fbclid, keeping original');
        // Ensure cookie is set
        if (!existingFbc) {
          metaService.setCookie('_fbc', storedFbc!, 90);
        }
      } else {
        // New fbclid, generate new fbc
        // Store fbclid for future use
        try {
          localStorage.setItem(FBCLID_STORAGE_KEY, fbclid);
        } catch (e) {}

        // Generate and store fbc with current timestamp
        const fbc = metaService.generateFbc(fbclid);
        console.log('[Meta Parameter Config] Generated new fbc:', fbc.substring(0, 30) + '...');

        // Set as first-party cookie (important for cross-page persistence)
        metaService.setCookie('_fbc', fbc, 90);

        // Also store in localStorage as backup
        try {
          localStorage.setItem(FBC_STORAGE_KEY, fbc);
        } catch (e) {}
      }
    } else {
      // No fbclid in URL, check for stored values
      const fbcToUse = existingFbc || storedFbc;
      
      if (fbcToUse) {
        console.log('[Meta Parameter Config] Using stored fbc:', fbcToUse.substring(0, 30) + '...');
        
        // Ensure cookie is set for cross-page persistence
        if (!existingFbc && storedFbc) {
          metaService.setCookie('_fbc', storedFbc, 90);
        }
        
        // Ensure localStorage is synced
        if (existingFbc && !storedFbc) {
          try {
            localStorage.setItem(FBC_STORAGE_KEY, existingFbc);
          } catch (e) {}
        }
      } else {
        console.log('[Meta Parameter Config] No fbc available - user did not come from Facebook ad');
      }
    }
    
    // Log final fbc status for debugging
    const finalFbc = metaService.getFbc();
    console.log('[Meta Parameter Config] Final fbc status:', finalFbc ? 'AVAILABLE' : 'NOT AVAILABLE');
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

  // Generate anonymous ID for visitors who are not logged in
  // This ensures 100% coverage of external_id parameter
  generateAnonymousId: (): string => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const randomPart2 = Math.random().toString(36).substring(2, 15);
    return `anon_${timestamp}_${randomPart}${randomPart2}`;
  },

  // Get or create anonymous ID (persists across sessions)
  getAnonymousId: (): string => {
    if (typeof window === 'undefined') return metaService.generateAnonymousId();
    
    try {
      let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
      
      if (!anonymousId) {
        anonymousId = metaService.generateAnonymousId();
        localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
        console.log('[Meta] Created new anonymous ID for event matching');
      }
      
      return anonymousId;
    } catch (e) {
      // If localStorage fails, generate a session-only ID
      return metaService.generateAnonymousId();
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

  // Cache for client IP (to avoid multiple API calls)
  _cachedClientIp: null as string | null,
  _ipFetchPromise: null as Promise<string | null> | null,

  // Check if an IP address is IPv6
  isIPv6: (ip: string): boolean => {
    return ip.includes(':');
  },

  // Get client IP address (PRIORITIZING IPv6 as recommended by Meta)
  // IPv6 is the industry standard and provides better matching for Meta CAPI
  // Uses multiple external APIs to detect the user's real IP with IPv6 preference
  getClientIp: async (): Promise<string | null> => {
    // Return cached IP if available
    if (metaService._cachedClientIp) {
      return metaService._cachedClientIp;
    }

    // If already fetching, wait for that promise
    if (metaService._ipFetchPromise) {
      return metaService._ipFetchPromise;
    }

    // Start fetching IP with IPv6 priority
    metaService._ipFetchPromise = (async () => {
      let ipv4Fallback: string | null = null;

      // Strategy: Try IPv6-first endpoints, store IPv4 as fallback
      
      try {
        // 1. Try ipify IPv6-only endpoint first (most reliable for IPv6)
        const ipv6Response = await fetch('https://api6.ipify.org?format=json', {
          signal: AbortSignal.timeout(2000) // 2 second timeout for faster fallback
        });
        
        if (ipv6Response.ok) {
          const data = await ipv6Response.json();
          if (data.ip && metaService.isIPv6(data.ip)) {
            metaService._cachedClientIp = data.ip;
            console.log('[Meta IPv6] ✓ IPv6 detected via ipify:', data.ip);
            return data.ip;
          }
        }
      } catch (e) {
        console.log('[Meta IPv6] ipify IPv6-only endpoint not available');
      }

      try {
        // 2. Try api64.ipify.org (dual-stack, prefers IPv6)
        const response = await fetch('https://api64.ipify.org?format=json', {
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.ip) {
            if (metaService.isIPv6(data.ip)) {
              metaService._cachedClientIp = data.ip;
              console.log('[Meta IPv6] ✓ IPv6 detected via api64:', data.ip);
              return data.ip;
            } else {
              // Store IPv4 as fallback
              ipv4Fallback = data.ip;
              console.log('[Meta IPv6] IPv4 detected, continuing to search for IPv6...');
            }
          }
        }
      } catch (e) {
        console.log('[Meta IPv6] api64.ipify.org failed');
      }

      try {
        // 3. Try Cloudflare trace (often has IPv6)
        const cfResponse = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
          signal: AbortSignal.timeout(2000)
        });
        
        if (cfResponse.ok) {
          const text = await cfResponse.text();
          const ipMatch = text.match(/ip=([^\n]+)/);
          if (ipMatch && ipMatch[1]) {
            const cfIp = ipMatch[1];
            if (metaService.isIPv6(cfIp)) {
              metaService._cachedClientIp = cfIp;
              console.log('[Meta IPv6] ✓ IPv6 detected via Cloudflare:', cfIp);
              return cfIp;
            } else if (!ipv4Fallback) {
              ipv4Fallback = cfIp;
            }
          }
        }
      } catch (e) {
        console.log('[Meta IPv6] Cloudflare trace failed');
      }

      try {
        // 4. Try icanhazip (simple, often returns IPv6)
        const icanhazResponse = await fetch('https://icanhazip.com', {
          signal: AbortSignal.timeout(2000)
        });
        
        if (icanhazResponse.ok) {
          const ip = (await icanhazResponse.text()).trim();
          if (ip) {
            if (metaService.isIPv6(ip)) {
              metaService._cachedClientIp = ip;
              console.log('[Meta IPv6] ✓ IPv6 detected via icanhazip:', ip);
              return ip;
            } else if (!ipv4Fallback) {
              ipv4Fallback = ip;
            }
          }
        }
      } catch (e) {
        console.log('[Meta IPv6] icanhazip failed');
      }

      // If no IPv6 found, use IPv4 fallback (still better than nothing)
      if (ipv4Fallback) {
        metaService._cachedClientIp = ipv4Fallback;
        console.log('[Meta IPv6] ⚠ No IPv6 available, using IPv4 fallback:', ipv4Fallback);
        return ipv4Fallback;
      }

      console.log('[Meta IPv6] ✗ Could not detect client IP');
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
    
    // 3. Se ainda não tiver userId, usar ID anônimo para garantir 100% de cobertura
    // Isso melhora significativamente a qualidade da correspondência de eventos
    if (!userId) {
      userId = metaService.getAnonymousId();
      console.log('[Meta] Using anonymous ID for event matching (improves external_id coverage)');
    }
    
    // Normalizar value e currency para consistência entre Pixel e CAPI
    const normalizedValue = value !== undefined ? parseFloat(value.toFixed(2)) : undefined;
    const normalizedCurrency = currency?.toUpperCase();
    
    // 1. Track via Browser Pixel (Client-side)
    if (typeof window !== 'undefined') {
      const pixelData: any = {
        ...customData,
        value: normalizedValue,
        currency: normalizedCurrency,
        content_name: contentName,
        content_ids: contentIds,
        content_type: contentType,
      };
      
      // Clean undefined values
      Object.keys(pixelData).forEach(key => pixelData[key] === undefined && delete pixelData[key]);

      // Se o fbq ainda não carregou, usa a queue global ou tenta novamente
      if (window.fbq) {
        window.fbq('track', eventName, pixelData, { eventID: finalEventId });
        console.log(`[Meta Pixel] Event ${eventName} sent directly`);
      } else {
        // O pixel pode não ter carregado ainda (está com delay de 2.5s)
        // Vamos aguardar e tentar novamente
        const waitForPixel = (attempts: number = 0) => {
          if (window.fbq) {
            window.fbq('track', eventName, pixelData, { eventID: finalEventId });
            console.log(`[Meta Pixel] Event ${eventName} sent after waiting`);
          } else if (attempts < 20) {
            // Tenta por até 10 segundos (20 * 500ms)
            setTimeout(() => waitForPixel(attempts + 1), 500);
          } else {
            console.warn(`[Meta Pixel] fbq not available after timeout for ${eventName}`);
          }
        };
        waitForPixel();
      }
    }

    // 2. Track via Conversions API (Server-side)
    try {
      const fbp = metaService.getCookie('_fbp');
      // Use getFbc() to get fbc from cookie, localStorage, or generated from fbclid
      const fbc = metaService.getFbc();
      
      // Enhanced logging for Meta Parameter Config Tool debugging
      console.log(`[Meta Parameter Config] Event: ${eventName}`);
      console.log(`[Meta Parameter Config] fbp: ${fbp ? 'PRESENT' : 'NOT AVAILABLE'}`);
      console.log(`[Meta Parameter Config] fbc: ${fbc ? 'PRESENT (' + fbc.substring(0, 30) + '...)' : 'NOT AVAILABLE'}`);
      
      if (!fbc) {
        console.log('[Meta Parameter Config] fbc not available - user may not have come from Facebook ad');
        console.log('[Meta Parameter Config] Checking sources: cookie _fbc:', metaService.getCookie('_fbc'));
        try {
          console.log('[Meta Parameter Config] localStorage fbc:', localStorage.getItem(FBC_STORAGE_KEY));
          console.log('[Meta Parameter Config] localStorage fbclid:', localStorage.getItem(FBCLID_STORAGE_KEY));
        } catch (e) {}
        console.log('[Meta Parameter Config] URL fbclid:', metaService.getFbclidFromUrl());
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
        value: normalizedValue,
        currency: normalizedCurrency,
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
  },

  // Meta Parameter Config Tool - Diagnostic function
  // Call this from browser console: metaService.diagnoseFbc()
  diagnoseFbc: () => {
    if (typeof window === 'undefined') {
      console.log('[Meta Parameter Config Diagnostic] Not running in browser');
      return null;
    }

    const diagnostic = {
      version: META_PARAM_CONFIG_VERSION,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      
      // URL Parameters
      urlFbclid: metaService.getFbclidFromUrl(),
      
      // Cookie values
      fbcCookie: metaService.getCookie('_fbc'),
      fbpCookie: metaService.getCookie('_fbp'),
      
      // LocalStorage values
      storedFbc: null as string | null,
      storedFbclid: null as string | null,
      storedCreationTime: null as string | null,
      
      // Final computed fbc
      computedFbc: null as string | null,
      
      // External ID coverage
      userId: null as string | null,
      userEmail: null as string | null,
      anonymousId: null as string | null,
      externalIdSource: 'none' as 'user' | 'stored' | 'anonymous' | 'none',
      
      // Status
      fbcAvailable: false,
      fbcSource: 'none' as 'cookie' | 'localStorage' | 'generated' | 'url' | 'none',
      externalIdAvailable: false
    };

    // Get localStorage values
    try {
      diagnostic.storedFbc = localStorage.getItem(FBC_STORAGE_KEY);
      diagnostic.storedFbclid = localStorage.getItem(FBCLID_STORAGE_KEY);
      diagnostic.storedCreationTime = localStorage.getItem(FBC_CREATION_TIME_KEY);
      diagnostic.userId = localStorage.getItem(USER_ID_KEY);
      diagnostic.userEmail = localStorage.getItem(USER_EMAIL_KEY);
      diagnostic.anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
    } catch (e) {
      console.log('[Meta Parameter Config Diagnostic] LocalStorage access failed');
    }

    // Determine fbc source
    if (diagnostic.fbcCookie) {
      diagnostic.fbcSource = 'cookie';
      diagnostic.computedFbc = diagnostic.fbcCookie;
    } else if (diagnostic.storedFbc) {
      diagnostic.fbcSource = 'localStorage';
      diagnostic.computedFbc = diagnostic.storedFbc;
    } else if (diagnostic.storedFbclid) {
      diagnostic.fbcSource = 'generated';
      diagnostic.computedFbc = metaService.getFbc();
    } else if (diagnostic.urlFbclid) {
      diagnostic.fbcSource = 'url';
      diagnostic.computedFbc = metaService.getFbc();
    }

    diagnostic.fbcAvailable = !!diagnostic.computedFbc;
    
    // Determine external_id source
    if (diagnostic.userId) {
      diagnostic.externalIdSource = 'user';
      diagnostic.externalIdAvailable = true;
    } else if (diagnostic.anonymousId) {
      diagnostic.externalIdSource = 'anonymous';
      diagnostic.externalIdAvailable = true;
    } else {
      // Generate anonymous ID on first diagnostic run
      diagnostic.anonymousId = metaService.getAnonymousId();
      diagnostic.externalIdSource = 'anonymous';
      diagnostic.externalIdAvailable = true;
    }

    // Log formatted diagnostic
    console.log('='.repeat(60));
    console.log('[Meta Parameter Config Tool - Diagnostic Report]');
    console.log('='.repeat(60));
    console.log('Version:', diagnostic.version);
    console.log('Timestamp:', diagnostic.timestamp);
    console.log('URL:', diagnostic.url);
    console.log('-'.repeat(60));
    console.log('URL fbclid:', diagnostic.urlFbclid || '(not present)');
    console.log('-'.repeat(60));
    console.log('Cookie _fbc:', diagnostic.fbcCookie || '(not set)');
    console.log('Cookie _fbp:', diagnostic.fbpCookie || '(not set)');
    console.log('-'.repeat(60));
    console.log('LocalStorage fbc:', diagnostic.storedFbc || '(not stored)');
    console.log('LocalStorage fbclid:', diagnostic.storedFbclid || '(not stored)');
    console.log('LocalStorage creation time:', diagnostic.storedCreationTime || '(not stored)');
    console.log('-'.repeat(60));
    console.log('EXTERNAL ID COVERAGE:');
    console.log('  User ID (logged in):', diagnostic.userId || '(not logged in)');
    console.log('  User Email:', diagnostic.userEmail || '(not available)');
    console.log('  Anonymous ID:', diagnostic.anonymousId || '(will be created)');
    console.log('  Source:', diagnostic.externalIdSource);
    console.log('  Coverage:', diagnostic.externalIdAvailable ? '100% ✓' : 'MISSING ✗');
    console.log('-'.repeat(60));
    console.log('Final fbc:', diagnostic.computedFbc || '(NOT AVAILABLE)');
    console.log('fbc Source:', diagnostic.fbcSource);
    console.log('fbc Available:', diagnostic.fbcAvailable ? 'YES ✓' : 'NO ✗');
    console.log('-'.repeat(60));
    console.log('IPv6 STATUS:');
    const cachedIp = metaService._cachedClientIp;
    if (cachedIp) {
      const isIPv6 = metaService.isIPv6(cachedIp);
      console.log('  Cached IP:', cachedIp);
      console.log('  Type:', isIPv6 ? 'IPv6 ✓ (recommended)' : 'IPv4 ⚠ (IPv6 preferred)');
    } else {
      console.log('  Cached IP: (not yet fetched - will be fetched on next event)');
    }
    console.log('='.repeat(60));

    if (!diagnostic.fbcAvailable) {
      console.log('[Recommendation] User did not arrive from a Facebook ad click.');
      console.log('[Recommendation] To test, add ?fbclid=test123 to your URL');
    }

    return diagnostic;
  },

  // Diagnose IPv6 status - fetch IP and show result
  diagnoseIPv6: async () => {
    console.log('='.repeat(60));
    console.log('[Meta IPv6 Diagnostic] Fetching client IP...');
    console.log('='.repeat(60));
    
    // Clear cache to force fresh fetch
    metaService._cachedClientIp = null;
    
    const ip = await metaService.getClientIp();
    
    console.log('-'.repeat(60));
    if (ip) {
      const isIPv6 = metaService.isIPv6(ip);
      console.log('Result:', ip);
      console.log('Type:', isIPv6 ? 'IPv6 ✓' : 'IPv4');
      console.log('Status:', isIPv6 ? 'OPTIMAL - Meta will receive IPv6' : 'FALLBACK - Your network may not support IPv6');
      
      if (!isIPv6) {
        console.log('-'.repeat(60));
        console.log('[Note] IPv4 was returned. This could mean:');
        console.log('  1. Your ISP does not support IPv6');
        console.log('  2. Your network/router has IPv6 disabled');
        console.log('  3. The IP detection services only returned IPv4');
        console.log('IPv4 still works, but IPv6 provides better matching.');
      }
    } else {
      console.log('Result: Could not detect IP');
      console.log('Status: ERROR - IP detection failed');
    }
    console.log('='.repeat(60));
    
    return { ip, isIPv6: ip ? metaService.isIPv6(ip) : false };
  }
};
