import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Box, CircularProgress, useTheme, alpha } from '@mui/material';
import useRestoreSession from '../hooks/useAutoLogin';

const AppLayout: React.FC = () => {
  useRestoreSession();
  const theme = useTheme();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <Box
      sx={{
        display: 'grid',
        minHeight: '100vh',
        gridTemplateRows: 'auto 1fr auto',
        background: theme.palette.mode === 'light'
          ? `linear-gradient(to bottom right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.1)}, ${alpha('#ec4899', 0.1)})`
          : theme.palette.background.default,
        transition: 'background 0.3s ease',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mx: 'auto',
        }}
      >
        {isLoading ? <CircularProgress color="inherit" /> : <Outlet />}
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;

