import api from './api';

// Users API for searching and creating users (custom backend endpoints)
// Base env REACT_APP_API_BASE_URL should already include protocol+host

export const usersAPI = {
  // GET /api/v1/users/search/email/{encodedEmail}
  searchByEmail: async (email) => {
    const encoded = encodeURIComponent(email);
    const response = await api.get(`/users/search/email/${encoded}`);
    return response.data; // Expect either user object or 404 handled by caller
  },

  // POST /api/v1/users/
  create: async (userPayload) => {
    const response = await api.post('/users/', userPayload);
    return response.data; // Expect created user object
  }
};

export default usersAPI;
