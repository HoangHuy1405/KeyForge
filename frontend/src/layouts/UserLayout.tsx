import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import Logo from '../components/Logo';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from '../hooks/hooks';
import { toast } from 'react-toastify';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'My Account',
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <PersonIcon />,
  },
  {
    segment: 'history',
    title: 'History',
    icon: <HistoryIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'My Purchases',
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingBagIcon />,
  },
  {
    segment: 'purchase-history',
    title: 'Order History',
    icon: <ReceiptIcon />,
  },
];

function CustomBranding() {
  return (
    <Link
      component={RouterLink}
      to="/"
      color="inherit"
      underline="none"
      sx={{
        '&:hover': { opacity: 0.9 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Logo />
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          KeyForge
        </Typography>
      </Box>
    </Link>
  );
}

export default function UserLayout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

  const basePath = '/user';

  // Auth protection
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to access your account');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Create a router adapter for Toolpad's AppProvider
  const router = useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string | URL) => {
        const pathStr = String(path);
        // Allow direct navigation to homepage
        if (pathStr === '/') {
          navigate('/');
        }
        // Toolpad constructs paths from segments (e.g., '/profile')
        // We need to prepend the base path if not already included
        else if (pathStr.startsWith('/') && !pathStr.startsWith(basePath)) {
          navigate(`${basePath}${pathStr}`);
        } else {
          navigate(pathStr);
        }
      },
    }),
    [location, navigate]
  );

  if (!isAuthenticated) return null;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={theme}
      branding={{
        logo: <CustomBranding />,
        title: '',
        homeUrl: '/',
      }}
    >
      <DashboardLayout>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
            px: 3,
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
