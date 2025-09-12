import { Grid, Stack } from '@mui/material';
import ImageGallery from './ImageGallery';
import { ProductDetailsView } from '../../../services/interfaces/productInterfaces';
import ProductMainInfo from './ProductMainInfo';
import SellerInfo from './SellerInfo';
import ProductSpecification from './ProductSpecification';
import ShippingDetails from './ShippingDetails';
import { useLoaderData } from 'react-router';

export default function ProductDetailsPage() {
  const product = useLoaderData() as ProductDetailsView;
  return (
    <Stack
      direction="column"
      gap={2}
      sx={{
        width: '86%',
      }}
    >
      {/* Main section (images + details) */}
      <Grid container spacing={3} sx={{ width: '100%', p: 4 }}>
        <Grid size={5}>
          <ImageGallery product={product} />
        </Grid>
        <Grid size={7}>
          <ProductMainInfo product={product} />
        </Grid>
      </Grid>
      {/* Seller info */}
      <SellerInfo seller={product.seller} />
      {/* Product Specification */}
      <ProductSpecification
        details={product.details}
        logistics={product.logistics}
      />
      {/* Shipping details */}
      <ShippingDetails logistics={product.logistics} />
    </Stack>
  );
}
