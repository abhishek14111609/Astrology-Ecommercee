// Centralized API configuration
export const VITE_API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${VITE_API_BASE_URL}${cleanEndpoint}`;
};

// Helper function to build image URLs
export const buildImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // If it's a relative path, prepend the API base URL and /uploads
    // Remove leading slash to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${VITE_API_BASE_URL}/uploads${cleanPath}`;
};

export default VITE_API_BASE_URL;
