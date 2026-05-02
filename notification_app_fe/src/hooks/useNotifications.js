import { useState, useEffect } from 'react';
import { fetchNotifications } from '../api/notifications.js';
import { Log } from '../utils/logger.js';

export function useNotifications(params = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const key = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNotifications(params)
      .then(data => {
        setNotifications(data);
        Log('info', 'hook', `loaded ${data.length}`);
      })
      .catch(err => {
        setError(err.message);
        Log('error', 'hook', 'notifications load failed');
      })
      .finally(() => setLoading(false));
  }, [key, tick]);

  return { notifications, loading, error, refetch: () => setTick(t => t + 1) };
}
