import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Button, useTheme, alpha } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: '/images/DK1-60.jpg',
    title: 'Premium Custom Keyboards',
    subtitle: 'Experience the perfect typing feel with our curated collection',
    buttonText: 'Shop Keyboards',
    buttonLink: '/products?category=keyboard',
  },
  {
    id: 2,
    image: '/images/Tofu_60___01_720x.webp',
    title: 'Tofu60 Collection',
    subtitle: 'Iconic design meets exceptional build quality',
    buttonText: 'Explore Now',
    buttonLink: '/products?category=keyboard',
  },
  {
    id: 3,
    image: '/images/athena_1800.webp',
    title: 'Athena 1800 Series',
    subtitle: 'Full-size functionality in a compact design',
    buttonText: 'View Collection',
    buttonLink: '/products?category=keyboard',
  },
  // {
  //   id: 4,
  //   image: '/images/Tiger_Lite_Gaming.jpg',
  //   title: 'Gaming Keyboards',
  //   subtitle: 'Precision and speed for competitive gaming',
  //   buttonText: 'Shop Gaming',
  //   buttonLink: '/products?category=keyboard',
  // },
  {
    id: 5,
    image: '/images/Agar60__A2_720x.webp',
    title: 'Agar60 Keyboard',
    subtitle: 'Minimalist design for the modern enthusiast',
    buttonText: 'Discover More',
    buttonLink: '/products?category=keyboard',
  },
];

const SLIDE_INTERVAL = 5000; // 5 seconds

/**
 * Hero slideshow component with auto-advance and navigation
 */
const HeroSlideshow: React.FC = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '50vh', sm: '55vh', md: '65vh' },
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Slides Container */}
      {slides.map((s, index) => (
        <Box
          key={s.id}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: index === currentSlide ? 1 : 0,
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
            src={s.image}
            alt={s.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>
      ))}

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        disabled={isTransitioning}
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          bgcolor: theme.palette.background.paper,
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          boxShadow: theme.shadows[4],
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.background.paper,
            transform: 'translateY(-50%) scale(1.1)',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        <ChevronLeft size={24} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        disabled={isTransitioning}
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          bgcolor: theme.palette.background.paper,
          width: { xs: 40, md: 48 },
          height: { xs: 40, md: 48 },
          boxShadow: theme.shadows[4],
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.background.paper,
            transform: 'translateY(-50%) scale(1.1)',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        <ChevronRight size={24} />
      </IconButton>

      {/* Dot Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, md: 32 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 1.5,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: index === currentSlide ? 32 : 12,
              height: 12,
              borderRadius: 6,
              bgcolor: index === currentSlide 
                ? theme.palette.primary.main 
                : alpha(theme.palette.text.primary, 0.3),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: index === currentSlide 
                  ? theme.palette.primary.main 
                  : alpha(theme.palette.text.primary, 0.5),
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlideshow;
