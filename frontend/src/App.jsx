import { createBrowserRouter, RouterProvider } from 'react-router';
import Homepage from './features/Homepage';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
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
