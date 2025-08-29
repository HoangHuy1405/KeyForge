import { type LoaderFunctionArgs } from 'react-router-dom';
import { Sort } from '../../services/interfaces/paramsType';
import { getProducts } from '../../services/ProductService';
const DEFAULT_SORT: Sort = { field: 'name', direction: 'asc' };

// accept "field-asc" or "field,asc"
function parseSortParam(value: string | null): Sort {
  if (!value) return DEFAULT_SORT;
  const m = value.trim().match(/^(.+?)[-,](asc|desc)$/i);
  if (!m) return DEFAULT_SORT;
  return {
    field: m[1].trim(),
    direction: m[2].toLowerCase() as Sort['direction'],
  };
}

const esc = (s: string) => s.replace(/'/g, "''");
const arrToList = (arr: string[]) =>
  `[${arr.map((v) => `'${esc(v)}'`).join(', ')}]`;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;

  const q = sp.get('q')?.trim() ?? '';
  const page = Number(sp.get('page') ?? 0);
  const size = Number(sp.get('size') ?? 4);
  const sort = parseSortParam(sp.get('sort'));

  // multi-value filters come in as repeated keys: ?categories=A&categories=B
  const categories = sp.getAll('categories').filter(Boolean);
  const locations = sp.getAll('locations').filter(Boolean);
  const brands = sp.getAll('brands').filter(Boolean);
  const priceMin = sp.get('priceMin');
  const priceMax = sp.get('priceMax');

  const parts: string[] = [];

  if (q) parts.push(`name ~~ '*${esc(q)}*'`); // case-insensitive contains
  if (categories.length) parts.push(`category in ${arrToList(categories)}`);
  // adjust field path if your entity uses a different one
  if (locations.length)
    parts.push(`logistic.location in ${arrToList(locations)}`);
  if (brands.length) parts.push(`details.brand in ${arrToList(brands)}`);

  if (priceMin && Number.isFinite(Number(priceMin)))
    parts.push(`inventory.price >: ${Number(priceMin)}`);
  if (priceMax && Number.isFinite(Number(priceMax)))
    parts.push(`inventory.price <: ${Number(priceMax)}`);

  const filters = parts.length ? parts.join(' and ') : undefined;

  try {
    const data = await getProducts({
      page,
      size,
      sort: [sort],
      filters,
    });
    return { data, q, page, size, sort };
  } catch (err: any) {
    throw new Error(err.message);
  }
}
