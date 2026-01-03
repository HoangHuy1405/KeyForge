import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slice/cartSlice';
import { getPaymentStatus, OrderPaymentResponse } from '../../services/PaymentService';

// VNPay response codes
const VNPAY_RESPONSE_CODES: Record<string, string> = {
  '00': 'Transaction successful',
  '07': 'Transaction suspicious (potential fraud)',
  '09': 'Card not registered for Internet Banking',
  '10': 'Incorrect card verification (3+ attempts)',
  '11': 'Payment timeout',
  '12': 'Card locked',
  '13': 'Incorrect OTP',
  '24': 'Transaction cancelled by customer',
  '51': 'Insufficient balance',
  '65': 'Daily transaction limit exceeded',
  '75': 'Bank under maintenance',
  '79': 'Incorrect payment password (3+ attempts)',
  '99': 'Unknown error',
};

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<OrderPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get VNPay response parameters
  const responseCode = searchParams.get('vnp_ResponseCode') || '';
  const transactionStatus = searchParams.get('vnp_TransactionStatus') || '';
  const amount = searchParams.get('vnp_Amount') || '';
  const txnRef = searchParams.get('vnp_TxnRef') || '';
  const orderInfo = searchParams.get('vnp_OrderInfo') || '';

  // Check if payment was successful based on VNPay response code
  const isPaymentSuccess = responseCode === '00' && transactionStatus === '00';

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Build params object from URL search params
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // Verify payment with backend
        const result = await getPaymentStatus(params);
        setPaymentResult(result);
        
        // Only clear cart if payment was successful
        if (result.status === 'PAID') {
          dispatch(clearCart());
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to verify payment status');
      } finally {
        setLoading(false);
      }
    };

    // Only verify if we have VNPay params
    if (searchParams.has('vnp_ResponseCode')) {
      verifyPayment();
    } else {
      setLoading(false);
      setError('Invalid payment callback - missing required parameters');
    }
  }, [searchParams, dispatch]);

  // Format amount from VNPay (VND * 100)
  const formatAmount = (vnpAmount: string) => {
    const amountVnd = parseInt(vnpAmount) / 100;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amountVnd);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack alignItems="center" spacing={3}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Verifying payment...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          {/* Status Icon */}
          <Box sx={{ mb: 3 }}>
            {isPaymentSuccess && !error ? (
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            )}
          </Box>

          {/* Status Title */}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {isPaymentSuccess && !error ? 'Payment Successful!' : 'Payment Failed'}
          </Typography>

          {/* Status Message */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error 
              ? error 
              : isPaymentSuccess 
                ? 'Your payment has been processed successfully.'
                : VNPAY_RESPONSE_CODES[responseCode] || 'Transaction was not completed.'}
          </Typography>

          {/* Payment Details */}
          {!error && (
            <Paper variant="outlined" sx={{ p: 3, mb: 4, textAlign: 'left', bgcolor: 'background.default' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Transaction Details
                </Typography>
              </Stack>
              
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Transaction Ref:</Typography>
                  <Typography fontWeight={500}>{txnRef}</Typography>
                </Stack>
                {amount && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Amount:</Typography>
                    <Typography fontWeight={600} color={isPaymentSuccess ? 'success.main' : 'error.main'}>
                      {formatAmount(amount)}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Status:</Typography>
                  <Typography 
                    fontWeight={600} 
                    color={isPaymentSuccess ? 'success.main' : 'error.main'}
                  >
                    {isPaymentSuccess ? 'Completed' : 'Failed'}
                  </Typography>
                </Stack>
                {paymentResult && (
                  <>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Order ID:</Typography>
                      <Typography fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                        {paymentResult.orderId.slice(0, 8)}...
                      </Typography>
                    </Stack>
                    {paymentResult.amountUsd && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Amount (USD):</Typography>
                        <Typography fontWeight={500}>${paymentResult.amountUsd}</Typography>
                      </Stack>
                    )}
                  </>
                )}
                {orderInfo && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Description:</Typography>
                    <Typography fontWeight={500}>{decodeURIComponent(orderInfo.replace(/\+/g, ' '))}</Typography>
                  </Stack>
                )}
              </Stack>
            </Paper>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {isPaymentSuccess && !error ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBagIcon />}
                  onClick={() => navigate('/user/orders')}
                >
                  View Orders
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/cart')}
                >
                  Return to Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/checkout')}
                >
                  Try Again
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
