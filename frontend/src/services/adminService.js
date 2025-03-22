import axios from 'axios';
import jsCookie from 'js-cookie';

const API_URL = 'http://localhost:5020/api/admin';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${jsCookie.get('token')}` }
});

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const getUserResumes = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}/resumes`, getAuthHeaders());
  return response.data;
};

export const deleteUser = async (userId) => {
  await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
};

export const deleteResume = async (resumeId) => {
  await axios.delete(`${API_URL}/resumes/${resumeId}`, getAuthHeaders());
};