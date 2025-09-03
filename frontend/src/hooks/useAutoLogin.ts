import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'
import { refresh } from '../services/AuthService';
import { useLogout } from './useLogout';
import { setUserLoginInfo } from '../redux/slice/accountSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function useRestoreSession() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { logout } = useLogout();

    const { mutate: LoginByRefreshToken } = useMutation({
        mutationFn: () => refresh(),
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
        onError: () => {
            toast.error("Your session has expired. Please log in again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            logout();
        }
    })

    useEffect(() => {
        LoginByRefreshToken();
    }, []);
}
