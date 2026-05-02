import { API_BASE, CREDENTIALS } from '../config/api.js';

let _token = null;
let _tokenExpiry = 0;

export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  if (_token && now < _tokenExpiry - 60) return _token;

  const res = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

  const data = await res.json();
  _token = data.access_token;
  _tokenExpiry = data.expires_in;
  return _token;
}
