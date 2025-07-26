import api from './api'

export const registerUser = async (username, password, fullname, email, phonenum) => {
    return api.post('auth/register', {
        username,
        password,
        fullname,
        email,
        phonenum
    });
}

export const loginUser = async (identifier, password) => {
  return api.post('auth/login', {
    identifier,
    password
  });
};