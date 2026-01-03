// HeaderUserMenu.tsx
import * as React from 'react';
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Logout from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

function HeaderUserMenu() {
  const account = useSelector((state: any) => state.account);
  const navigate = useNavigate();
  const { logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Account" arrow>
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={(t) => ({
            p: 0.5,
            pl: 0.75,
            pr: 1,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: t.palette.text.primary,
            backgroundColor: 'transparent',
            transition:
              'background-color .2s ease, transform .15s ease, box-shadow .15s ease',
            '&:hover': {
              backgroundColor: t.palette.action.hover,
              transform: 'translateY(-1px)',
            },
            '&:focus-visible': {
              boxShadow: `0 0 0 3px ${t.palette.action.focus}`,
            },
            '& .MuiAvatar-root': {
              border: `2px solid ${t.palette.divider}`,
            },
            ...(open && {
              boxShadow: `0 0 0 3px ${t.palette.action.focus}`,
            }),
          })}
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
              color: 'text.secondary',
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
          sx: (t) => ({
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            overflow: 'visible',
            bgcolor: 'background.paper',
            border: `1px solid ${t.palette.divider}`,
            boxShadow: t.shadows[8],
            '& .MuiMenuItem-root': {
              py: 1,
              '& .MuiListItemIcon-root': {
                minWidth: 32,
                color: t.palette.text.secondary,
              },
              '&:hover': {
                backgroundColor: t.palette.action.hover,
              },
            },
            // small caret/arrow matching the surface + border
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              backgroundColor: t.palette.background.paper,
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: `1px solid ${t.palette.divider}`,
              borderTop: `1px solid ${t.palette.divider}`,
            },
          }),
        }}
      >
        <MenuItem component={RouterLink} to="/user/profile" onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My Account
        </MenuItem>

        <MenuItem component={RouterLink} to="/user/orders" onClick={handleClose}>
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

export default HeaderUserMenu;
