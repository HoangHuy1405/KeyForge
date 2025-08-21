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
          <span className="text-lg font-bold text-white">Barazaar</span>
        </div>

        {/* Search Box */}
        <div className="flex w-1/2 items-center overflow-hidden rounded bg-white">
          <InputBase
            placeholder="Shopee bao ship 0đ - Đăng ký ngay!"
            sx={{ flex: 1, px: 1, fontSize: '0.875rem' }} // tương đương text-sm + padding
          />
          <IconButton
            sx={{ bgcolor: 'rgb(234 179 8)', borderRadius: 0, color: 'white' }}
          >
            <Search />
          </IconButton>
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
