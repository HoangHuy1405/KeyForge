// src/components/Error.tsx
import React from 'react';
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { Box, Typography, Paper, useTheme, alpha, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Error: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  const theme = useTheme();

  // normalize message/status
  const isResponse = isRouteErrorResponse(error);
  const title = isResponse
    ? `Oops! ${error.status}`
    : 'Something went wrong 😢';
  const message =
    (isResponse && (error.data?.message || error.statusText)) ||
    (error as Error)?.message ||
    'An unexpected error occurred.';

  return (
    <Paper
      sx={{
        ml: 3,
        mt: 3,
        maxWidth: 'xl',
        borderRadius: 4,
        p: 4,
        boxShadow: theme.shadows[10],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
          }}
        >
          <ErrorOutlineIcon fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: 'text.secondary',
            }}
          >
            {message}
          </Typography>

          {/* Optional technical details toggle - only in dev mode */}
          {import.meta.env?.DEV && error && (
            <Box
              component="details"
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                fontSize: '0.875rem',
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
              }}
            >
              <Typography
                component="summary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Technical details
              </Typography>
              <Box component="pre" sx={{ mt: 1, overflow: 'auto' }}>
                {isResponse ? JSON.stringify(error, null, 2) : String(message)}
              </Box>
            </Box>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Go home
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Error;
