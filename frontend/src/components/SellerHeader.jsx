import { AppBar, Toolbar, IconButton, InputBase, Badge } from '@mui/material';
import { Search, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'rgb(250 204 21)' }} // bg-yellow-400
    >
      <Toolbar className="flex justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-yellow-500">
            B
          </div>
          <span className="text-lg font-bold text-white">
            Barazaar Seller channel
          </span>
        </div>

        {/* Cart + Login */}
        <div className="flex items-center gap-4 text-sm text-white">
          <IconButton sx={{ color: 'white' }}>
            <Badge badgeContent={0} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Link to="/" className="cursor-pointer">
            Đăng Ký
          </Link>
          <Link to="/" className="cursor-pointer">
            Đăng Nhập
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}
