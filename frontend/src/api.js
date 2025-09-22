import axios from 'axios';

const api = axios.create({
  // In production, this will use the environment variable you set in Vercel.
  // In development on your laptop, this will be empty, and the "proxy" in package.json will be used.
  baseURL: process.env.REACT_APP_API_URL || '' 
});

export default api;