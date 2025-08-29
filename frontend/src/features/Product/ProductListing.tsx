import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { FilterSidebar, FilterState } from './FilterSideBar';
import { Pagination, SelectChangeEvent, Stack, useTheme } from '@mui/material';
import { SortingControls, SortOption, ViewMode } from './SortingControls';
import ProductCard, { ProductView } from './ProductCard';
import ProductGrid from './ProductGrid';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { ProductListResponse } from '../../services/interfaces/productInterfaces';
import ResultPageFooter from './ResultPageFooter';
import { mapProductListToViews } from './productMappers';

type ParamPrimitive = string | number | boolean | null | undefined;
type ParamValue = ParamPrimitive | ParamPrimitive[];

export default function ProductListing() {
  const { data, q, page, size } = useLoaderData() as {
    data: ProductListResponse;
    q: string;
    page: number;
    size: number;
  };
  const products: ProductView[] = React.useMemo(
    () => mapProductListToViews(data),
    [data],
  );
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    brands: [],
    priceRange: [0, 2500],
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // function to navigate
  const updateParams = (
    patch: Record<string, ParamValue>,
    { replace = false }: { replace?: boolean } = {},
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      // Clear existing values so we can re-add (important for arrays)
      params.delete(key);

      if (value == null) return; // null/undefined → remove key
      if (Array.isArray(value)) {
        if (value.length === 0) return; // empty array → remove key
        for (const v of value) {
          if (v == null || v === '') continue;
          params.append(key, String(v));
        }
      } else {
        const v = String(value);
        if (v === '') return; // empty string → remove key
        params.set(key, v);
      }
    });

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace },
    );
  };

  // 1) Page change (MUI is 1-based; server is 0-based)
  const handlePageChange = (_: React.ChangeEvent<unknown>, uiPage: number) => {
    updateParams({ page: uiPage - 1 });
  };
  const handleSizeChange = (e: SelectChangeEvent<number>) => {
    const newSize = Number(e.target.value);
    updateParams({ size: newSize, page: 0 });
  };
  // 2) Sort + Filter
  const handleFiltersChange = (f: FilterState) => {
    updateParams({
      page: 0,
      categories: f.categories, // array → ?categories=A&categories=B
      locations: f.locations, // array
      brands: f.brands, // array
      priceMin: f.priceRange[0],
      priceMax: f.priceRange[1],
    });
  };
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    updateParams({ sort: newSort, page: 0 });
  };

  const toggleLike = (productId: string) => {
    // In a real app, this would update the backend
    console.log('Toggled like for product:', productId);
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: '100%',
        minHeight: '100vh', // full height
        p: 2, // theme-based padding (2 * 8px = 16px)
      }}
    >
      <Grid size={3}>
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Grid>
      <Grid size={9}>
        <Stack alignItems="center" justifyContent="space-between" width="100%">
          <SortingControls
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={data.meta.total}
          />
          {viewMode === 'grid' ? (
            <ProductGrid
              products={products}
              toggleLike={toggleLike}
              columns={4}
              spacing={2}
              mt={2}
            />
          ) : (
            <ProductGrid
              products={products}
              toggleLike={toggleLike}
              columns={1}
              spacing={2}
              mt={2}
            />
          )}
          {/* Pagination */}
          <ResultPageFooter
            meta={data.meta}
            onPageChange={(zeroBased) => {
              // e.g. update URL to trigger your loader:
              updateParams({ page: zeroBased });
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
