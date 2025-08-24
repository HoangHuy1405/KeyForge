import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';

const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

export default store;
