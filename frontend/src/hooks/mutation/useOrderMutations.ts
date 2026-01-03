import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createOrder, 
  cancelOrder,
  CreateOrderRequest, 
  OrderResponse 
} from '../../services/OrderService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slice/cartSlice';

// Options for customizing hooks
interface OrderMutationCallbacks {
  onSuccess?: (data: OrderResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for creating a new order
 */
export const useCreateOrder = (callbacks?: OrderMutationCallbacks) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<OrderResponse, Error, CreateOrderRequest>({
    mutationFn: (request: CreateOrderRequest) => createOrder(request),
    onSuccess: (data) => {
      // Clear the cart after successful order
      dispatch(clearCart());
      
      // Invalidate any order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success('Order placed successfully!');
      
      // Call custom onSuccess if provided
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to place order');
      
      // Call custom onError if provided
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Hook for cancelling an order
 */
export const useCancelOrder = (callbacks?: OrderMutationCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, string>({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      
      toast.success('Order cancelled successfully');
      
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel order');
      
      callbacks?.onError?.(error);
    },
  });
};
