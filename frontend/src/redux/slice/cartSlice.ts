// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// What we keep in the cart
export interface CartItemData {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  selected: boolean;
}

export interface CartState {
  cartItems: CartItemData[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // payload: CartItem (already includes unitPrice/quantity)
    addItem(state, action: PayloadAction<CartItemData>) {
      state.cartItems.push(action.payload);
    },

    // payload: id (string)
    deleteItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    // payload: id (string)
    increaseItemQuantity(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      item.quantity += 1;
      item.totalPrice = item.quantity * item.unitPrice;
    },

    // payload: id (string)
    decreaseItemQuantity(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      // keep at least 1, or remove if you prefer
      if (item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    setItemSelected(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      item.selected = !item.selected;
    },
    setAllSelected(state, action: PayloadAction<boolean>) {
      const selected = action.payload;
      state.cartItems.forEach((p) => {
        p.selected = selected;
      });
    },

    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  setItemSelected,
  setAllSelected,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const getCart = (state: RootState) => state.cart.cartItems;

export const getTotalCartQuantity = (state: RootState) =>
  state.cart.cartItems.reduce((sum, curr) => sum + curr.quantity, 0);

export const getTotalCartPrice = (state: RootState) =>
  state.cart.cartItems.reduce((sum, curr) => sum + curr.totalPrice, 0);

export const getCartLength = (state: RootState) => state.cart.cartItems.length;
