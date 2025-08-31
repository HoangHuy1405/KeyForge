// In FilterSidebar.tsx
import * as React from 'react';
import { Box, Slider, Stack, Typography } from '@mui/material';
import { FilterState } from '../../features/Product/FilterSidebar';

type Props = {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void; // parent will update the URL
  maxPrice: number;
};

export function PriceRangeFilter({
  filters,
  onFiltersChange,
  maxPrice,
}: Props) {
  // Local draft so the thumb moves smoothly without triggering fetches
  const [priceDraft, setPriceDraft] = React.useState<[number, number]>(
    filters.priceRange,
  );

  // Keep draft in sync if URL (filters) changes from outside (back/forward, reload, etc.)
  React.useEffect(() => {
    setPriceDraft(filters.priceRange);
  }, [filters.priceRange]);

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} mb={1}>
        Price Range
      </Typography>

      <Box px={1}>
        <Slider
          value={priceDraft}
          onChange={(_, value) => setPriceDraft(value as [number, number])}
          onChangeCommitted={(_, value) => {
            // Commit once the user finishes dragging → update URL in parent
            onFiltersChange({
              ...filters,
              priceRange: value as [number, number],
            });
          }}
          valueLabelDisplay="off"
          min={0}
          max={maxPrice}
          step={10}
          aria-label="Price range"
          sx={{ color: '#5f5f5f' }}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ color: 'text.secondary', fontSize: 14 }}
      >
        <span>${priceDraft[0].toLocaleString()}</span>
        <span>${priceDraft[1].toLocaleString()}</span>
      </Stack>
    </Box>
  );
}
