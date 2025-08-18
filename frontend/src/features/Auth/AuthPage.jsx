import { useState } from 'react';
import LoginForm from './Partial/LoginForm';
import RegisterForm from './Partial/RegisterForm';
import { registerUser, loginUser } from '../../services/AuthService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    console.log('Login form submitted:', data);
    try {
      const { accessToken, user } = await loginUser(
        data.identifier,
        data.password,
      );

      console.log('Login successful, token:', accessToken);
      console.log('user: ', user);

      toast.success('Đăng nhập thành công!');
      // Giả sử backend trả về { token: '...' }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // TODO: chuyển hướng hoặc set user context
      console.log('Navigate to homepage');
      navigate('/profile'); // nếu dùng React Router
    } catch (error) {
      console.log(error);
      console.error('Đăng nhập thất bại:', error.message);
      toast.error(error.message);
    }
  };

  const handleRegister = async (data) => {
    try {
      await registerUser(
        data.username,
        data.password,
        data.fullname,
        data.email,
        data.phoneNum,
      );
      toast.success('Đăng ký thành công!');

      // Optionally tự động đăng nhập:
      // const token = await loginUser(data.identifier, data.password);
      // localStorage.setItem("accessToken", token);

      // Chuyển sang màn đăng nhập
      // setMode("login"); // nếu bạn dùng toggle form
    } catch (error) {
      console.error('Đăng ký thất bại:', error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      {mode === 'login' ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <p className="mt-4 text-sm">
            Chưa có tài khoản?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode('register')}
            >
              Đăng ký
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegister={handleRegister} />
          <p className="mt-4 text-sm">
            Đã có tài khoản?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode('login')}
            >
              Đăng nhập
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthPage;
