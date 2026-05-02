import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, CssBaseline } from '@mui/material';
import AllNotifications from './pages/AllNotifications.jsx';
import PriorityInbox    from './pages/PriorityInbox.jsx';
import { Log }          from './utils/logger.js';

function NavTabs() {
  const loc = useLocation();
  const active = loc.pathname === '/priority' ? 1 : 0;
  return (
    <Tabs value={active} textColor="inherit" indicatorColor="secondary" sx={{ minHeight: 40 }}>
      <Tab component={NavLink} to="/" end label="All Notifications" sx={{ minHeight: 40, fontSize: '0.82rem' }} />
      <Tab component={NavLink} to="/priority" label="Priority Inbox" sx={{ minHeight: 40, fontSize: '0.82rem' }} />
    </Tabs>
  );
}

export default function App() {
  useEffect(() => { Log('info', 'component', 'App mounted'); }, []);

  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight={600} flexGrow={1}>
            Campus Notifications
          </Typography>
        </Toolbar>
        <Container maxWidth="lg" disableGutters>
          <NavTabs />
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/"         element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
