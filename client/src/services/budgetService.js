import api from './api';

export const getBudget = () =>
  api.get('/api/budget').then((r) => r.data);

export const setBudget = (data) =>
  api.post('/api/budget', data).then((r) => r.data);
