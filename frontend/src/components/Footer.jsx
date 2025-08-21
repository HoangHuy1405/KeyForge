import { AppBar, Toolbar, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <AppBar
      position="static"
      component="footer"
      elevation={0}
      sx={{ backgroundColor: '#1f2937', marginTop: '2.5rem' }} // bg-gray-800 + mt-10
    >
      <Toolbar className="flex flex-col items-center justify-between py-4 md:flex-row">
        {/* Left side */}
        <Typography variant="body2" className="text-gray-300">
          © 2025 Barazaar. All rights reserved.
        </Typography>

        {/* Right side */}
        <div className="mt-2 flex gap-4 md:mt-0">
          <Link
            href="#"
            underline="none"
            className="text-gray-300 hover:text-white"
          >
            Chính sách bảo mật
          </Link>
          <Link
            href="#"
            underline="none"
            className="text-gray-300 hover:text-white"
          >
            Điều khoản sử dụng
          </Link>
          <Link
            href="#"
            underline="none"
            className="text-gray-300 hover:text-white"
          >
            Liên hệ
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}
