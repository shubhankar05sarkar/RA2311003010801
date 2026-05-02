import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function TopNSelector({ value, onChange }) {
  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
      <Typography variant="body2" color="text.secondary">Show top:</Typography>
      <ToggleButtonGroup value={value} exclusive onChange={(_, v) => v && onChange(v)} size="small">
        {[5, 10, 15, 20].map(n => (
          <ToggleButton key={n} value={n}>{n}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
