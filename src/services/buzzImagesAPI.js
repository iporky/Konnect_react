import api from './api';

// Buzz Images API wrapper for /buzz-images endpoint
// Base URL comes from REACT_APP_API_BASE_URL in environment (.env)
// Example: GET /buzz-images/?skip=0&limit=100

export const buzzImagesAPI = {
  /**
   * Fetch list of buzz images.
   * @param {Object} params
   * @param {number} [params.skip=0] - Number of records to skip (pagination offset)
   * @param {number} [params.limit=20] - Max number of records to return
   * @returns {Promise<Array>} Array of image objects: { id, title, description, url, created_at, updated_at }
   */
  async list({ skip = 0, limit = 10 } = {}) {
    const searchParams = new URLSearchParams();
    searchParams.set('skip', String(skip));
    searchParams.set('limit', String(limit));
    const { data } = await api.get(`/buzz-images/?${searchParams.toString()}`);
    return data;
  },
};

export default buzzImagesAPI;