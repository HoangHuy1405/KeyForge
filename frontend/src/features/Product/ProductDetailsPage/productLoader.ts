import { LoaderFunctionArgs } from 'react-router';
import { getProduct } from '../../../services/ProductService';

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 });
  }
  const product = await getProduct(params.id);
  console.log(product);
  return product;
}
