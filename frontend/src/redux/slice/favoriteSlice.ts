import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ProductFavorite {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
}
interface favoriteState {
  products: Record<string, ProductFavorite>;
}

const initialState: favoriteState = {
  products: {},
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    // Add or remove based on presence
    toggleFavorite(state, action: PayloadAction<ProductFavorite>) {
      const { id } = action.payload;
      if (state.products[id]) {
        delete state.products[id];
      } else {
        state.products[id] = action.payload;
      }
    },
    // Explicit add/remove for clarity when you don’t want toggling
    addFavorite(state, action: PayloadAction<ProductFavorite>) {
      state.products[action.payload.id] = action.payload;
    },
    removeFavorite(state, action: PayloadAction<string>) {
      delete state.products[action.payload];
    },

    // Optional: clear all favorites
    clearFavorites(state) {
      state.products = {};
    },
  },
});

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;

// Selectors
const selectFavoritesMap = (state: RootState) => state.favorite.products;
export const isFavorite = (id: string) =>
  createSelector([selectFavoritesMap], (map) => Boolean(map[id]));
export const selectFavoritesCount = createSelector(
  [selectFavoritesMap],
  (map) => Object.keys(map).length,
);
