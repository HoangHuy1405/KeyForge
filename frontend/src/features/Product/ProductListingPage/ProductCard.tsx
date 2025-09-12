import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useCartActions } from '../../../hooks/useCartActions';
import { useAppSelector } from '../../../hooks/hooks';
import { isFavorite, toggleFavorite } from '../../../redux/slice/favoriteSlice';
import { mapFromProductViewToProductFavorite } from '../productMappers';
import { StyledButton } from '../../../components/StyledButton';
import { useNavigate } from 'react-router';

export interface ProductView {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  seller: string;
  location: string;
  category: string;
  brand: string;
  sales: number;
  dateAdded: string;
}

interface ProductCardProps {
  product: ProductView;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;
  const { handleAddToCart } = useCartActions();
  const dispatch = useDispatch();
  const isFav = useAppSelector(isFavorite(product.id));
  const navigate = useNavigate();

  function handleToggleFavorite() {
    dispatch(toggleFavorite(mapFromProductViewToProductFavorite(product)));
  }

  return (
    <Root>
      <ImageWrap>
        <Img
          src={product.image}
          alt={product.name}
          onClick={() => navigate(`/products/${product.id}`)}
        />

        {discountPercentage > 0 && (
          <DiscountChip label={`-${discountPercentage}%`} />
        )}

        <LikeButton
          aria-label={isFav ? 'Unlike' : 'Like'}
          onClick={handleToggleFavorite}
        >
          {isFav ? (
            <FavoriteIcon fontSize="small" sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: 'grey.700' }} />
          )}
        </LikeButton>

        {/* Hover "Add to cart" — shows only on hover, keeps current design */}
        <HoverActions className="hoverActions">
          <StyledButton onClick={() => handleAddToCart(product)}>
            Add to cart
          </StyledButton>
        </HoverActions>
      </ImageWrap>

      <CardContent sx={{ p: 2 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'grey.900',
              lineHeight: 1.3,
              fontWeight: 600,
            }}
            title={product.name}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            by {product.seller}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
            <Typography variant="body2">{product.rating}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            ({product.reviewCount})
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Pill variant="filled" color="default" label={product.location} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: 'grey.900', fontWeight: 700 }}
            >
              ${product.price.toLocaleString()}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
                sx={{ color: 'grey.600', textDecoration: 'line-through' }}
              >
                ${product.originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pill
              variant="outlined"
              color="default"
              label={product.category}
              sx={{
                bgcolor: 'background.default',
              }}
            />
            <Typography variant="caption" sx={{ color: 'grey.600' }}>
              {product.sales} sold
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Root>
  );
}
const Root = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  border: 0,
  borderRadius: Number(theme.shape.borderRadius) * 2, // ~ rounded-2xl
  backgroundColor: '#fff',
  boxShadow: theme.shadows[1],
  transition: 'box-shadow 300ms ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    cursor: 'pointer',
  },
  // reveal hover actions smoothly on card hover
  '&:hover .hoverActions': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const ImageWrap = styled('div')({
  position: 'relative',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundImage: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)', // from-blue-50 to-purple-50
});

const Img = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 300ms ease',
  '.MuiCard-root:hover &': {
    transform: 'scale(1.05)',
  },
});

const DiscountChip = styled(Chip)({
  position: 'absolute',
  left: 12,
  top: 12,
  paddingInline: 6,
  color: '#fff',
  background:
    'linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(236,72,153,1) 100%)', // red-500 -> pink-500
  border: 0,
  height: 26,
  fontWeight: 600,
});

const LikeButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 12,
  top: 12,
  width: 32,
  height: 32,
  backgroundColor: 'rgba(255,255,255,0.8)',
  backdropFilter: 'saturate(180%) blur(6px)',
  transition: 'background-color 150ms ease',
  '&:hover': {
    backgroundColor: '#fff',
  },
  boxShadow: theme.shadows[1],
}));

const Pill = styled(Chip)(({ theme }) => ({
  height: 22,
  fontSize: 12,
  borderRadius: 999,
  '& .MuiChip-label': { paddingInline: 8 },
}));

// NEW: subtle bottom overlay that appears on hover
const HoverActions = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: 12,
  background:
    'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0) 100%)',
  opacity: 0,
  transform: 'translateY(8px)',
  transition: 'opacity 180ms ease, transform 180ms ease',
  pointerEvents: 'none', // prevent capturing other interactions except the button
  // allow only the button inside to be clickable
  '& > *': { pointerEvents: 'auto' },
}));
