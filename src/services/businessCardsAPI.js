import api from './api';

// Business Cards API - handles uploading business card data + image
// Expects backend endpoint: POST /api/v1/business-cards/
// Fields: company_name, phone_number, email, file (image)

export const businessCardsAPI = {
  upload: async ({ company_name, phone_number, email, file }) => {
    const form = new FormData();
    form.append('company_name', company_name || '');
    if (phone_number) form.append('phone_number', phone_number);
    form.append('email', email || '');
    if (file) form.append('file', file);

    const response = await api.post('/business-cards/', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default businessCardsAPI;
