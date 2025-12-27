// services/api.js
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") + '/api';
// Request timeout configuration
const REQUEST_TIMEOUT = 15000;

// HTTP status code handlers
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Common fetch wrapper with timeout and error handling
const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        return await handleResponse(response);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please check your connection.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const apiServices = {
    // Test Connection
    async helloDjango() {
        return fetchWithTimeout(`${API_BASE_URL}/gallery/hello/`);
    },

    // Get all images with pagination support
    async getImages(page = 1, pageSize = 20) {
        return fetchWithTimeout(
            `${API_BASE_URL}/gallery/images/?page=${page}&page_size=${pageSize}`
        );
    },

    // Get images by category
    async getImagesByCategory(category, page = 1, pageSize = 20) {
        return fetchWithTimeout(
            `${API_BASE_URL}/gallery/images/?category=${encodeURIComponent(category)}&page=${page}&page_size=${pageSize}`
        );
    },

    // Get all categories with counts
    async getCategories() {
        return fetchWithTimeout(`${API_BASE_URL}/gallery/images/categories/`);
    },

    // Get featured images
    async getFeaturedImages(limit = 8) {
        return fetchWithTimeout(
            `${API_BASE_URL}/gallery/images/featured/?limit=${limit}`
        );
    }
};