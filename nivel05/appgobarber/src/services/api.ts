import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.15:3333',
  timeout: 4000,
});

export default api;
