import { Box, Typography, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

interface CategoryCardProps {
  image: string;
  title: string;
  description?: string;
  link: string;
}

const CardContainer = styled(RouterLink)(({ theme }) => ({
  display: 'block',
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: 'hidden',
  aspectRatio: '4 / 3',
  textDecoration: 'none',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
  '&:hover .category-image': {
    transform: 'scale(1.1)',
  },
  '&:hover .category-overlay': {
    background: `linear-gradient(
      to top,
      ${alpha('#000', 0.7)} 0%,
      ${alpha('#000', 0.4)} 50%,
      ${alpha('#000', 0.1)} 100%
    )`,
  },
  '&:hover .category-content': {
    transform: 'translateY(-8px)',
  },
}));

const CardImage = styled('img')({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

/**
 * Individual category card with hover effects
 * Features image zoom, overlay transition, and content lift on hover
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  image,
  title,
  description,
  link,
}) => {
  const theme = useTheme();

  return (
    <CardContainer to={link}>
      {/* Background Image */}
      <CardImage
        className="category-image"
        src={image}
        alt={title}
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <Box
        className="category-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to top,
            ${alpha('#000', 0.6)} 0%,
            ${alpha('#000', 0.3)} 40%,
            transparent 100%
          )`,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Content */}
      <Box
        className="category-content"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2.5, md: 3 },
          transition: 'transform 0.3s ease',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 700,
            mb: description ? 0.5 : 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </Typography>
        
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: alpha('#fff', 0.85),
              fontWeight: 400,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Explore indicator */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1.5,
            px: 2,
            py: 0.75,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.primary.main, 0.9),
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
        >
          Explore
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              transition: 'transform 0.3s ease',
              '.MuiBox-root:hover &': {
                transform: 'translateX(4px)',
              },
            }}
          >
            →
          </Box>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default CategoryCard;
