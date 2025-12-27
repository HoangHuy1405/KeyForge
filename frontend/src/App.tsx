import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import AuthPage from './features/Auth/AuthPage';
import ProfilePage from './features/User/ProfilePage';
import 'react-toastify/ReactToastify.css';
import AppLayout from './layouts/AppLayout';
import SellerLayout from './layouts/SellerLayout';
import LoginForm from './features/Auth/Partial/LoginForm';
import RegisterForm from './features/Auth/Partial/RegisterForm';
import queryClient from './config/reactQuery';
import { QueryClientProvider } from '@tanstack/react-query';
import SellerProtectedRoute from './components/Protected-route/SellerProtectedRoute';

import { loader as profileLoader } from './features/User/profileLoader';
import Error from './components/Error';
import { loader as productsLoader } from './features/Product/ProductListingPage/productsLoader';
import { loader as productLoader } from './features/Product/ProductDetailsPage/productLoader';

import Cart from './features/Cart/Cart';
import ProductListing from './features/Product/ProductListingPage/ProductListing';
import ProductDetailsPage from './features/Product/ProductDetailsPage/ProductDetailsPage';
import Homepage from './features/HomePage/Homepage';
import RegisterSellerPage from './features/Seller/Register/RegisterPage';
import { useColorMode } from './theme/ThemeContext';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/',
        element: <AuthPage />,
        children: [
          {
            path: '/login',
            element: <LoginForm />,
          },
          {
            path: '/signup',
            element: <RegisterForm />,
          },
        ],
      },
      {
        path: '/profile',
        element: <ProfilePage />,
        loader: profileLoader,
        errorElement: <Error />,
      },
      {
        path: '/products',
        element: <ProductListing />,
        loader: productsLoader,
        errorElement: <Error />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailsPage />,
        loader: productLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/seller/register', element: <RegisterSellerPage /> },
    ],
  },
  {
    path: '/seller',
    element: (
      <SellerProtectedRoute>
        <SellerLayout />
      </SellerProtectedRoute>
    ),
    children: [],
  },
]);

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
