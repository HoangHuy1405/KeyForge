import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { Inventory2 } from '@mui/icons-material';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import Logo from '../components/Logo';
import { useMemo } from 'react';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'inventory',
    title: 'Inventory',
    icon: <Inventory2 />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
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

export default function SellerLayout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = '/seller';

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
        // Toolpad constructs paths from segments (e.g., '/inventory')
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
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
