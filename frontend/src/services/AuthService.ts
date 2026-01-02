import api from './api';
import { LoginRequest, ResLoginDTO } from './interfaces/authInterfaces';

export const registerUser = async (data: any) => {
  const { username, password, fullName, email, phoneNum } = data;
  console.log(fullName);
  return api.post('auth/register', {
    username,
    password,
    fullname: fullName,
    email,
    phoneNum,
  });
};

export const loginUser = async (payload: LoginRequest) => {
  return api.post('auth/login', payload);
};

export const logout = async () => {
  return api.post('auth/logout');
};

export const refresh = async () => {
  return api.post<ResLoginDTO>('auth/refresh', undefined, {
    withCredentials: true,
  });
};
