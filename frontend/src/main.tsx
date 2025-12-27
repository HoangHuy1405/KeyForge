import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './theme/ThemeContext';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import store, { persist_store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { CircularProgress } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<CircularProgress />} persistor={persist_store}>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);

