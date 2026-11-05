import { Platform } from 'react-native';
import { API_URL } from './config';

let token = null;

export function setAuthToken(value) {
  token = value;
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    if (value) localStorage.setItem('congress_token', value);
    else localStorage.removeItem('congress_token');
  }
}

export function getAuthToken() {
  if (token) return token;
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('congress_token');
  }
  return token;
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const current = getAuthToken();
  if (current) headers.Authorization = `Bearer ${current}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(`Cannot reach the API at ${API_URL}.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = data.errors ? Object.values(data.errors).flat().join('\n') : '';
    throw new Error(details || data.message || 'Request failed');
  }
  return data;
}
