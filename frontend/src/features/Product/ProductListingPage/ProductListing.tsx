import * as React from 'react';
import Grid from '@mui/material/Grid'; // Grid v2
import { Stack } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { ProductList } from '../../../services/interfaces/productInterfaces';
import ProductGrid from './ProductGrid';
import { ProductView } from './ProductCard';
import { SortingControls, ViewMode, SortOption } from './SortingControls';
import ResultPageFooter from '../../../components/ResultPageFooter';
import { mapProductListToViews } from '../productMappers';
import { useProductQueryParams } from '../../../hooks/useProductQueryParams';
import { FilterSidebar } from './FilterSidebar';

const MAX_PRICE = 2500;

export default function ProductListing() {
  const { data } = useLoaderData() as { data: ProductList };

  const products: ProductView[] = React.useMemo(
    () => mapProductListToViews(data),
    [data],
  );

  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  const { page, size, sort, filters, setPage, setSize, setSort, setFilters } =
    useProductQueryParams({ priceMax: MAX_PRICE, size: 4, sort: 'relevance' });

  return (
    <Grid container spacing={3} sx={{ width: '86%', minHeight: '100vh', p: 2 }}>
      <Grid size={{ xs: 12, md: 3 }}>
        <FilterSidebar
          filters={filters}
          onFiltersChange={(f) => setFilters(f, { replace: true })}
          maxPrice={MAX_PRICE}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 9 }}>
        <Stack alignItems="center" justifyContent="space-between" width="100%">
          <SortingControls
            sortBy={sort as SortOption}
            onSortChange={(s) => setSort(s)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={data.meta.total}
          />

          {viewMode === 'grid' ? (
            <ProductGrid products={products} columns={4} spacing={2} mt={2} />
          ) : (
            <ProductGrid products={products} columns={1} spacing={2} mt={2} />
          )}

          <ResultPageFooter
            meta={data.meta}
            onPageChange={(zeroBased) => setPage(zeroBased)}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
