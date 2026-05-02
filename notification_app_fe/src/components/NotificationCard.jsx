import { useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { markViewed } from '../state/viewedNotifications.js';
import { Log } from '../utils/logger.js';

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCard({ notification, viewed }) {
  const { ID, Type, Message, Timestamp } = notification;

  useEffect(() => {
    if (!viewed) {
      markViewed(ID);
      Log('info', 'component', `viewed: ${Type}`);
    }
  }, [ID]);

  return (
    <Card variant="outlined" sx={{ mb: 1.5, bgcolor: viewed ? '#fff' : '#f9f9f9' }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#444' }}>
              {Type}
            </Typography>
            {!viewed && (
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.68rem' }}>
                · new
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">{timeAgo(Timestamp)}</Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: viewed ? 400 : 500, wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
