/**
 * Step 4: Shipping
 * Location and shipping method options
 * Clean, professional design
 */
import { memo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Switch,
  Paper,
  Chip,
  alpha,
  Autocomplete,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ShippingStepProps {
  data: {
    location: string;
    supportFastShipping: boolean;
    supportRegularShipping: boolean;
    supportEconomyShipping: boolean;
  };
  onChange: (updates: Partial<ShippingStepProps['data']>) => void;
}

const shippingOptions = [
  {
    key: 'supportFastShipping' as const,
    label: 'Express Delivery',
    description: '1-2 business days',
  },
  {
    key: 'supportRegularShipping' as const,
    label: 'Standard Delivery',
    description: '3-5 business days',
    recommended: true,
  },
  {
    key: 'supportEconomyShipping' as const,
    label: 'Economy Delivery',
    description: '7-14 business days',
  },
];

const popularLocations = [
  'HCMC',
  'Hanoi',
  'Da Nang',
  'Can Tho',
  'Hai Phong',
  'Singapore',
  'Bangkok',
  'Jakarta',
  'Seoul',
  'Tokyo',
];

const ShippingStep = memo(function ShippingStep({ data, onChange }: ShippingStepProps) {
  const theme = useTheme();

  const enabledCount = [
    data.supportFastShipping,
    data.supportRegularShipping,
    data.supportEconomyShipping,
  ].filter(Boolean).length;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Location Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Shipping Location *
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Where your products will be shipped from
        </Typography>

        <Autocomplete
          freeSolo
          options={popularLocations}
          value={data.location}
          onChange={(_, newValue) => onChange({ location: newValue || '' })}
          onInputChange={(_, newInputValue) => onChange({ location: newInputValue })}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter your warehouse or shipping location"
              size="small"
              required
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            />
          )}
        />

        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {popularLocations.slice(0, 4).map((loc) => (
            <Chip
              key={loc}
              label={loc}
              size="small"
              variant={data.location === loc ? 'filled' : 'outlined'}
              onClick={() => onChange({ location: loc })}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Shipping Methods Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Shipping Methods
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select delivery options you support
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {enabledCount} selected
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {shippingOptions.map((option) => {
            const isEnabled = data[option.key];

            return (
              <Paper
                key={option.key}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: `1px solid ${isEnabled ? theme.palette.primary.main : theme.palette.divider}`,
                  bgcolor: isEnabled ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => onChange({ [option.key]: !isEnabled })}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {option.label}
                    </Typography>
                    {option.recommended && (
                      <Chip label="Recommended" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
                <Switch
                  checked={isEnabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    onChange({ [option.key]: e.target.checked });
                  }}
                  size="small"
                />
              </Paper>
            );
          })}
        </Box>
      </Paper>

      {/* Completion Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Almost Done!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click <strong>Complete</strong> to publish your product. It will be automatically activated and visible to customers.
        </Typography>

        {/* Summary */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {data.location && (
            <Chip
              label={data.location}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
          {enabledCount > 0 && (
            <Chip
              label={`${enabledCount} shipping method${enabledCount > 1 ? 's' : ''}`}
              size="small"
              color="success"
              sx={{ borderRadius: 1 }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
});

export default ShippingStep;
