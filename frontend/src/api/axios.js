// frontend/src/api/axios.js
import axios from 'axios';

// Create a new instance of axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default instance;
