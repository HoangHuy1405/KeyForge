import { Box } from '@mui/material';
import Hero from './Hero';
import CategorySlider from './CategorySlider';
import { useLoaderData } from 'react-router';
import { ProductList } from '../../services/interfaces/productInterfaces';
import { ProductView } from '../Product/ProductListingPage/ProductCard';
import { useMemo } from 'react';
import { mapProductListToViews } from '../Product/productMappers';
import ProductGrid from '../Product/ProductListingPage/ProductGrid';
import Divider from '@mui/material/Divider';
import { Newsletter } from './Newsletter';

function Homepage() {
  const { data } = useLoaderData() as { data: ProductList };

  const products: ProductView[] = useMemo(
    () => mapProductListToViews(data),
    [data],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Hero />
      <CategorySlider />
      <Divider
        sx={{
          mx: 12,
          my: 6,
        }}
      />
      <div className="mb-12 px-24">
        <ProductGrid products={products} columns={5} spacing={2} mt={2} />
      </div>
      <Newsletter />
    </Box>
  );
}

export default Homepage;
