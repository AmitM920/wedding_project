const API_BASE_URL = "http://127.0.0.1:8000/";

export const apiservices = {
    // Test Connecetion
    async helloDjango() {
        const response = await fetch(`${API_BASE_URL}/gallery/hello/`);
        return await response.json();
    },
    // Get all images
    async getImages() {
        const response = await fetch(`${API_BASE_URL}/gallery/images/`);
        return await response.json();
    },

    // Get images by category
    async getImagesByCategory(category) {
        const response = await fetch(`${API_BASE_URL}/gallery/images/?category=${category}`);
        return await response.json();
    },

    // Get all categories with counts
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/gallery/images/categories/`);
        return await response.json();
    },

    // Get featured images only
    async getFeaturedImages() {
        const response = await fetch(`${API_BASE_URL}/gallery/images/featured/`);
        return await response.json();
    }
};