import api from './api';

// Chat API - matches the original /api/chat endpoint exactly
export const chatAPI = {
  sendMessage: async (message, additionalData = {}) => {
    const formData = new FormData();
    formData.append('message', message);
    
    // Add location data if available
    if (additionalData.userLocation) {
      const locationData = additionalData.userLocation;
      if (locationData.lat && locationData.lon) {
        formData.append('user_location', `${locationData.lat},${locationData.lon}`);
      } else if (locationData.ip) {
        formData.append('user_ip_address', locationData.ip);
      }
      formData.append('location', JSON.stringify(locationData));
    }
    
    // Add user email if available
    if (additionalData.userEmail) {
      formData.append('email', additionalData.userEmail);
    }
    
    // Add conversation ID if available
    if (additionalData.conversationId) {
      formData.append('conversation_id', additionalData.conversationId);
    }
    
    // Add file if provided
    if (additionalData.file) {
      formData.append('file', additionalData.file);
    }

    const response = await api.post('/api/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // Increase timeout for chat responses
    });
    return response.data;
  },

  getConversationHistory: async (conversationId) => {
    const response = await api.get(`/api/chat/history/${conversationId}`);
    return response.data;
  },

  // Test endpoint for debugging
  testChat: async (testName) => {
    const formData = new FormData();
    formData.append('message', `[test:${testName}]`);
    
    const response = await api.post('/api/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default chatAPI;
