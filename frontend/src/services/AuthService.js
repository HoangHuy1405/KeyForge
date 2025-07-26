import api from './api'

export const registerUser = async (username, password, fullname, email, phoneNum) => {
    return api.post('auth/register', {
        username,
        password,
        fullname,
        email,
        phoneNum
    });
}

export const loginUser = async (identifier, password) => {
  return api.post('auth/login', {
    identifier,
    password
  });
};