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
import { PriceRangeFilter } from '../../components/Filters/PriceRangeFilter';
import CheckboxFilterSection from '../../components/Filters/CheckboxFilterSection';

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
  maxPrice: number;
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
  'HCM',
  'HANOI',
  'DN',
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
  maxPrice,
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
            sx={{ textTransform: 'none', color: 'text.primary' }}
          >
            Clear all
          </Button>
        )}
      </Stack>

      <Stack spacing={3} mt={3}>
        {/* Price Range */}
        <PriceRangeFilter
          filters={filters}
          onFiltersChange={(f) => onFiltersChange(f)} // calls updateParams(...) upstream
          maxPrice={maxPrice}
        />

        <Divider />

        {/* Categories */}
        <CheckboxFilterSection
          title="Categories"
          idPrefix="category"
          options={availableCategories}
          selected={filters.categories}
          onToggle={(v) => toggleArrayFilter('categories', v)}
        />
        {/* Locations */}
        <CheckboxFilterSection
          title="Ship From"
          idPrefix="location"
          options={availableLocations}
          selected={filters.locations}
          onToggle={(v) => toggleArrayFilter('locations', v)}
        />
        {/* Brands */}
        <CheckboxFilterSection
          title="Brands"
          idPrefix="brand"
          options={availableBrands}
          selected={filters.brands}
          onToggle={(v) => toggleArrayFilter('brands', v)}
        />

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
