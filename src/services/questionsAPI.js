import api from './api';

// Expert Questions API (v1)
// POST   /api/v1/questions/  { question_text, asked_by }
// GET    /api/v1/questions/?skip=0&limit=100  -> array of question objects
export const questionsAPI = {
  ask: async ({ question_text, asked_by }) => {
    const response = await api.post('/questions/', { question_text, asked_by }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
    return response.data; // returns created question object
  },
  list: async ({ skip = 0, limit = 100 } = {}) => {
    const response = await api.get(`/questions/?skip=${skip}&limit=${limit}`);
    return response.data; // array
  },
  answer: async (id, { question_text, answer, answered_by }) => {
    const response = await api.put(`/questions/${id}`, {
      q: { question_text, answer },
      answered_by,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }
};

export default questionsAPI;
