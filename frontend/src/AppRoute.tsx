import { createBrowserRouter } from 'react-router-dom';

import AuthPage from './features/Auth/AuthPage';
import ProfilePage from './features/User/ProfilePage';
import AppLayout from './layouts/AppLayout';
import SellerLayout from './layouts/SellerLayout';
import UserLayout from './layouts/UserLayout';
import LoginForm from './features/Auth/Partial/LoginForm';
import RegisterForm from './features/Auth/Partial/RegisterForm';
import SellerProtectedRoute from './components/Protected-route/SellerProtectedRoute';

import Error from './components/Error';
import { loader as profileLoader } from './features/User/profileLoader';
import { loader as productsLoader } from './features/Product/ProductListingPage/productsLoader';
import { loader as productLoader } from './features/Product/ProductDetailsPage/productLoader';

import Cart from './features/Cart/Cart';
import ProductListing from './features/Product/ProductListingPage/ProductListing';
import ProductDetailsPage from './features/Product/ProductDetailsPage/ProductDetailsPage';
import Homepage from './features/HomePage/Homepage';
import RegisterSellerPage from './features/Seller/Register/RegisterPage';
import ProductManagerPage from './features/Seller/ProductManagerPage';
import CreateProductPage from './features/Seller/CreateProduct/CreateProductPage';
import EditProductPage from './features/Seller/EditProduct/EditProductPage';
import CheckoutPage from './features/Checkout/CheckoutPage';

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
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/seller/register', element: <RegisterSellerPage /> },
    ],
  },
  {
    path: '/user',
    element: <UserLayout />,
    errorElement: <Error />,
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
        loader: profileLoader,
      },
      {
        path: 'history',
        element: <div>History - Coming Soon</div>,
      },
      {
        path: 'orders',
        element: <div>Orders - Coming Soon</div>,
      },
      {
        path: 'purchase-history',
        element: <div>Order History - Coming Soon</div>,
      },
    ],
  },
  {
    path: '/seller',
    element: (
      <SellerProtectedRoute>
        <SellerLayout />
      </SellerProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <ProductManagerPage />,
      },
      {
        path: 'inventory',
        element: <ProductManagerPage />,
      },
      {
        path: 'products/new',
        element: <CreateProductPage />,
      },
      {
        path: 'products/:id/edit',
        element: <EditProductPage />,
      },
      {
        path: 'dashboard',
        element: <div>Dashboard - Coming Soon</div>,
      },
      {
        path: 'orders',
        element: <div>Orders - Coming Soon</div>,
      },
    ],
  },
]);

export default router;