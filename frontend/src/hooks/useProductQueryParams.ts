// hooks/useProductQueryParams.ts
import { useMemo } from 'react';
import { useUrlParams } from './useUrlParams';
import { SortOption } from '../features/Product/SortingControls';
import { FilterState } from '../features/Product/FilterSidebar';

const toNum = (v: string | null, fallback: number) => {
  if (v == null) return fallback;
  const s = v.trim();
  if (s === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

type Defaults = {
  priceMin?: number;
  priceMax?: number;
  size?: number;
  sort?: SortOption;
};

export function useProductQueryParams(defaults: Defaults = {}) {
  const PRICE_MIN_DEFAULT = defaults.priceMin ?? 0;
  const PRICE_MAX_DEFAULT = defaults.priceMax ?? 2500;
  const SIZE_DEFAULT = defaults.size ?? 12;
  const SORT_DEFAULT: SortOption = defaults.sort ?? 'relevance';

  const { searchParams, setParams } = useUrlParams();

  // READ
  const page = toNum(searchParams.get('page'), 0);
  const size = toNum(searchParams.get('size'), SIZE_DEFAULT);
  const sort = (searchParams.get('sort') as SortOption) ?? SORT_DEFAULT;

  const filters: FilterState = useMemo(() => {
    const categories = searchParams.getAll('categories').filter(Boolean);
    const locations = searchParams.getAll('locations').filter(Boolean);
    const brands = searchParams.getAll('brands').filter(Boolean);
    const priceMin = toNum(searchParams.get('priceMin'), PRICE_MIN_DEFAULT);
    const priceMax = toNum(searchParams.get('priceMax'), PRICE_MAX_DEFAULT);
    return { categories, locations, brands, priceRange: [priceMin, priceMax] };
  }, [searchParams, PRICE_MIN_DEFAULT, PRICE_MAX_DEFAULT]);

  // WRITE (convenience setters)
  const setPage = (p: number, opt?: { replace?: boolean }) =>
    setParams({ page: p }, opt);

  const setSize = (s: number, opt?: { replace?: boolean }) =>
    setParams({ size: s, page: 0 }, opt);

  const setSort = (s: SortOption, opt?: { replace?: boolean }) =>
    setParams({ sort: s, page: 0 }, opt);

  const setFilters = (f: FilterState, opt?: { replace?: boolean }) =>
    setParams(
      {
        page: 0,
        categories: f.categories,
        locations: f.locations,
        brands: f.brands,
        priceMin: f.priceRange[0],
        priceMax: f.priceRange[1],
      },
      opt,
    );

  const resetFilters = (opt?: { replace?: boolean }) =>
    setParams(
      {
        page: 0,
        categories: [],
        locations: [],
        brands: [],
        priceMin: PRICE_MIN_DEFAULT,
        priceMax: PRICE_MAX_DEFAULT,
      },
      opt,
    );

  return {
    // read
    page,
    size,
    sort,
    filters,
    // write
    setPage,
    setSize,
    setSort,
    setFilters,
    resetFilters,
    // low-level if needed
    setParams,
    searchParams,
  };
}
