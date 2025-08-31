import { toast } from 'react-toastify';
import { ProductView } from '../features/Product/ProductCard';
import { mapFromProductViewToCartItem } from '../features/Product/productMappers';
import {
  addItem,
  deleteItem,
  getCart,
  increaseItemQuantity,
} from '../redux/slice/cartSlice';
import { useAppDispatch, useAppSelector } from './hooks';

export function useCartActions() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);

  const handleAddToCart = (product: ProductView, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Just update quantity
      dispatch(increaseItemQuantity(existingItem.id));
      toast.success('Same product found! Quantity updated in cart');
    } else {
      // Add new product
      const cartItem = mapFromProductViewToCartItem(product, quantity);
      dispatch(addItem(cartItem));
      toast.success('Item added to cart');
    }
  };
  const handleRemoveItem = (id: string) => {
    dispatch(deleteItem(id));
    toast.success('Item removed from cart');
  };

  return { handleAddToCart, handleRemoveItem };
}
