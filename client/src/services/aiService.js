import api from './api';

export const analyzeSpending = () =>
  api.post('/api/ai/analyze').then((r) => r.data);
