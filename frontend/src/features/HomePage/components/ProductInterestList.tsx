import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ProductGrid from '../../Product/ProductListingPage/ProductGrid';
import SectionTitle from './SectionTitle';
import { useHomeProducts } from '../../../hooks/query/useHomeProducts';

const PRODUCTS_PER_PAGE = 10;

/**
 * Product interest list with "View More" pagination
 * Loads 10 products at a time with a "View More" button
 */
const ProductInterestList: React.FC = () => {
  const theme = useTheme();
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const { products, totalProducts, isLoading, isError, error, isFetching, refetch } =
    useHomeProducts({ size: 50 });

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <SectionTitle
            title="Products You May Like"
            subtitle="Discover our handpicked selection of premium products"
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading products...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <SectionTitle
            title="Products You May Like"
            subtitle="Discover our handpicked selection of premium products"
          />
          <Box
            sx={{
              maxWidth: 500,
              mx: 'auto',
              p: 4,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 48,
                color: 'error.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Unable to load products
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {error?.message || 'Please check your connection and try again.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isFetching ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Retrying...' : 'Try Again'}
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <SectionTitle
            title="Products You May Like"
            subtitle="Discover our handpicked selection of premium products"
          />
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No products available at the moment.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Success state
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6, lg: 10 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <SectionTitle
          title="Products You May Like"
          subtitle="Discover our handpicked selection of premium products"
        />

        <ProductGrid
          products={visibleProducts}
          columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
          spacing={3}
          mt={0}
        />

        {/* View More Button */}
        {hasMore && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={handleViewMore}
              endIcon={<ChevronDown size={20} />}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              View More Products
            </Button>
          </Box>
        )}

        {/* Products count indicator */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 3 }}
        >
          Showing {visibleProducts.length} of {totalProducts} products
        </Typography>
      </Container>
    </Box>
  );
};

export default ProductInterestList;
