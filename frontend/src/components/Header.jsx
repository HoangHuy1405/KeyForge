import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon, Instagram } from '@mui/icons-material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductSearchBar from '../features/Product/ProductSearchBar';
import StyledBadge from '../components/StyledBadge';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { HeaderCart } from '../features/Cart/HeaderCart';
import { useAppSelector } from '../hooks/hooks';
import { selectFavoritesCount } from '../redux/slice/favoriteSlice';
import Logo from './Logo';
import HeaderUserMenu from './HeaderUserMenu';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const favorCount = useAppSelector(selectFavoritesCount);

  // Common style for both AppBars → glass effect
  const glassStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bgcolor: 'rgba(255,255,255,0.65)', // translucent white (light mode)
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    zIndex: theme.zIndex.appBar,
  };

  return (
    <Box sx={{ pb: { xs: 12 } }}>
      <AppBar elevation={0} sx={{ ...glassStyles, px: 4 }}>
        {/* Top Header */}
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
                    sx={{ color: 'text.primary', p: 0.5 }}
                  >
                    <FacebookOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.primary', p: 0.5 }}
                  >
                    <Instagram fontSize="small" />
                  </IconButton>
                </Stack>
              )}

              {/* Right side links */}
              <Stack direction="row" spacing={2} alignItems="center">
                {!isMobile && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Link
                      component={RouterLink}
                      to="#"
                      color="inherit"
                      underline="none"
                    >
                      <IconButton
                        size="small"
                        sx={{ color: 'text.primary', p: 0.5 }}
                      >
                        <StyledBadge badgeContent={3} top={2} right={-3}>
                          <NotificationsOutlinedIcon fontSize="small" />
                        </StyledBadge>
                      </IconButton>
                    </Link>
                    <Link
                      component={RouterLink}
                      to="#"
                      color="inherit"
                      underline="none"
                    >
                      <IconButton
                        size="small"
                        sx={{ color: 'text.primary', p: 0.5 }}
                      >
                        <StyledBadge
                          badgeContent={favorCount}
                          top={2}
                          right={-3}
                        >
                          <FavoriteBorderIcon fontSize="small" />
                        </StyledBadge>
                      </IconButton>
                    </Link>
                  </Stack>
                )}

                {isAuthenticated ? (
                  <HeaderUserMenu isAuthenticated={isAuthenticated} />
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
                    </Link>
                  </>
                )}
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ pb: 1.5 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Logo />
                  <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                    Bazaar
                  </h1>
                </Box>
              </Link>

              {/* Search Bar */}
              {!isMobile && <ProductSearchBar />}

              {/* Cart */}
              <HeaderCart />
            </Stack>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
