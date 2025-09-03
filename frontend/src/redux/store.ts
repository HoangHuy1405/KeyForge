import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import cartReducer from './slice/cartSlice';
import favoriteReducer from './slice/favoriteSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const cartPersistConfig = {
  key: 'cart',
  storage,
  version: 1,
  whitelist: ['cartItems'], // persist only what you need from the cart state
};
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const rootReducer = combineReducers({
  account: accountReducer,
  cart: persistedCartReducer,
  favorite: favoriteReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
