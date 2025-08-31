import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import theme from './theme/theme.js';
import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<CircularProgress />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
