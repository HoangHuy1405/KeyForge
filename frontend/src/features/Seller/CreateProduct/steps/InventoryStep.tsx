/**
 * Step 3: Inventory
 * Pricing and stock management
 * Clean, professional design
 */
import { memo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Paper,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface InventoryStepProps {
  data: {
    price: string;
    stockQuantity: string;
    minOrderQuantity: string;
    maxOrderQuantity: string;
  };
  onChange: (updates: Partial<InventoryStepProps['data']>) => void;
}

const InventoryStep = memo(function InventoryStep({ data, onChange }: InventoryStepProps) {
  const theme = useTheme();

  const handleNumberChange = (field: keyof InventoryStepProps['data']) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange({ [field]: value });
    }
  };

  const price = parseFloat(data.price) || 0;
  const stock = parseInt(data.stockQuantity) || 0;
  const totalValue = price * stock;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Grid container spacing={2}>
        {/* Pricing Section */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Pricing & Stock
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: 'text.secondary' }}>
                Price (USD) *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter price"
                value={data.price}
                onChange={handleNumberChange('price')}
                required
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    ),
                  },
                  htmlInput: {
                    inputMode: 'decimal',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: 'text.secondary' }}>
                Stock Quantity *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter quantity"
                value={data.stockQuantity}
                onChange={handleNumberChange('stockQuantity')}
                required
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">units</InputAdornment>
                    ),
                  },
                  htmlInput: {
                    inputMode: 'numeric',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Order Limits */}
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Order Limits (Optional)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Restrict the quantity customers can purchase per order
            </Typography>

            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Min Quantity"
                  placeholder="1"
                  value={data.minOrderQuantity}
                  onChange={handleNumberChange('minOrderQuantity')}
                  size="small"
                  slotProps={{
                    htmlInput: { inputMode: 'numeric' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Max Quantity"
                  placeholder="No limit"
                  value={data.maxOrderQuantity}
                  onChange={handleNumberChange('maxOrderQuantity')}
                  size="small"
                  slotProps={{
                    htmlInput: { inputMode: 'numeric' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Summary Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Price Display */}
            <Box
              sx={{
                p: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Price
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {price > 0 ? `₫${price.toLocaleString()}` : '₫0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per unit
              </Typography>
            </Box>

            {/* Stats */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stock
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {stock.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    ₫{totalValue.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default InventoryStep;
