import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: '',
  user: {
    id: '',
    email: '',
    name: '',
    avatarUrl: '',
    role: {
      id: '',
      name: '',
      permissions: [],
    },
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
      state.user.name = action?.payload?.name;
      state.user.avatarUrl = action?.payload?.avatarUrl;
    },
    updateAvatar: (state, action) => {
      state.user.avatarUrl = action?.payload;
    },
    logout: () => initialState,
  },
});

export const { setUserLoginInfo, updateAvatar, logout } = accountSlice.actions;

export default accountSlice.reducer;

export const getUserId = (state) => state.account.user.id;
