import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  Paper,
  Slider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

declare module '@mui/material/styles' {
  interface Palette {
    input_background: string;
  }
  interface PaletteOptions {
    input_background?: string;
  }
}

export interface FilterState {
  categories: string[];
  locations: string[];
  brands: string[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

// Get unique values for filters
const availableCategories = [
  // Fashion
  'FASHION',
  'JEWELRY',
  'WATCHES',

  // Electronics
  'ELECTRONICS',
  'PHONES',
  'LAPTOPS',
  'TABLETS',
  'CAMERAS',
  'ACCESSORIES',

  // Home
  'FURNITURE',
  'HOME_APPLIANCES',
  'KITCHEN',
  'DECOR',

  // Beauty & Health
  'BEAUTY',
  'COSMETICS',
  'SKINCARE',
  'HAIRCARE',
  'SUPPLEMENTS',

  // Others
  'BOOKS',
  'TOYS',
  'SPORTS',
  'AUTOMOTIVE',
  'PET',

  // Food
  'FOOD',
];

const availableLocations = [
  'USA',
  'CANADA',
  'UK',
  'EUROPE',
  'ASIA',
  'AUSTRALIA',
  'MIDDLE_EAST',
  'AFRICA',
];

const availableBrands = [
  'APPLE',
  'SAMSUNG',
  'SONY',
  'NIKE',
  'ADIDAS',
  'GUCCI',
  'ROLEX',
  'TESLA',
  'HONDA',
  'TOYOTA',
  'IKEA',
  'LG',
  'DELL',
  'HP',
  'CANON',
];

const maxPrice = 2000;

export function FilterSidebar({
  filters,
  onFiltersChange,
}: FilterSidebarProps) {
  const theme = useTheme();

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (
    key: 'categories' | 'locations' | 'brands',
    value: string,
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      locations: [],
      brands: [],
      priceRange: [0, maxPrice],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.locations.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 4, // ~ rounded-2xl
        background: theme.palette.primary.main,
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Filters
        </Typography>
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            onClick={clearAllFilters}
            sx={{ textTransform: 'none' }}
          >
            Clear all
          </Button>
        )}
      </Stack>

      <Stack spacing={3} mt={3}>
        {/* Price Range */}
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Price Range
          </Typography>

          <Box px={1}>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) =>
                updateFilter('priceRange', value as [number, number])
              }
              valueLabelDisplay="off"
              min={0}
              max={maxPrice}
              step={10}
              aria-label="Price range"
              sx={{
                color: '#5f5f5f', // thumb + track color
              }}
            />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ color: 'text.secondary', fontSize: 14 }}
          >
            <span>${filters.priceRange[0].toLocaleString()}</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </Stack>
        </Box>

        <Divider />

        {/* Categories */}
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Categories
          </Typography>
          <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
            <Stack>
              {availableCategories.map((category) => {
                const checked = filters.categories.includes(category);
                const id = `category-${category}`;
                return (
                  <Stack
                    key={category}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onChange={() => toggleArrayFilter('categories', category)}
                      size="small"
                      sx={{
                        // base styles for the unchecked box
                        '& .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                        },
                        // when checked
                        '&.Mui-checked .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                          color: '#3a3a3a', // check mark color (so it stays visible!)
                        },
                      }}
                    />
                    <Typography
                      htmlFor={id}
                      component="label"
                      sx={{ cursor: 'pointer', flex: 1, fontSize: 14 }}
                    >
                      {category}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Box>

        {/* Locations */}
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Ship From
          </Typography>
          <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
            <Stack>
              {availableLocations.map((location) => {
                const checked = filters.locations.includes(location);
                const id = `location-${location}`;
                return (
                  <Stack
                    key={location}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onChange={() => toggleArrayFilter('locations', location)}
                      size="small"
                      sx={{
                        // base styles for the unchecked box
                        '& .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                        },
                        // when checked
                        '&.Mui-checked .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                          color: '#3a3a3a', // check mark color (so it stays visible!)
                        },
                      }}
                    />
                    <Typography
                      htmlFor={id}
                      component="label"
                      sx={{ cursor: 'pointer', flex: 1, fontSize: 14 }}
                    >
                      {location}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Box>

        {/* Brands */}
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Brands
          </Typography>
          <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
            <Stack>
              {availableBrands.map((brand) => {
                const checked = filters.brands.includes(brand);
                const id = `brand-${brand}`;
                return (
                  <Stack
                    key={brand}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onChange={() => toggleArrayFilter('brands', brand)}
                      size="small"
                      sx={{
                        // base styles for the unchecked box
                        '& .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                        },
                        // when checked
                        '&.Mui-checked .MuiSvgIcon-root': {
                          borderRadius: 1,
                          backgroundColor: theme.palette.input_background,
                          color: '#3a3a3a', // check mark color (so it stays visible!)
                        },
                      }}
                    />
                    <Typography
                      htmlFor={id}
                      component="label"
                      sx={{ cursor: 'pointer', flex: 1, fontSize: 14 }}
                    >
                      {brand}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Box>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Active Filters
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {/* Categories */}
              {filters.categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  variant="outlined"
                  onDelete={() => toggleArrayFilter('categories', category)}
                  deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: 12 }}
                />
              ))}
              {/* Locations */}
              {filters.locations.map((location) => (
                <Chip
                  key={location}
                  label={location}
                  size="small"
                  variant="outlined"
                  onDelete={() => toggleArrayFilter('locations', location)}
                  deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: 12 }}
                />
              ))}
              {/* Brands */}
              {filters.brands.map((brand) => (
                <Chip
                  key={brand}
                  label={brand}
                  size="small"
                  variant="outlined"
                  onDelete={() => toggleArrayFilter('brands', brand)}
                  deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontSize: 12 }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
