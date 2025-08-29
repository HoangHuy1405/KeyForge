import * as React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard, { ProductView } from './ProductCard';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// How many columns you want at each breakpoint, e.g. { xs: 1, sm: 2, md: 4 }
type GridColumns = number | Partial<Record<Breakpoint, number>>;

type ProductGridProps = {
  products: ProductView[];
  toggleLike: (productId: ProductView['id']) => void; // adjust if your ProductCard expects a different handler shape
  columns?: GridColumns; // default 4
  spacing?: number; // default 2
  mt?: number; // default 2
};

const clamp12 = (n: number) => Math.max(1, Math.min(12, n));

const computeSize = (
  columns: GridColumns,
): number | Partial<Record<Breakpoint, number>> => {
  if (typeof columns === 'number') {
    return clamp12(Math.floor(12 / columns));
  }
  const out: Partial<Record<Breakpoint, number>> = {};
  (['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[]).forEach((bp) => {
    const cols = columns[bp];
    if (cols && cols > 0) out[bp] = clamp12(Math.floor(12 / cols));
  });
  return out;
};

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  toggleLike,
  columns = 4,
  spacing = 2,
  mt = 2,
}) => {
  const itemSize = React.useMemo(() => computeSize(columns), [columns]);

  return (
    <Grid container spacing={spacing} mt={mt}>
      {products.map((product) => (
        <Grid key={product.id} size={itemSize}>
          <ProductCard product={product} onToggleLike={toggleLike} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
