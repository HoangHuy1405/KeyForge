import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ProductDetailsView } from '../../../services/interfaces/productInterfaces';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { StyledButton } from '../../../components/StyledButton';
import QuantityControl from '../../../components/QuantityControl';
import { useCartActions } from '../../../hooks/useCartActions';
import {
  mapDetailsToView,
  mapFromDetailsViewToFavorite,
} from '../productMappers';
import { useAppSelector } from '../../../hooks/hooks';
import { isFavorite, toggleFavorite } from '../../../redux/slice/favoriteSlice';
import { useDispatch } from 'react-redux';

interface productProps {
  product: ProductDetailsView;
}

export default function ProductMainInfo({ product }: productProps) {
  const { handleAddToCart } = useCartActions();
  const [quantity, setQuantity] = useState(
    product.inventory?.minOrderQuantity || 1,
  );
  const { name, category, stockStatus } = product;

  // Get key attributes for display (first 4)
  const attributes = product.attributes || {};
  const attributeEntries = Object.entries(attributes).slice(0, 4);

  // Safely access inventory with fallbacks
  const availableQuantity = product.inventory?.availableQuantity ?? 0;
  const minOrderQuantity = product.inventory?.minOrderQuantity ?? 1;

  const { username: sellerName } = product.seller || { username: 'Unknown' };
  const price = product.inventory?.price?.toFixed(2) ?? '0.00';
  const maxOrder = product.inventory?.maxOrderQuantity ?? Infinity;
  const maxAllowed = Math.min(
    maxOrder,
    Math.max(availableQuantity, 0) || Infinity,
  );

  const isFavor = useAppSelector(isFavorite(product.id));
  const dispatch = useDispatch();

  function handleToggleFavorite() {
    dispatch(toggleFavorite(mapFromDetailsViewToFavorite(product)));
  }

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Stack spacing={3} sx={{ width: '100%' }}>
        {/* Header */}
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h4" sx={{ letterSpacing: -0.2 }}>
                {name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                by {sellerName}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleToggleFavorite}
                color={isFavor ? 'error' : 'default'}
              >
                {isFavor ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {stockStatus && (
              <Chip
                label={stockStatus.replace(/_/g, ' ')}
                color={stockStatus === 'IN_STOCK' ? 'success' : 'warning'}
                size="small"
              />
            )}
            <Chip label={category} variant="outlined" size="small" />
          </Stack>
        </Stack>

        {/* Price */}
        <Box>
          <Typography variant="h4">${price}</Typography>
          <Typography
            variant="body2"
            color={availableQuantity > 0 ? 'success.main' : 'error.main'}
            sx={{ mt: 0.5 }}
          >
            {availableQuantity > 0
              ? `In Stock (${availableQuantity} available)`
              : 'Out of Stock'}
          </Typography>
        </Box>

        {/* Key Attributes (Dynamic) */}
        {attributeEntries.length > 0 && (
          <Grid container spacing={2}>
            {attributeEntries.map(([key, value]) => (
              <Grid key={key} size={6}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {key.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="body1">{String(value)}</Typography>
              </Grid>
            ))}
          </Grid>
        )}

        <Divider />

        {/* Quantity & Actions */}
        <Stack spacing={2}>
          <span>Quantity</span>
          <span>
            <QuantityControl
              value={quantity}
              min={minOrderQuantity}
              max={maxAllowed}
              onDecrease={() => setQuantity((i) => i - 1)}
              onIncrease={() => setQuantity((i) => i + 1)}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              Min: {minOrderQuantity}, Max: {maxAllowed === Infinity ? '∞' : maxAllowed}
            </Typography>
          </span>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            width={0.6}
          >
            <StyledButton
              onClick={() => handleAddToCart(mapDetailsToView(product))}
              disabled={availableQuantity === 0}
            >
              Add to Cart
            </StyledButton>
            <StyledButton color="secondary">Buy Now</StyledButton>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
}
