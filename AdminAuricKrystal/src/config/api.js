// Global API Configuration
// NOTE: env key is VITE_API_BASE_URL (see .env). Typo was adding an extra VITE_ prefix, which caused undefined base URLs in production.
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default VITE_API_BASE_URL;
