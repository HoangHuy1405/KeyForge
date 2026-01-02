import { CartItemData } from '../../redux/slice/cartSlice';
import { ProductFavorite } from '../../redux/slice/favoriteSlice';
import {
  ProductList,
  Product,
  ProductDetailsView,
} from '../../services/interfaces/productInterfaces';
import { ProductView } from './ProductListingPage/ProductCard';

/** Map a single API product into the UI-friendly ProductView shape */
export function mapProductToView(p: Product): ProductView {
  const attributes = p.attributes || {};
  
  return {
    id: p.id,
    name: p.name,
    price: p.price ?? 0,
    originalPrice: undefined,
    rating: 0,
    reviewCount: 0,
    image: p.thumbnailUrl || '',
    location: p.location || '',
    category: String(p.category ?? ''),
    brand: (attributes.brand as string) || '',
    sales: 0,
    dateAdded: p.createdAt || new Date().toISOString(),
  };
}

/** Map a full list response to just the ProductView[] */
export function mapProductListToViews(res: ProductList): ProductView[] {
  return (res.result ?? []).map(mapProductToView);
}

export function mapFromProductViewToCartItem(
  product: ProductView,
  quantity: number = 1,
  selected: boolean = false,
): CartItemData {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    unitPrice: product.price,
    quantity,
    totalPrice: product.price * quantity,
    selected,
  };
}

export function mapFromProductViewToProductFavorite(
  product: ProductView,
): ProductFavorite {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    unitPrice: product.price,
  };
}

export function mapFromDetailsViewToFavorite(
  product: ProductDetailsView,
): ProductFavorite {
  return {
    id: product.id,
    name: product.name,
    image: product.thumbnailUrl || '',
    unitPrice: product.inventory?.price ?? 0,
  };
}

export function mapFromCartItemToProductFavorite(
  item: CartItemData,
): ProductFavorite {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    unitPrice: item.unitPrice,
  };
}

export function mapDetailsToView(p: ProductDetailsView): ProductView {
  const attributes = p.attributes || {};
  
  return {
    id: p.id,
    name: p.name,
    price: p.inventory?.price ?? 0,
    originalPrice: undefined,
    rating: 0,
    reviewCount: 0,
    image: p.thumbnailUrl || '',
    location: p.logistics?.location || '',
    category: String(p.category ?? ''),
    brand: (attributes.brand as string) || '',
    sales: 0,
    dateAdded: new Date().toISOString(),
  };
}
