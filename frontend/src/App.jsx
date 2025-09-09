import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './features/Homepage';
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
import ProtectedRoute from './components/Protected-route/ProtectedRoute';

import { loader as profileLoader } from './features/User/profileLoader';
import Error from './components/Error';
import { loader as productsLoader } from './features/Product/ProductListingPage/productsLoader';
import { loader as productLoader } from './features/Product/ProductDetailsPage/productLoader';
import Cart from './features/Cart/Cart';
import ProductListing from './features/Product/ProductListingPage/ProductListing';
import ProductDetailsPage from './features/Product/ProductDetailsPage/ProductDetailsPage';
import CheckoutPage from './features/Order/CheckoutPage';

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
      { path: '/checkout', element: <CheckoutPage /> }
    ],
  },
  {
    path: '/seller',
    element: (
      <ProtectedRoute>
        <SellerLayout />
      </ProtectedRoute>
    ),
    children: [],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </QueryClientProvider>
  );
}
