import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { NOTIFICATION_TYPES } from '../config/api.js';

export default function FilterBar({ value, onChange }) {
  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
      <Typography variant="body2" color="text.secondary">Filter:</Typography>
      <ToggleButtonGroup value={value} exclusive onChange={(_, v) => onChange(v ?? '')} size="small">
        <ToggleButton value="">All</ToggleButton>
        {NOTIFICATION_TYPES.map(t => (
          <ToggleButton key={t} value={t}>{t}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
