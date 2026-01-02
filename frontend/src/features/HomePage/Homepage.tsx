import React from 'react';
import { Box, Divider } from '@mui/material';
import {
  HeroSlideshow,
  CategorySection,
  ProductInterestList,
} from './components';
import { Newsletter } from './Newsletter';

/**
 * Homepage component
 * Features:
 * - Hero slideshow with keyboard images
 * - Category section (Keyboard, Keycap, Switch)
 * - Product interest list with "View More" pagination
 * - Newsletter signup section
 */
function Homepage() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Category Cards Section */}
      <CategorySection />

      {/* Divider */}
      <Divider
        sx={{
          mx: { xs: 2, sm: 4, md: 6, lg: 10 },
          my: 2,
        }}
      />

      {/* Products Interest List */}
      <ProductInterestList />

      {/* Newsletter */}
      <Newsletter />
    </Box>
  );
}

export default Homepage;
