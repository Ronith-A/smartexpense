import api from './api';

export const getIncome = () =>
  api.get('/api/income').then((r) => r.data);

export const createIncome = (data) =>
  api.post('/api/income', data).then((r) => r.data);
