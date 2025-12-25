import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  noIndex?: boolean;
}

/**
 * SEOHead - Componente para gerenciar meta tags SEO dinamicamente
 * Atualiza o document head com as meta tags apropriadas para cada página
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://puxeassunto.com/og-image.png',
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  noIndex = false,
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        const [attrType, attrValue] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrType, attrValue.replace(/"/g, ''));
        element.setAttribute(attribute, content);
        document.head.appendChild(element);
      }
    };

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    // Basic meta tags
    updateMetaTag('meta[name="description"]', description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    // Robots
    if (noIndex) {
      updateMetaTag('meta[name="robots"]', 'noindex, nofollow');
    } else {
      updateMetaTag('meta[name="robots"]', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Open Graph
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', canonicalUrl);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:type"]', ogType);

    // Twitter
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', ogImage);
    updateMetaTag('meta[name="twitter:url"]', canonicalUrl);

    // Article specific (for blog posts)
    if (ogType === 'article' && articlePublishedTime) {
      updateMetaTag('meta[property="article:published_time"]', articlePublishedTime);
      if (articleModifiedTime) {
        updateMetaTag('meta[property="article:modified_time"]', articleModifiedTime);
      }
    }

    // Cleanup function to restore defaults when component unmounts
    return () => {
      document.title = 'Puxe Assunto - IA que Gera Respostas para WhatsApp, Tinder e Instagram';
      if (canonical) {
        canonical.href = 'https://puxeassunto.com/';
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, articlePublishedTime, articleModifiedTime, noIndex]);

  return null; // This component doesn't render anything
};

export default SEOHead;
