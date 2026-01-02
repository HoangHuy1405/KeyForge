import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Stack } from '@mui/material';
import Logo from '../../components/Logo';

const AuthPage: React.FC = () => {
  return (
    <Stack
      direction="row"
      sx={{
        height: '100%',
        minHeight: '60vh',
      }}
    >
      {/* Left side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              mx: 'auto',
              mb: 2,
              display: 'flex',
              height: 128,
              width: 128,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <Logo size={100} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            KeyForge
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            Premium Mechanical Keyboard <br /> Components & Accessories
          </Typography>
        </Box>
      </Box>

      {/* Right side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 384 }}>
          <Outlet />
        </Box>
      </Box>
    </Stack>
  );
};

export default AuthPage;
