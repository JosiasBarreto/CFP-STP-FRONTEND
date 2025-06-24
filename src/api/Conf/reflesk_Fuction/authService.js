import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../../urls';


const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens( accessToken, refreshToken ) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('user'); // Limpa o usuário também, se necessário
}

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    
    return exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

export async function refreshTokenRequest() {
    const refreshToken = getRefreshToken();
  
    try {
      const res = await axios.post(API_URL+'/refresh', {
        refresh_token: refreshToken, // garante o mesmo nome esperado pelo backend
      });
  
      const data = res.data;
      saveTokens(data.token, data.refreshToken); // espera-se que `data` contenha access_token e opcionalmente refresh_token
      return data.token; // ou data.access_token, conforme seu backend retorna
    } catch (err) {
      throw new Error('Refresh failed');
    }
  }
