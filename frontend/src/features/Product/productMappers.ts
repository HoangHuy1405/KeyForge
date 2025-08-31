import { CartItemData } from '../../redux/slice/cartSlice';
import {
  ProductList,
  Product,
} from '../../services/interfaces/productInterfaces';
import { ProductView } from './ProductCard';

/** Map a single API product into the UI-friendly ProductView shape */
export function mapProductToView(p: Product): ProductView {
  return {
    id: p.id,
    name: p.name,
    price: p.inventory?.price ?? 0,
    // If you have promo price, put it here; otherwise leave undefined
    originalPrice: undefined,

    // Your API doesn't include ratings/reviews; default to 0 for now
    rating: 0,
    reviewCount: 0,

    image: p.thumbnailUrl || '',
    // No seller field in the API; using brand as a reasonable placeholder
    seller: p.details?.brand || 'Unknown',

    location: p.logistic?.location || '',
    category: String(p.category ?? ''),
    brand: p.details?.brand || '',

    // Local UI-only flags/derived fields
    isLiked: false,
    sales: 0, // API doesn't expose sales; default to 0

    // If backend has createdAt/updatedAt, prefer those. For now, set ISO “now”
    dateAdded: new Date().toISOString(),
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
