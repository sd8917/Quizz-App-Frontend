/**
 * Common meta tag configurations for each page
 */
export const pageMetas = {
  home: {
    title: 'Master Any Topic with Interactive Quizzes',
    description:
      'TriviaVerse - Master any topic with interactive quizzes. Test your knowledge, track progress, compete on leaderboards, and join millions worldwide.',
    keywords:
      'quiz app, online quiz, trivia, test knowledge, learning platform, interactive quizzes',
    canonicalUrl: 'https://triviaverse.site/',
  },
  login: {
    title: 'Login to Your Account',
    description: 'Sign in to TriviaVerse and access your personalized quiz experience.',
    keywords: 'quiz login, account login, TriviaVerse login',
    canonicalUrl: 'https://triviaverse.site/login',
  },
  register: {
    title: 'Create Your Free Account',
    description: 'Join TriviaVerse today and start testing your knowledge with interactive quizzes.',
    keywords: 'quiz registration, create account, free quiz platform',
    canonicalUrl: 'https://triviaverse.site/register',
  },
  about: {
    title: 'About TriviaVerse',
    description:
      'Learn about TriviaVerse - an interactive platform for knowledge testing and competitive learning.',
    keywords: 'about quiz platform, TriviaVerse information, learning platform',
    canonicalUrl: 'https://triviaverse.site/about',
  },
  dashboard: {
    title: 'Your Dashboard',
    description: 'View your quiz results, progress tracking, and personalized learning statistics.',
    keywords: 'quiz dashboard, progress tracking, learning statistics',
    canonicalUrl: 'https://triviaverse.site/dashboard',
  },
  leaderboard: {
    title: 'Global Leaderboard',
    description: 'Compete with users worldwide and see your ranking on our global leaderboard.',
    keywords: 'quiz leaderboard, rankings, global competition',
    canonicalUrl: 'https://triviaverse.site/leaderboard',
  },
  blog: {
    title: 'Blog & Resources',
    description: 'Read articles, tips, and resources to improve your learning and quiz performance.',
    keywords: 'quiz tips, learning blog, educational resources',
    canonicalUrl: 'https://triviaverse.site/blog',
  },
  help: {
    title: 'Help & Support Center',
    description: 'Find answers to common questions and get support for TriviaVerse.',
    keywords: 'FAQ, help center, support, quiz help',
    canonicalUrl: 'https://triviaverse.site/help',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with the TriviaVerse team. We are here to help.',
    keywords: 'contact us, support, feedback',
    canonicalUrl: 'https://triviaverse.site/contact',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Read our privacy policy to understand how we protect your data.',
    keywords: 'privacy policy, data protection',
    canonicalUrl: 'https://triviaverse.site/privacy-policy',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'Read our terms and conditions before using TriviaVerse.',
    keywords: 'terms of service, conditions',
    canonicalUrl: 'https://triviaverse.site/terms-conditions',
  },
  subscription: {
    title: 'AI Features Subscription',
    description: 'Unlock powerful AI features for quiz creation. AI-generated questions, smart analytics, and advanced tools for creators.',
    keywords: 'AI quiz generator, AI subscription, quiz creator tools, AI-powered quizzes, premium features',
    canonicalUrl: 'https://triviaverse.site/subscription',
  },
};


/**
 * SEO Helper functions for managing meta tags and structured data
 * Used with react-helmet-async or for client-side meta tag updates
 */

/**
 * Update document title and meta tags for a page
 * @param {Object} config - Configuration object
 * @param {string} config.title - Page title (auto-appends " | TriviaVerse")
 * @param {string} config.description - Meta description
 * @param {string} config.keywords - Meta keywords
 * @param {string} config.canonicalUrl - Canonical URL
 * @param {string} config.ogImage - OG image URL
 * @param {string} config.ogType - Open Graph type (default: "website")
 */
export const updatePageMeta = (config) => {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage = 'https://triviaverse.site/logo.png',
    ogType = 'website',
  } = config;

  // Update document title
  if (title) {
    document.title = `${title} | TriviaVerse`;
  }

  // Update or create meta tags
  updateMetaTag('description', description);
  updateMetaTag('keywords', keywords);
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', ogImage);
  updateMetaTag('og:type', ogType);
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', ogImage);

  // Update canonical URL
  if (canonicalUrl) {
    updateCanonicalUrl(canonicalUrl);
  }
};

/**
 * Helper to update or create a meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 */
const updateMetaTag = (name, content) => {
  if (!content) return;

  const isProperty = ['og:', 'twitter:', 'schema:'].some(prefix => name.startsWith(prefix));
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  
  let element = document.querySelector(selector);
  
  if (!element) {
    element = document.createElement('meta');
    const attrName = isProperty ? 'property' : 'name';
    element.setAttribute(attrName, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Update or create canonical URL
 * @param {string} url - Canonical URL
 */
const updateCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
};

/**
 * Add JSON-LD structured data to page
 * @param {Object} data - Structured data object
 * @param {string} id - Optional ID for the script tag
 */
export const addStructuredData = (data, id = 'structured-data') => {
  // Remove existing structured data if any
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and append new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generate BreadcrumbList schema
 * @param {Array} items - Array of {name, url} objects
 * @returns {Object} Structured data object
 */
export const generateBreadcrumbs = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate Article schema for blog posts
 * @param {Object} config - Article configuration
 * @returns {Object} Structured data object
 */
export const generateArticleSchema = (config) => {
  const {
    title,
    description,
    image,
    datePublished,
    dateModified,
    author,
    url,
  } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author || 'TriviaVerse Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TriviaVerse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://triviaverse.site/logo.png',
      },
    },
    url: url,
  };
};
