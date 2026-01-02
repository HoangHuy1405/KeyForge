import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: '',
  user: {
    id: '',
    email: '',
    username: '',
    fullname: '',
    address: '',
    phoneNumber: '',
    avatarUrl: '',
    roles: [],
  },
};

//

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user.id = action?.payload?.id;
      state.user.email = action?.payload?.email;
      state.user.username = action?.payload?.username;
      state.user.fullname = action?.payload?.fullname;
      state.user.address = action?.payload?.address;
      state.user.phoneNumber = action?.payload?.phoneNum;
      state.user.avatarUrl = action?.payload?.avatarUrl;
      state.user.roles = action?.payload?.roles;
    },
    updateAvatar: (state, action) => {
      state.user.avatarUrl = action?.payload;
    },
    logout: () => initialState,
  },
});

export const { setUserLoginInfo, updateAvatar, logout } = accountSlice.actions;

export default accountSlice.reducer;

export const getUserId = (state: RootState) => state.account.user.id;
export const getRoles = (state: RootState) => state.account.user.roles;
