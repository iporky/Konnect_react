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

  /**
   * Toggle like status for a buzz image
   * @param {string} imageId - The ID of the buzz image
   * @returns {Promise<Object>} Updated like status and count
   */
  async toggleLike(imageId) {
    const { data } = await api.post(`/buzz-images/${imageId}/like`);
    return data;
  },

  /**
   * Get likes for a buzz image
   * @param {string} imageId - The ID of the buzz image
   * @returns {Promise<Object>} Like status and count
   */
  async getLikes(imageId) {
    const { data } = await api.get(`/buzz-images/${imageId}/likes`);
    return data;
  },

  /**
   * Add a comment to a buzz image
   * @param {string} imageId - The ID of the buzz image
   * @param {string} content - The comment content
   * @returns {Promise<Object>} Created comment object
   */
  async addComment(imageId, content) {
    const { data } = await api.post(`/buzz-images/${imageId}/comments`, {
      content
    });
    return data;
  },

  /**
   * Get comments for a buzz image
   * @param {string} imageId - The ID of the buzz image
   * @param {Object} params
   * @param {number} [params.skip=0] - Number of comments to skip
   * @param {number} [params.limit=10] - Max number of comments to return
   * @returns {Promise<Array>} Array of comment objects
   */
  async getComments(imageId, { skip = 0, limit = 10 } = {}) {
    const searchParams = new URLSearchParams();
    searchParams.set('skip', String(skip));
    searchParams.set('limit', String(limit));
    const { data } = await api.get(`/buzz-images/${imageId}/comments?${searchParams.toString()}`);
    return data;
  },

  /**
   * Delete a comment
   * @param {string} imageId - The ID of the buzz image
   * @param {string} commentId - The ID of the comment
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteComment(imageId, commentId) {
    const { data } = await api.delete(`/buzz-images/${imageId}/comments/${commentId}`);
    return data;
  },
};

export default buzzImagesAPI;
