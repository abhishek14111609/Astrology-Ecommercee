// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
};

export default API_BASE_URL;
