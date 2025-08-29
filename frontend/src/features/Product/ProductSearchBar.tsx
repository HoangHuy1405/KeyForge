import * as React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { Form, useSearchParams } from 'react-router-dom';

const ProductSearchBar: React.FC = () => {
  const theme = useTheme();
  const [query, setQuery] = React.useState('');
  const [searchParams] = useSearchParams();

  // keep current size from URL (default 10)
  const sizeFromUrl = searchParams.get('size') ?? '10';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Form submits with GET -> updates URL -> loader fires before render */}
      <Box
        component={Form}
        method="get"
        action="/products" // ensure it targets the products route
        role="search"
        sx={{
          backgroundColor: theme.palette.secondary.main,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 12,
          px: 1,
          transition: 'all 0.2s ease',
          '&:focus-within': {
            outline: `2px solid #5f5f5f`,
            outlineOffset: 2,
          },
        }}
      >
        {/* reset page on new search; preserve size */}
        <input type="hidden" name="page" value="0" />
        <input type="hidden" name="size" value={sizeFromUrl} />

        <InputBase
          placeholder="Search for products, brands, or seller"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ name: 'q', 'aria-label': 'search products' }}
          sx={{
            flex: 1,
            fontSize: theme.typography.body2.fontSize,
            '& input': { py: 1.5 },
            px: 1.5,
          }}
        />

        <IconButton type="submit" aria-label="search" size="small">
          <SearchIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProductSearchBar;
