import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { registerUser } from '../services/AuthService';

export default function useSignUp() {
  const navigate = useNavigate();
  const {
    mutate: signUpUser,
    isLoading: isCreatingUser,
    isError,
    isSuccess,
    error,
    data,
  } = useMutation({
    mutationFn: (userData) => registerUser(userData),
    onSuccess: () => {
      toast.success('register account successfully.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
    },
    onError: (error) => {
      console.log(error);
      toast.error(`register fail: ${error.message}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Return the mutation functions and states
  return {
    signUpUser,
    isCreatingUser,
    isSuccess,
    isError,
    error,
    data,
  };
}
