import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout as logoutAction } from '../redux/slice/accountSlice';
import { logout as logoutApi } from '../services/AuthService';
import api from '../services/api';

export function useLogout(): {
  logout: () => void;
  isLoggingOut: boolean;
} {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      localStorage.removeItem('access_token');

      dispatch(logoutAction()); // ✅ resets slice
      qc.clear();
      toast.success('Logged out.');
      navigate('/login');
    },
    onError: () => {
      // even if server fails, force local logout
      localStorage.removeItem('access_token');

      dispatch(logoutAction());
      qc.clear();
      toast.error('Logout failed on server; signed out locally.');
      navigate('/login');
    },
  });

  return { logout, isLoggingOut };
}
