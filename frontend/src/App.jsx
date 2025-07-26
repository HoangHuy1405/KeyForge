import { createBrowserRouter, RouterProvider } from 'react-router';
import Homepage from './features/Homepage';
import { ToastContainer } from 'react-toastify';
import AuthPage from './features/Auth/AuthPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
    {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />;
      <ToastContainer
        position="top"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
