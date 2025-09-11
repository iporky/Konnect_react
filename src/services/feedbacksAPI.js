import api from './api';

// Feedbacks API (multipart POST)
// Endpoint: POST /api/v1/feedbacks/
// Fields: type (like|dislike|suggest), details, user_email, feedback_reply (true/false), file (optional)
export const feedbacksAPI = {
  submit: async ({ type, details, user_email, feedback_reply, file }) => {
    const form = new FormData();
    form.append('type', type);
    form.append('details', details);
    form.append('user_email', user_email);
    form.append('feedback_reply', feedback_reply ? 'true' : 'false');
    if (file) form.append('file', file);
    const res = await api.post('/feedbacks/', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export default feedbacksAPI;
