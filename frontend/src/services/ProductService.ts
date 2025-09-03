import api from './api';
import { GetListParams } from './interfaces/paramsType';
import {
  ProductDetailsView,
  ProductList,
} from './interfaces/productInterfaces';

const BASE = 'api/products';

export async function getProducts(params: GetListParams): Promise<ProductList> {
  const searchParams = new URLSearchParams();

  if (params.size !== undefined)
    searchParams.append('size', String(params.size));
  if (params.page !== undefined)
    searchParams.append('page', String(params.page));
  if (params.sort) {
    params.sort.forEach(({ field, direction }) => {
      searchParams.append('sort', `${field},${direction}`);
    });
  }
  if (params.filters) {
    searchParams.append('filter', params.filters);
  }
  console.log(searchParams.toString());
  const data = await api.get<ProductList, ProductList>(
    `${BASE}?${searchParams.toString()}`,
  );
  return data;
}

export async function getProduct(id: string): Promise<ProductDetailsView> {
  const data = await api.get<ProductDetailsView, ProductDetailsView>(
    `${BASE}/${id}`,
  );
  return data;
}
