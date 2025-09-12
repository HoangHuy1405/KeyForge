// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
      contrastText: '#0a0a0a',
      outline: '#5f5f5f',
      themeColor: 'linear-gradient(to bottom right, #3b82f6, #a855f7)',
    },
    secondary: {
      main: '#eceef2',
    },
    background: {
      default: '#ffffff', // nền vàng nhạt (Yellow 50)
      paper: '#eceef2', // màu giấy vàng nhạt
    },
    text: {
      primary: '#212121', // chữ tối
      secondary: '#5f5f5f', // chữ phụ
    },
    input_background: '#f3f3f5',
    outline: '#75757536',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#212121', // đậm cho tiêu đề chính
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333333', // hơi nhạt hơn h1
    },
    h3: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#424242',
    },
    body1: {
      fontSize: '1rem',
      color: '#555555', // nội dung chính
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      color: '#757575', // phụ đề, mô tả
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#9e9e9e', // ghi chú nhỏ
    },
    button: {
      textTransform: 'none', // giữ nguyên chữ (không ALL CAPS)
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#616161', // dùng cho subtitle, heading nhỏ
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#757575',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fbc02d', // AppBar cũng màu vàng
        },
      },
    },
  },
});

export default theme;
