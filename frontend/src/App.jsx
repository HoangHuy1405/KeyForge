import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './features/Homepage';
import { ToastContainer, Bounce } from 'react-toastify';
import AuthPage from './features/Auth/AuthPage';
import 'react-toastify/ReactToastify.css';

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
