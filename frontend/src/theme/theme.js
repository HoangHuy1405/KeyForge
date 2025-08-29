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
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#f57f17', // vàng đậm cho tiêu đề
    },
    button: {
      textTransform: 'none',
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
