// src/services/axiosInstance.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:30001', // Cambia al URL de tu API
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

export default axiosInstance;