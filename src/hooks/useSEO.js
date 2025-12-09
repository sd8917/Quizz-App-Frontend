import { useEffect } from 'react';
import { updatePageMeta, addStructuredData, pageMetas } from '../utils/seoHelpers';

/**
 * Custom hook to manage page SEO metadata
 * @param {Object|string} config - Meta configuration object or key from pageMetas
 * @param {string} config.title - Page title
 * @param {string} config.description - Meta description
 * @param {string} config.keywords - Meta keywords
 * @param {string} config.canonicalUrl - Canonical URL
 * @param {string} config.ogImage - OG image URL
 * @param {Object} structuredData - Optional structured data to add (JSON-LD)
 */
export const useSEO = (config, structuredData = null) => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    // Get config from pageMetas if string key is provided
    const metaConfig = typeof config === 'string' ? pageMetas[config] || {} : config;

    // Update meta tags
    updatePageMeta(metaConfig);

    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }
  }, [config, structuredData]);
};

export default useSEO;
