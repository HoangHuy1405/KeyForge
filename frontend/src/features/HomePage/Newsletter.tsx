import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Mail } from 'lucide-react';

export function Newsletter() {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        bgcolor: 'background.contrast',
        color: 'primary.contrastText',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="md" mx="auto">
          {/* Icon */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              mb: 3,
              mx: 'auto',
            }}
          >
            <Mail size={32} />
          </Box>

          {/* Title */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Stay in the Loop
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Subscribe to our newsletter and be the first to know about new
            arrivals, exclusive deals, and special promotions.
          </Typography>

          {/* Form */}
          <Box maxWidth={400} mx="auto">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                type="email"
                placeholder="Enter your email address"
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'primary.contrastText',
                    '&::placeholder': { color: 'rgba(255,255,255,0.6)' },
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  bgcolor: 'primary.contrastText',
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Subscribe
              </Button>
            </Stack>
            <Typography
              variant="caption"
              sx={{ display: 'block', opacity: 0.6, mt: 2 }}
            >
              We respect your privacy. Unsubscribe at any time.
            </Typography>
          </Box>

          {/* Bottom Stats */}
          <Divider
            sx={{
              mt: 8,
              mb: 6,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          />
          <Stack
            direction="row"
            spacing={6}
            justifyContent="center"
            flexWrap="wrap"
            rowGap={3}
          >
            {[
              { value: '10%', label: 'First Order Discount' },
              { value: 'Weekly', label: 'Exclusive Deals' },
              { value: 'Early', label: 'Access to Sales' },
            ].map((stat, i) => (
              <Box key={i} textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
