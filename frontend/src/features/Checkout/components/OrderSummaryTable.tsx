import {
  Box,
  Paper,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { CartItemData } from '../../../redux/slice/cartSlice';

interface OrderSummaryTableProps {
  items: CartItemData[];
}

export default function OrderSummaryTable({ items }: OrderSummaryTableProps) {
  const theme = useTheme();

  return (
    <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <ShoppingBagIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Order Summary
        </Typography>
        <Chip label={`${items.length} items`} size="medium" color="primary" />
      </Stack>
      
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Product</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Unit Price</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ py: 2.5 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {item.id.slice(0, 12)}...
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight={500}>
                    ${item.unitPrice.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={`×${item.quantity}`} 
                    size="medium" 
                    variant="outlined"
                    sx={{ fontWeight: 600, minWidth: 60 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight={700} color="primary">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
