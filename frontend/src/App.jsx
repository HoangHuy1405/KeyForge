import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './features/Homepage';
import { ToastContainer, Bounce } from 'react-toastify';
import AuthPage from './features/Auth/AuthPage';
import ProfilePage from './features/User/ProfilePage';
import 'react-toastify/ReactToastify.css';
import AppLayout from './layouts/AppLayout';
import SellerLayout from './layouts/SellerLayout';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/seller',
    element: <SellerLayout />,
    children: [],
  },
]);

export default function App() {
  return (
    <>
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
    </>
  );
}
