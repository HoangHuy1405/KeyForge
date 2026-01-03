import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createVnPayCheckout, 
  VnPayCheckoutResponse 
} from '../../services/PaymentService';
import { CreateOrderRequest } from '../../services/OrderService';
import { toast } from 'react-toastify';

interface PaymentMutationCallbacks {
  onSuccess?: (data: VnPayCheckoutResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for creating VNPay checkout
 * On success, redirects user to VNPay payment page
 * Note: Cart is NOT cleared here - it will be cleared in PaymentReturnPage 
 * after successful payment verification
 */
export const useVnPayCheckout = (callbacks?: PaymentMutationCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation<VnPayCheckoutResponse, Error, CreateOrderRequest>({
    mutationFn: (request: CreateOrderRequest) => createVnPayCheckout(request),
    onSuccess: (data) => {
      // Invalidate any order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.info('Redirecting to VNPay...');
      
      // Call custom onSuccess if provided
      callbacks?.onSuccess?.(data);
      
      // Redirect to VNPay payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to initiate VNPay payment');
      
      callbacks?.onError?.(error);
    },
  });
};
