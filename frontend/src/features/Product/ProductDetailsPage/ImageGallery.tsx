import { Box, Stack } from '@mui/material';
import { ImageWithFallback } from '../../../components/ImageWithFallBack';
import { ProductDetailsView } from '../../../services/interfaces/productInterfaces';
import { useState } from 'react';

const ImageGallery: React.FC<{
  product: ProductDetailsView;
}> = ({ product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Stack spacing={2}>
      {/* Main image */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '1 / 1',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <ImageWithFallback
          src={product.images[selectedIndex]?.url || product.thumbnailUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </Box>

      {/* Thumbnails */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
        {product.images.map((img, idx) => (
          <Box
            key={img.id}
            component="button"
            onClick={() => setSelectedIndex(idx)}
            aria-label={`View ${idx + 1}`}
            style={{ all: 'unset', cursor: 'pointer' }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: 'hidden',
                border: 2,
                borderColor: selectedIndex === idx ? '#5f5f5f' : 'divider',
                transition: (theme) =>
                  theme.transitions.create(['border-color'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                flexShrink: 0,
              }}
            >
              <ImageWithFallback
                src={img.url}
                alt={`${product.name} - View ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default ImageGallery;
