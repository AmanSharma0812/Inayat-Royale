// Central SEO configuration
// Update SITE_URL to your production domain when deploying
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.inayatroyale.com';
export const SITE_NAME = 'Inayat Royale';
// OG image served from our own domain — avoids Unsplash dependency and matches our brand
export const DEFAULT_OG_IMAGE = `${import.meta.env.VITE_SITE_URL || 'https://www.inayatroyale.com'}/hero_banner_luxury.jpeg`;
export const LOGO_URL = `${import.meta.env.VITE_SITE_URL || 'https://www.inayatroyale.com'}/logo.png`;
export const WHATSAPP_NUMBER = '919814589421'; // Real number provided by user
export const WHATSAPP_MESSAGE_DEFAULT = "Hi, I'm interested in your jewellery collection.";
