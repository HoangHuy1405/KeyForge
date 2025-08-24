import { useMutation, useMutationState } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { loginUser } from '../services/AuthService';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '../redux/slice/accountSlice';

export default function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    mutate: signInUser,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: (userData) => loginUser(userData),
    onSuccess: (data) => {
      console.log(data);
      //set access_token
      localStorage.setItem('access_token', data.accessToken);
      //store user data
      dispatch(setUserLoginInfo(data.user));

      toast.success('login successfully.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/');
    },
    onError: (error) => {
      toast.error(`login fail: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
  return {
    signInUser,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}
