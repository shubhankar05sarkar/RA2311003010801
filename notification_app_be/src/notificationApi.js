import { getAuthToken, Log } from 'logging-middleware';

const NOTIFICATIONS_API = 'http://20.207.122.201/evaluation-service/notifications';

export async function fetchNotifications() {
  await Log('backend', 'info', 'service', 'fetching notifications');

  const token = await getAuthToken();
  const res = await fetch(NOTIFICATIONS_API, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    await Log('backend', 'error', 'service', `notifications error: ${res.status}`);
    throw new Error(`fetch failed: ${res.status}`);
  }

  const data = await res.json();
  await Log('backend', 'info', 'service', `got ${data.notifications.length} items`);
  return data.notifications;
}
