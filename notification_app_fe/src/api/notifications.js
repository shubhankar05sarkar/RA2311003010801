import { API_BASE } from '../config/api.js';
import { getAuthToken } from '../utils/auth.js';
import { Log } from '../utils/logger.js';

export async function fetchNotifications(params = {}) {
  await Log('info', 'api', 'fetching notifications');

  const query = new URLSearchParams();
  if (params.limit)             query.set('limit', params.limit);
  if (params.page)              query.set('page', params.page);
  if (params.notification_type) query.set('notification_type', params.notification_type);

  const url = `${API_BASE}/notifications${query.toString() ? `?${query}` : ''}`;
  const token = await getAuthToken();

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!res.ok) {
    await Log('error', 'api', `notifications error: ${res.status}`);
    throw new Error(`fetch failed: ${res.status}`);
  }

  const data = await res.json();
  await Log('info', 'api', `got ${data.notifications.length} items`);
  return data.notifications;
}
