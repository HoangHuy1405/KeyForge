// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fbc02d', // vàng chính (Yellow 700)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f57f17', // vàng đậm (Yellow 900)
    },
    background: {
      default: '#fffde7', // nền vàng nhạt (Yellow 50)
      paper: '#fff9c4', // màu giấy vàng nhạt
    },
    text: {
      primary: '#212121', // chữ tối
      secondary: '#5f5f5f', // chữ phụ
    },
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
