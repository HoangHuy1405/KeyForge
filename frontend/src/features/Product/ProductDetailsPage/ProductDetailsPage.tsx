import { Grid, Stack } from '@mui/material';
import ImageGallery from './ImageGallery';
import { ProductDetailsView } from '../../../services/interfaces/productInterfaces';
import ProductMainInfo from './ProductMainInfo';
import SellerInfo from './SellerInfo';
import ProductSpecification from './ProductSpecification';
import ShippingDetails from './ShippingDetails';
import { useLoaderData } from 'react-router';

const mockProduct: ProductDetailsView = {
  id: '1',
  name: 'Premium Wireless Headphones',
  description:
    'High-quality wireless headphones with active noise cancellation, premium sound drivers, and long-lasting battery life. Perfect for music lovers, professionals, and travelers.',
  category: 'ELECTRONICS',
  status: 'ACTIVE',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NTY3MTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  images: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBibGFja3xlbnwxfHx8fDE3NTY3MTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sortOrder: 1,
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1737885197886-9e34a03ad226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaGVhZHBob25lcyUyMHN0dWRpb3xlbnwxfHx8fDE3NTY3MDU4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sortOrder: 2,
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1612478120679-5b7412e15f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub2lzZSUyMGNhbmNlbGxpbmclMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1NjcxMDkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sortOrder: 3,
    },
  ],
  details: {
    brand: 'SoundMax',
    model: 'Pro X1',
    size: 'none',
    material: 'Premium Aluminum & Leather',
    origin: 'Germany',
    condition: 'NEW',
  },
  inventory: {
    price: 299.99,
    availableQuantity: 42,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
  },
  logistics: {
    weightGrams: 350,
    lengthCm: 20,
    widthCm: 18,
    heightCm: 8,
    location: 'New York Warehouse',
    preOrder: false,
    shipping: {
      fast: true,
      regular: true,
      economy: true,
    },
  },
  seller: {
    id: '12345',
    username: 'techstore_pro',
    email: 'contact@techstorepro.com',
    phoneNum: '+1 (555) 123-4567',
    avatarUrl:
      'https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTY4MDczMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    // rating: 4.8,
    // totalSales: 1250,
    // responseTime: '< 1 hour',
    // memberSince: '2019',
  },
};

export default function ProductDetailsPage() {
  const product = useLoaderData() as ProductDetailsView;
  return (
    <Stack direction="column" gap={2}>
      {/* Main section (images + details) */}
      <Grid container spacing={3} sx={{ width: '100%', p: 4 }}>
        <Grid size={5}>
          <ImageGallery product={product} />
        </Grid>
        <Grid size={7}>
          <ProductMainInfo product={product} />
        </Grid>
      </Grid>
      {/* Seller info */}
      <SellerInfo seller={product.seller} />
      {/* Product Specification */}
      <ProductSpecification
        details={product.details}
        logistics={product.logistics}
      />
      {/* Shipping details */}
      <ShippingDetails logistics={product.logistics} />
    </Stack>
  );
}
