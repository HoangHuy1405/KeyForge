// HeaderCart.tsx
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Popper,
  Paper,
  Grow,
  List,
  ListItem,
  Typography,
  Divider,
  Link,
  Avatar,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../hooks/hooks';
import StyledBadge from '../../components/StyledBadge';
import { getCart } from '../../redux/slice/cartSlice';
import { StyledButton } from '../../components/StyledButton';

export function HeaderCart() {
  const theme = useTheme();
  const cartItems = useAppSelector(getCart);
  const cartLength = cartItems.length;

  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      sx={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link component={RouterLink} to="/cart" underline="none">
        <IconButton
          ref={anchorRef}
          sx={{
            color: theme.palette.text.primary,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <StyledBadge badgeContent={cartLength}>
            <ShoppingCartOutlinedIcon fontSize="large" />
          </StyledBadge>
        </IconButton>
      </Link>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        sx={{ zIndex: (t) => t.zIndex.tooltip }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              elevation={4}
              sx={{
                width: 360,
                p: 1,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                background:
                  theme.palette.mode === 'light'
                    ? '#fff'
                    : theme.palette.background.paper,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ px: 1, py: 0.75, fontWeight: 600 }}
              >
                Recently added products ({cartLength})
              </Typography>
              <Divider />

              {cartLength === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1, py: 2 }}
                >
                  Your cart is empty.
                </Typography>
              ) : (
                <List dense sx={{ maxHeight: 280, overflowY: 'auto', py: 0 }}>
                  {cartItems.map((item) => {
                    const lineTotal = (item.unitPrice * item.quantity).toFixed(
                      2,
                    );
                    return (
                      <ListItem
                        key={item.id}
                        sx={{
                          px: 1,
                          py: 0.75,
                          borderRadius: 1.5,
                          '&:hover': {
                            backgroundColor:
                              theme.palette.mode === 'light'
                                ? 'rgba(0,0,0,0.03)'
                                : 'rgba(255,255,255,0.06)',
                          },
                          // layout: left (thumb + text), right (total)
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {/* Thumbnail */}
                        <Avatar
                          variant="rounded"
                          src={(item as any).image || undefined}
                          alt={item.name}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor:
                              theme.palette.mode === 'light'
                                ? 'grey.50'
                                : 'grey.800',
                            flexShrink: 0,
                          }}
                        >
                          {/* fallback initial if no image */}
                          {item.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        {/* Name + unit price x qty */}
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            title={item.name}
                            sx={{ fontWeight: 500 }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${item.unitPrice.toFixed(2)} × {item.quantity}
                          </Typography>
                        </Box>

                        {/* Line total (right aligned) */}
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          ${lineTotal}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              )}

              <Divider sx={{ my: 1 }} />
              <Box padding={1} display="flex" gap={1}>
                {cartLength === 0 ? (
                  <Link
                    component={RouterLink}
                    to="/products"
                    underline="none"
                    sx={{ flex: 1 }}
                  >
                    <StyledButton fullWidth>Go shopping now</StyledButton>
                  </Link>
                ) : (
                  <>
                    <Link
                      component={RouterLink}
                      to="/cart"
                      underline="none"
                      sx={{ flex: 1 }}
                    >
                      <StyledButton fullWidth>View Cart</StyledButton>
                    </Link>
                    <Link
                      component={RouterLink}
                      to="/products"
                      underline="none"
                      sx={{ flex: 1 }}
                    >
                      <StyledButton fullWidth variant="outlined">
                        Continue shopping
                      </StyledButton>
                    </Link>
                  </>
                )}
              </Box>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
