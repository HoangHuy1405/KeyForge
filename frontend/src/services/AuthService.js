import api from './api';

export const registerUser = async (data) => {
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

export const loginUser = async (identifier, password) => {
  return api.post('auth/login', {
    identifier,
    password,
  });
};
