import { LoaderFunctionArgs } from 'react-router';
import { getProducts } from '../../services/ProductService';
import { parseSortParam } from '../Product/ProductListingPage/productsLoader';

// Homepage product show case load by createdAt
export async function loader() {
  const sort = parseSortParam('createdAt');

  const data = await getProducts({
    sort: sort ? [sort] : undefined,
  });
  console.log(data);
  return { data };
}
