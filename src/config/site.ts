/**
 * Centralized Application Configuration
 * All constants, URLs, and 3rd-party integration options are managed here.
 * Nothing is hardcoded; all values can be configured via environment variables.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'SimBusiness',
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'SimBusiness — Dropshipping Business Simulation',
  description: 
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    'A modern, minimalist e-commerce and dropshipping simulation platform. Master inventory, marketing, and unit economics without financial risk.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://simbusiness.vercel.app',
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'jatindudhani07@gmail.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (800) 555-0199',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '100 Commerce Boulevard, Suite 400, San Francisco, CA',
  },
  admin: {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jatindudhani07@gmail.com',
    name: 'Jatin Dudhani',
  },
  socials: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/Jatin-dudhani/simbusiness',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com',
  },
  version: '2.4.0',
};

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com',
  timeoutMs: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 8000,
  /**
   * Optional 3rd Party API keys for live production services.
   * If not provided, SimBusiness runs in autonomous high-fidelity simulation mode.
   */
  thirdPartyKeys: {
    // E.g. Stripe publishable key for real payment processing test mode
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    // Currency conversion API key (e.g. OpenExchangeRates, Fixer.io)
    exchangeRateApiKey: process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '',
    // Real supplier catalogs (e.g. AliExpress API, Printful, CJ Dropshipping)
    supplierApiKey: process.env.NEXT_PUBLIC_SUPPLIER_API_KEY || '',
    // AI insights & product description generator (e.g. Gemini / OpenAI)
    aiApiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
  },
};

export const businessDefaults = {
  currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',
  taxRate: Number(process.env.NEXT_PUBLIC_DEFAULT_TAX_RATE) || 7.5,
  shippingFee: Number(process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_FEE) || 4.99,
  targetMargin: Number(process.env.NEXT_PUBLIC_DEFAULT_MARGIN) || 35,
  initialInventory: Number(process.env.NEXT_PUBLIC_INITIAL_INVENTORY) || 25,
  initialBudget: Number(process.env.NEXT_PUBLIC_INITIAL_BUDGET) || 250,
};
