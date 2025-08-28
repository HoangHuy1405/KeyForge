import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputBase,
  Link,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  Facebook,
  Instagram,
  Notifications,
} from '@mui/icons-material';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Logout from '@mui/icons-material/Logout';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
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
                      sx={{
                        color: theme.palette.common.white,
                        p: 0.5,
                      }}
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

function HeaderUserMenu({ isAuthenticated }) {
  const account = useSelector((state) => state.account); // ← username, avatarUrl from Redux
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <Typography
        variant="body2"
        component={RouterLink}
        to="/login"
        color="inherit"
        sx={{ textDecoration: 'none' }}
      >
        Sign in
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Account" arrow>
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{
            p: 0.5,
            pl: 0.75,
            pr: 1,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'common.white',
            transition: 'background-color .2s ease, transform .15s ease',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.12)',
              transform: 'translateY(-1px)',
            },
            '& .MuiAvatar-root': {
              border: '2px solid rgba(255,255,255,0.28)',
            },
          }}
        >
          <Avatar
            src={account?.user?.avatarUrl || ''}
            alt={account?.user?.name || 'avatar'}
            sx={{ width: 28, height: 28 }}
          />

          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'inline' },
              color: 'common.white', // ← username in white
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {account?.user?.name}
          </Typography>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            overflow: 'visible',
            boxShadow:
              '0px 8px 24px rgba(0,0,0,0.2), 0px 2px 8px rgba(0,0,0,0.12)',
            '& .MuiMenuItem-root': {
              py: 1,
              '& .MuiListItemIcon-root': {
                minWidth: 32,
                color: 'text.secondary',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            // small arrow
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My Account
        </MenuItem>

        <MenuItem component={RouterLink} to="/purchase" onClick={handleClose}>
          <ListItemIcon>
            <ReceiptLong fontSize="small" />
          </ListItemIcon>
          My Purchase
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Header;
