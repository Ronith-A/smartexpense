import api from './api';

export const loginUser = (email, password) =>
  api.post('/api/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (name, email, password) =>
  api.post('/api/auth/register', { name, email, password }).then((r) => r.data);
