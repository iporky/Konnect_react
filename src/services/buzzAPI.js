import api from './api';

// Buzz API - matches the original /api/buzz endpoints exactly
export const buzzAPI = {
  getCategories: async () => {
    const response = await api.get('/api/buzz/categories');
    return response.data;
  },

  getBuzzContent: async (category = 'default', options = {}) => {
    const params = new URLSearchParams();
    params.append('category', category);
    
    if (options.format) {
      params.append('format', options.format);
    }
    
    if (options.frontPage) {
      params.append('id', 'frontPage');
    }
    
    if (options.pageno) {
      params.append('pageno', options.pageno);
    }
    
    if (options.pageSize) {
      params.append('page_size', options.pageSize);
    }

    const response = await api.get(`/api/buzz?${params.toString()}`);
    
    // Return text for HTML format, JSON for others
    if (options.format === 'html') {
      return response.data; // Raw HTML string
    }
    return response.data; // JSON object
  },

  getBuzzContentHTML: async (category = 'default', frontPage = false) => {
    const params = new URLSearchParams();
    params.append('category', category);
    params.append('format', 'html');
    
    if (frontPage) {
      params.append('id', 'frontPage');
    }

    const response = await api.get(`/api/buzz?${params.toString()}`, {
      headers: {
        'Accept': 'text/html',
      },
    });
    
    return response.data; // Raw HTML string
  },

  searchBuzz: async (query, category = null) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (category && category !== 'default') {
      params.append('category', category);
    }
    
    const response = await api.get(`/api/buzz/search?${params.toString()}`);
    return response.data;
  },

  // Get buzz content with pagination
  getBuzzPage: async (category = 'default', page = 1, pageSize = 20) => {
    const options = {
      format: 'json',
      pageno: page,
      pageSize: pageSize,
    };
    
    return await buzzAPI.getBuzzContent(category, options);
  },
};

export default buzzAPI;
