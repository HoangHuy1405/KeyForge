import React from 'react';
import { Box } from '@mui/material';
import Hero from './Hero';
import CategorySlider from './CategorySlider';
import Divider from '@mui/material/Divider';
import { Newsletter } from './Newsletter';
import ProductSection from './ProductSection';

function Homepage() {
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
      <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 }, mb: 8 }}>
        <ProductSection title="Our Products" />
      </Box>
      <Newsletter />
    </Box>
  );
}

export default Homepage;
