import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Container,
  useTheme,
  Box,
  Stack,
} from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      component="footer"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.footer,
        color: theme.palette.common.white,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          {/* Left side */}
          <Typography variant="body2" sx={{ color: 'grey.300' }}>
            © 2025 Bazaar. All rights reserved.
          </Typography>

          {/* Right side */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: { xs: 1, md: 0 } }}
          >
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                fontSize: '0.875rem',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                fontSize: '0.875rem',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                fontSize: '0.875rem',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Contact
            </Link>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;
