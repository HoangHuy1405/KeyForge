import * as React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { Form, useSearchParams } from 'react-router-dom';

const ProductSearchBar: React.FC = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');

  // keep current size from URL (default 10)
  // const sizeFromUrl = searchParams.get('size') ?? '10';

  // if URL changes elsewhere, keep input in sync
  React.useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* GET form -> updates URL -> route loader can read ?q= */}
      <Box
        component={Form}
        method="get"
        action="/products"
        role="search"
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 12,
          px: 1,
          // use your input background token
          bgcolor: (t) =>
            (t.palette as any).input_background ?? t.palette.background.paper,
          // subtle border using divider
          border: `1px solid ${theme.palette.divider}`,
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: theme.palette.text.secondary,
          },
          '&:focus-within': {
            // visible, accessible focus ring
            boxShadow: `0 0 0 3px ${theme.palette.action.focus}`,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {/* reset page on new search; preserve size */}
        <input type="hidden" name="page" value="0" />
        {/* <input type="hidden" name="size" value={sizeFromUrl} /> */}

        <InputBase
          placeholder="Search for products, brands, or seller"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{
            name: 'q',
            'aria-label': 'search products',
            type: 'search',
            autoComplete: 'off',
          }}
          sx={{
            flex: 1,
            fontSize: theme.typography.body2.fontSize,
            px: 1.5,
            '& input': { py: 1.25 },
            color: 'text.primary',
          }}
        />

        <IconButton
          type="submit"
          aria-label="search"
          size="small"
          sx={{
            color: 'primary.main',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <SearchIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProductSearchBar;
