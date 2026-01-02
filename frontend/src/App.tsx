import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import queryClient from './config/reactQuery';
import { QueryClientProvider } from '@tanstack/react-query';
import { useColorMode } from './theme/ThemeContext';
import router from './AppRoute';

const App: React.FC = () => {
  const { mode } = useColorMode();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable={false}
        pauseOnHover={false}
        theme={mode}
        transition={Bounce}
        limit={1}
      />
    </QueryClientProvider>
  );
};

export default App;
