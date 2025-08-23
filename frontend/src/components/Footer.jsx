import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Container,
  useTheme,
} from '@mui/material';

export default function Footer() {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      component="footer"
      elevation={0}
      sx={{
        mt: 4,
        backgroundColor: '#1f2937', // luôn xám cho footer
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
            © 2025 Barazaar. All rights reserved.
          </Typography>

          {/* Right side */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="#"
              underline="none"
              sx={{
                color: 'grey.300',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              Liên hệ
            </Link>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
