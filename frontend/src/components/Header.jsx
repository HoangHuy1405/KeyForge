import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Link,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  Facebook,
  Instagram,
  Notifications,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // responsive check
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  return (
    <Box>
      {/* Top Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              {/* Left side links */}
              {!isMobile && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Link
                    component={RouterLink}
                    to="/seller"
                    color="inherit"
                    underline="none"
                    sx={{
                      fontSize: theme.typography.body2.fontSize,
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    Seller Centre
                  </Link>
                  <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>
                    |
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="#"
                    color="inherit"
                    underline="none"
                    sx={{
                      fontSize: theme.typography.body2.fontSize,
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    Start Selling
                  </Link>
                  <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>
                    |
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.common.white, p: 0.5 }}
                  >
                    <Facebook fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.common.white, p: 0.5 }}
                  >
                    <Instagram fontSize="small" />
                  </IconButton>
                </Stack>
              )}

              {/* Right side links */}
              <Stack direction="row" spacing={2} alignItems="center">
                {!isMobile && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      sx={{ color: theme.palette.common.white, p: 0.5 }}
                    >
                      <Notifications fontSize="small" />
                    </IconButton>
                    <Link
                      component={RouterLink}
                      to="#"
                      color="inherit"
                      underline="none"
                      sx={{
                        fontSize: theme.typography.body2.fontSize,
                        '&:hover': { opacity: 0.8 },
                      }}
                    >
                      Notification
                    </Link>
                  </Stack>
                )}

                {isAuthenticated ? (
                  <Link
                    component={RouterLink}
                    to="/profile"
                    color="inherit"
                    underline="none"
                    sx={{
                      fontSize: theme.typography.body2.fontSize,
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      component={RouterLink}
                      to="/signup"
                      color="inherit"
                      underline="none"
                      sx={{
                        fontSize: theme.typography.body2.fontSize,
                        '&:hover': { opacity: 0.8 },
                      }}
                    >
                      Sign up
                    </Link>
                    <Typography sx={{ fontSize: '13px', opacity: 0.7, mx: 1 }}>
                      |
                    </Typography>
                    <Link
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      underline="none"
                      sx={{
                        fontSize: theme.typography.body2.fontSize,
                        '&:hover': { opacity: 0.8 },
                      }}
                    >
                      Login
                    </Link>{' '}
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* Main Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 2 }}>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Logo */}
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="none"
                sx={{
                  fontSize: theme.typography.body2.fontSize,
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.palette.common.white,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      B
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    Bazaar
                  </Typography>
                </Box>
              </Link>

              {/* Search Bar */}
              {!isMobile && (
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <InputBase
                      placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                      sx={{
                        ml: 2,
                        flex: 1,
                        fontSize: theme.typography.body2.fontSize,
                        '& input': { py: 1.5 },
                      }}
                    />
                    <IconButton
                      type="button"
                      sx={{
                        p: 1.5,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* Cart */}
              <IconButton
                sx={{
                  color: theme.palette.common.white,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <ShoppingCart fontSize="large" />
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
