import api from './api';

// Community / Buzz image upload (maps to /buzz-images/ endpoint)
export const communityAPI = {
  /**
   * Upload a single image with title & description.
   * Only the first file is used if multiple provided.
   * @param {Object} payload { title, description, files: File[] }
   */
  async uploadBuzzImage({ title = '', description = '', files = [] }) {
    if (!files.length) throw new Error('No file provided');
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    const { data } = await api.post('/buzz-images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

export default communityAPI;
