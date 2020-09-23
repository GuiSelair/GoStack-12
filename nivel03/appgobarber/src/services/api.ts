import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.18.212.98:3333',
  timeout: 4000,
});

export default api;
