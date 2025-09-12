import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Container,
  useTheme,
} from '@mui/material';
import {
  ArrowRight,
  ArrowLeft,
  Search,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  Star,
  Gift,
  Zap,
  Users,
} from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: 'Fashion Forward',
    subtitle: 'Latest Trends & Styles',
    description:
      'Discover the newest fashion collections from top brands worldwide',
    buttonText: 'Shop Fashion',
    image:
      'https://images.unsplash.com/photo-1631127839982-a541423cb080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Tech Revolution',
    subtitle: 'Latest Gadgets & Electronics',
    description:
      'Cutting-edge technology products that enhance your digital lifestyle',
    buttonText: 'Explore Tech',
    image:
      'https://images.unsplash.com/photo-1603694681044-e71c5993d6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Home & Lifestyle',
    subtitle: 'Transform Your Space',
    description:
      'Beautiful furniture and decor to make your house feel like home',
    buttonText: 'Shop Home',
    image:
      'https://images.unsplash.com/photo-1587433701752-78cbf88ae429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const slide = heroSlides[currentSlide];

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '70vh',
        overflow: 'hidden',
        background:
          'linear-gradient(to bottom right, rgba(236,72,153,0.2), rgba(147,51,234,0.2), rgba(59,130,246,0.2))',
        transition: 'background 1s ease',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(6px)',
                borderRadius: '999px',
                px: 2,
                py: 0.5,
                mb: 3,
              }}
            >
              <Star size={16} color="#facc15" />
              <Typography variant="body2">
                Premium Quality Guaranteed
              </Typography>
            </Box>

            {/* Title + Subtitle */}
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              {slide.title}
              <Typography
                component="span"
                variant="h4"
                sx={{ display: 'block', mt: 1 }}
              >
                {slide.subtitle}
              </Typography>
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
              {slide.description}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#fff',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Shopping now
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Heart size={18} style={{ marginRight: 8 }} />
                Wishlist
              </Button>
            </Box>

            {/* Feature Pills */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {[
                { icon: <Truck size={16} />, text: 'Free Shipping' },
                { icon: <Shield size={16} />, text: 'Secure Payment' },
                { icon: <Gift size={16} />, text: 'Easy Returns' },
              ].map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '999px',
                    px: 2,
                    py: 0.5,
                  }}
                >
                  {f.icon}
                  <Typography variant="body2">{f.text}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column (Image + Controls) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 6,
              }}
            >
              <Box
                component="img"
                src={slide.image}
                alt={slide.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  transition: 'transform 1s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                }}
              />

              {/* Arrows */}
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                }}
              >
                <ArrowRight size={20} />
              </IconButton>

              {/* Dots */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                }}
              >
                {heroSlides.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor:
                        i === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Stats */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          {[
            {
              icon: <Users size={20} />,
              value: '50K+',
              label: 'Happy Customers',
            },
            { icon: <Zap size={20} />, value: '24H', label: 'Fast Delivery' },
            {
              icon: <Star size={20} />,
              value: '4.9',
              label: 'Customer Rating',
            },
            { icon: <Gift size={20} />, value: '100%', label: 'Satisfaction' },
          ].map((s, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {s.icon}
                  <Typography variant="h5">{s.value}</Typography>
                </Box>
                <Typography variant="body2">{s.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
