import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Button,
} from '@mui/material';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Fashion & Apparel', icon: '👗', items: '2,500+ items' },
  { id: 2, name: 'Electronics & Tech', icon: '💻', items: '1,800+ items' },
  { id: 3, name: 'Home & Garden', icon: '🏡', items: '3,200+ items' },
  { id: 4, name: 'Sports & Fitness', icon: '🏋️‍♂️', items: '1,500+ items' },
  { id: 5, name: 'Beauty & Care', icon: '💄', items: '900+ items' },
  { id: 6, name: 'Books & Education', icon: '📚', items: '5,000+ items' },
  { id: 7, name: 'Automotive', icon: '🚗', items: '1,200+ items' },
];

export default function CategorySlider() {
  const [startIndex, setStartIndex] = useState(0);
  const visible = 4;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visible >= categories.length ? 0 : prev + visible,
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - visible < 0 ? categories.length - visible : prev - visible,
    );
  };

  return (
    <Box sx={{ pt: 6, px: 12 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box mb={2}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Shop by Category
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover our wide range of products across different categories
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <IconButton
            onClick={prevSlide}
            sx={{
              bgcolor: '#fff', // white background
              boxShadow: 1, // optional subtle shadow
              '&:hover': {
                bgcolor: 'grey.100', // hover effect
              },
            }}
          >
            <ArrowLeft size={18} />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              bgcolor: '#fff',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            <ArrowRight size={18} />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {categories.slice(startIndex, startIndex + visible).map((cat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat.id}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <CardActionArea>
                <CardContent sx={{ py: 4 }}>
                  <Typography variant="h2" component="div" gutterBottom>
                    {cat.icon}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.items}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          component={RouterLink}
          to="/products"
          variant="outlined"
          size="large"
          endIcon={<ChevronRight />}
        >
          View All Categories
        </Button>
      </Box>
    </Box>
  );
}
