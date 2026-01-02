import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

interface DeliveryAddress {
  fullname: string;
  phoneNumber: string;
  address: string;
}

interface DeliveryAddressSectionProps {
  address: DeliveryAddress;
  onAddressChange: (address: DeliveryAddress) => void;
}

export default function DeliveryAddressSection({ 
  address, 
  onAddressChange 
}: DeliveryAddressSectionProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress>({ ...address });

  // Sync editing state when address prop changes
  useEffect(() => {
    setEditingAddress({ ...address });
  }, [address]);

  const handleOpenDialog = () => {
    setEditingAddress({ ...address });
    setDialogOpen(true);
  };

  const handleSaveAddress = () => {
    onAddressChange({ ...editingAddress });
    setDialogOpen(false);
    toast.success('Delivery address updated!');
  };

  return (
    <>
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          border: `2px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          justifyContent="space-between" 
          spacing={2}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LocationOnIcon color="primary" sx={{ fontSize: 32, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                Delivery Address
              </Typography>
              {address.fullname && address.address ? (
                <>
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {address.fullname}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {address.phoneNumber}
                    </Typography>
                    <Chip label="Default" size="small" color="primary" variant="outlined" />
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                    {address.address}
                  </Typography>
                </>
              ) : (
                <Typography color="error" variant="body1">
                  Please add a delivery address to proceed
                </Typography>
              )}
            </Box>
          </Box>
          <Button 
            startIcon={<EditIcon />} 
            onClick={handleOpenDialog}
            variant="outlined"
          >
            Change
          </Button>
        </Stack>
      </Paper>

      {/* Address Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Edit Delivery Address
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={editingAddress.fullname}
              onChange={(e) => setEditingAddress({ ...editingAddress, fullname: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={editingAddress.phoneNumber}
              onChange={(e) => setEditingAddress({ ...editingAddress, phoneNumber: e.target.value })}
            />
            <TextField
              fullWidth
              label="Address"
              multiline
              minRows={3}
              value={editingAddress.address}
              onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
              placeholder="Street address, apartment, city, state, postal code..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} size="large">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveAddress} size="large">
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
