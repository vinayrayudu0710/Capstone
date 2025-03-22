import axios from 'axios';
import jsCookie from 'js-cookie';

const API_URL = "http://localhost:5020/api/auth";

export const login = async (email, password) =>{
    const response = await axios.post(`${API_URL}/login`,{email,password});
    const token = response.data.token;
    jsCookie.set('token', token);
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    jsCookie.set('role', tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    return {token: token, role: tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']};


};

export const register = async (email, password, confirmPassword) => {
    await axios.post(`${API_URL}/register`, {email, password, confirmPassword});
}
