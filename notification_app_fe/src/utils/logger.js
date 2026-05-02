import { API_BASE } from '../config/api.js';
import { getAuthToken } from './auth.js';

export async function Log(level, pkg, message) {
  const msg = String(message).slice(0, 48);
  try {
    const token = await getAuthToken();
    await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ stack: 'frontend', level, package: pkg, message: msg }),
    });
  } catch {
  }
}
