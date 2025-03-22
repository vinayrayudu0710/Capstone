import axios from 'axios';
import jsCookie from 'js-cookie';

const API_URL = 'http://localhost:5020/api/resume';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${jsCookie.get('token')}` }
});

export const createResume = async (formData) => {
  const response = await axios.post(API_URL, formData, getAuthHeaders());
  return response.data;
};

export const getMyResumes = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};