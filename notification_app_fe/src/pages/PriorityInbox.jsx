import { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Divider, Button,
} from '@mui/material';
import NotificationCard from '../components/NotificationCard.jsx';
import FilterBar        from '../components/FilterBar.jsx';
import TopNSelector     from '../components/TopNSelector.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import { getTopN }      from '../utils/priorityScore.js';
import { getViewedSet } from '../state/viewedNotifications.js';
import { Log }          from '../utils/logger.js';

export default function PriorityInbox() {
  const [topN, setTopN]               = useState(10);
  const [typeFilter, setTypeFilter]   = useState('');
  const [viewedSet, setViewedSet]     = useState(() => getViewedSet());

  const { notifications, loading, error, refetch } = useNotifications();

  useEffect(() => { setViewedSet(getViewedSet()); }, [notifications]);

  useEffect(() => {
    Log('info', 'page', `PriorityInbox: top=${topN}`);
  }, [topN, typeFilter]);

  const filtered    = typeFilter ? notifications.filter(n => n.Type === typeFilter) : notifications;
  const prioritized = getTopN(filtered, topN);
  const unread      = prioritized.filter(n => !viewedSet.has(n.ID)).length;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography variant="h5" fontWeight={600}>Priority Inbox</Typography>
          {unread > 0 && (
            <Typography variant="caption" sx={{ bgcolor: '#1565c0', color: '#fff', px: 1, py: 0.2, borderRadius: 1 }}>
              {unread} new
            </Typography>
          )}
        </Box>
        <Button size="small" variant="contained" onClick={refetch}>Refresh</Button>
      </Box>

      <TopNSelector value={topN} onChange={setTopN} />
      <FilterBar value={typeFilter} onChange={setTypeFilter} />
      <Divider sx={{ mb: 2 }} />

      {loading && <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>}

      {error && <Alert severity="error" sx={{ mb: 2 }}>Could not load: {error}</Alert>}

      {!loading && !error && prioritized.length === 0 && (
        <Alert severity="info">No notifications match.</Alert>
      )}

      {!loading && prioritized.map((n, i) => (
        <Box key={n.ID} display="flex" gap={1} alignItems="flex-start">
          <Typography variant="caption" sx={{ mt: 2, minWidth: 24, color: 'text.secondary', fontWeight: 500 }}>
            {i + 1}.
          </Typography>
          <Box flex={1}>
            <NotificationCard notification={n} viewed={viewedSet.has(n.ID)} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
