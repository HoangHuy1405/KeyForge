import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // adjust path to your store

// Types
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: Role;
}

interface AccountState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: User;
}

// Initial State
const initialState: AccountState = {
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

// Slice
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserLoginInfo: (state, action: PayloadAction<Partial<User>>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = { ...state.user, ...action.payload };
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.user.avatarUrl = action.payload;
    },
    logout: () => initialState,
  },
});

// Actions
export const { setUserLoginInfo, updateAvatar, logout } = accountSlice.actions;

// Reducer
export default accountSlice.reducer;

// Selectors
export const getUserId = (state: RootState): string => state.account.user.id;
export const checkAuthenticated = (state: RootState): boolean =>
  state.account.isAuthenticated;
