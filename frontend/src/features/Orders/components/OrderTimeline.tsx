import { Box, Typography, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { OrderDetailResponseDto } from '../../../services/OrderService';

interface TimelineStep {
  key: keyof Pick<OrderDetailResponseDto, 'createdAt' | 'processingAt' | 'shippedAt' | 'deliveredAt' | 'completedAt' | 'cancelledAt'>;
  label: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'createdAt', label: 'Order Placed' },
  { key: 'processingAt', label: 'Payment Confirmed' },
  { key: 'shippedAt', label: 'Parcel Shipped' },
  { key: 'deliveredAt', label: 'Delivered' },
  { key: 'completedAt', label: 'Completed' },
];

interface OrderTimelineProps {
  order: OrderDetailResponseDto;
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OrderTimeline({ order }: OrderTimelineProps) {
  // Check if order is cancelled
  const isCancelled = !!order.cancelledAt;

  // Filter steps for cancelled orders
  const steps = isCancelled
    ? [
        { key: 'createdAt' as const, label: 'Order Placed' },
        { key: 'cancelledAt' as const, label: 'Order Cancelled' },
      ]
    : TIMELINE_STEPS;

  return (
    <Box sx={{ py: 2 }}>
      <Stack spacing={0}>
        {steps.map((step, index) => {
          const timestamp = order[step.key];
          const isCompleted = !!timestamp;
          const isLast = index === steps.length - 1;
          const isCancelStep = step.key === 'cancelledAt';

          return (
            <Stack key={step.key} direction="row" spacing={2}>
              {/* Timeline Icon & Line */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 24,
                }}
              >
                {isCompleted ? (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 24,
                      color: isCancelStep ? 'error.main' : 'success.main',
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{
                      fontSize: 24,
                      color: 'grey.400',
                    }}
                  />
                )}
                {/* Connecting line */}
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flexGrow: 1,
                      minHeight: 40,
                      bgcolor: isCompleted ? 'success.main' : 'grey.300',
                    }}
                  />
                )}
              </Box>

              {/* Step Content */}
              <Box sx={{ pb: isLast ? 0 : 3, pt: 0.25 }}>
                <Typography
                  variant="body1"
                  fontWeight={isCompleted ? 600 : 400}
                  color={isCompleted ? 'text.primary' : 'text.disabled'}
                  sx={{
                    color: isCancelStep && isCompleted ? 'error.main' : undefined,
                  }}
                >
                  {step.label}
                </Typography>
                {isCompleted && timestamp && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDateTime(timestamp)}
                  </Typography>
                )}
                {!isCompleted && (
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                    Pending
                  </Typography>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
