import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import CategoryCard from './CategoryCard';
import SectionTitle from './SectionTitle';

interface CategoryItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
}

const categories: CategoryItem[] = [
  {
    id: 'keyboard',
    image: '/images/keyboard_hero.jpg',
    title: 'Keyboards',
    description: 'Premium custom mechanical keyboards',
    link: '/products?category=keyboard',
  },
  {
    id: 'keycap',
    image: '/images/keycap_hero.png',
    title: 'Keycaps',
    description: 'Artisan and profile keycap sets',
    link: '/products?category=keycap',
  },
  {
    id: 'switch',
    image: '/images/switch_hero.jpg',
    title: 'Switches',
    description: 'Linear, tactile & clicky switches',
    link: '/products?category=switch',
  },
];

/**
 * Category section with three main product categories
 * Displays category cards in a responsive grid layout
 */
const CategorySection: React.FC = () => {
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
          title="Shop by Category"
          subtitle="Explore our curated collection of mechanical keyboard essentials"
        />

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CategoryCard
                image={category.image}
                title={category.title}
                description={category.description}
                link={category.link}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategorySection;
