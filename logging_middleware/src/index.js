import { AUTH_API, LOG_API, CREDENTIALS } from './config.js';

let token = null;
let tokenExpiry = 0;

async function authenticate() {
  const res = await fetch(AUTH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  token = data.access_token;
  tokenExpiry = data.expires_in;
}

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  if (!token || now >= tokenExpiry - 60) await authenticate();
  return token;
}

export async function getAuthToken() {
  return getToken();
}

export async function Log(stack, level, pkg, message) {
  const t = await getToken();
  const res = await fetch(LOG_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${t}`,
    },
    body: JSON.stringify({ stack, level, package: pkg, message }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Log failed ${res.status}: ${err}`);
  }
  return res.json();
}
