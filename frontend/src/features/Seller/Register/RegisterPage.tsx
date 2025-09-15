// src/features/Seller/Register/RegisterPage.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import {
  configureShipping,
  SellerCreateResponse,
  SellerShippingRequest,
  SellerStartRequest,
  startRegistration,
} from '../../../services/SellerService';
import { useAppSelector } from '../../../hooks/hooks';
import { getUserId } from '../../../redux/slice/accountSlice';

const steps = ['Store Info', 'Shipping Options', 'Finish'];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [seller, setSeller] = useState<SellerCreateResponse | null>(null);
  console.log(seller);

  // Step 1 form state
  const [formData, setFormData] = useState<SellerStartRequest>({
    storeName: '',
    email: '',
    phoneNum: '',
    address: '',
    userId: useAppSelector(getUserId),
  });

  // Step 2 form state
  const [shippingData, setShippingData] = useState<SellerShippingRequest>({
    express: false,
    standard: true,
    economy: false,
  });

  const handleStartRegistration = async () => {
    try {
      const response = await startRegistration(formData);
      setSeller(response);
      setActiveStep(1);
    } catch (err: any) {
      alert('Failed to start registration: ' + err.message);
    }
  };

  const handleConfigureShipping = async () => {
    if (!seller) return;
    try {
      const response = await configureShipping(seller.sellerId, shippingData);
      setSeller(response);
      setActiveStep(2);
    } catch (err: any) {
      alert('Failed to configure shipping: ' + err.message);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Become a Seller
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Store Info */}
      {activeStep === 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Store Name"
            value={formData.storeName}
            onChange={(e) =>
              setFormData({ ...formData, storeName: e.target.value })
            }
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <TextField
            label="Phone Number"
            value={formData.phoneNum}
            onChange={(e) =>
              setFormData({ ...formData, phoneNum: e.target.value })
            }
            required
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
          <Button variant="contained" onClick={handleStartRegistration}>
            Next
          </Button>
        </Box>
      )}

      {/* Step 2: Shipping */}
      {activeStep === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" gutterBottom>
            Choose shipping methods
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={shippingData.express}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      express: e.target.checked,
                    })
                  }
                />
              }
              label="Express Shipping"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shippingData.standard}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      standard: e.target.checked,
                    })
                  }
                />
              }
              label="Standard Shipping"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={shippingData.economy}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      economy: e.target.checked,
                    })
                  }
                />
              }
              label="Economy Shipping"
            />
          </FormGroup>
          <Button variant="contained" onClick={handleConfigureShipping}>
            Finish Setup
          </Button>
        </Box>
      )}

      {/* Step 3: Finish */}
      {activeStep === 2 && (
        <Box textAlign="center">
          <Typography variant="h5" color="success.main" gutterBottom>
            🎉 Registration Complete!
          </Typography>
          <Typography>
            Your store "{seller?.storeName}" is now set up.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
