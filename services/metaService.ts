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
        }
      } catch (e) {
        // Ignorar erros ao pegar usuário
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
      const fbc = metaService.getCookie('_fbc');
      
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
