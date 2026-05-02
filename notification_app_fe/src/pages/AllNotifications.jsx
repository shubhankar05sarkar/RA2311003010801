import { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Pagination, Button, Divider,
} from '@mui/material';
import NotificationCard from '../components/NotificationCard.jsx';
import FilterBar        from '../components/FilterBar.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import { getViewedSet, markAllViewed } from '../state/viewedNotifications.js';
import { Log } from '../utils/logger.js';

const PAGE_SIZE = 10;

export default function AllNotifications() {
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage]             = useState(1);
  const [viewedSet, setViewedSet]   = useState(() => getViewedSet());

  const params = {};
  if (typeFilter) params.notification_type = typeFilter;

  const { notifications, loading, error, refetch } = useNotifications(params);

  useEffect(() => { setViewedSet(getViewedSet()); }, [notifications]);

  useEffect(() => {
    Log('info', 'page', `AllNotifications filter: ${typeFilter || 'all'}`);
    setPage(1);
  }, [typeFilter]);

  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const paginated  = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleMarkAllRead() {
    markAllViewed(notifications.map(n => n.ID));
    setViewedSet(getViewedSet());
    Log('info', 'page', 'Marked all as read');
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
        <Typography variant="h5" fontWeight={600}>
          All Notifications
          {!loading && (
            <Typography component="span" variant="body2" color="text.secondary" ml={1}>
              ({notifications.length})
            </Typography>
          )}
        </Typography>
        <Box display="flex" gap={1}>
          <Button size="small" variant="outlined" onClick={handleMarkAllRead}>Mark all read</Button>
          <Button size="small" variant="contained" onClick={refetch}>Refresh</Button>
        </Box>
      </Box>

      <FilterBar value={typeFilter} onChange={setTypeFilter} />
      <Divider sx={{ mb: 2 }} />

      {loading && <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>}

      {error && <Alert severity="error" sx={{ mb: 2 }}>Could not load notifications: {error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && paginated.map(n => (
        <NotificationCard key={n.ID} notification={n} viewed={viewedSet.has(n.ID)} />
      ))}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
