/**
 * Edit Product Page
 * Reuses CreateProduct step components with pre-populated data
 */
import { useState, useCallback, lazy, Suspense, memo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';

import {
  useUploadThumbnail,
  useUploadGallery,
  useUpdateInventory,
  useUpdateLogistics,
} from '../../../hooks/mutation/useProductMutations';

import {
  useDeleteThumbnail,
  useDeleteGalleryImage,
} from '../../../hooks/mutation/useDeleteProductMedia';

import { updateProduct } from '../../../services/ProductService';
import { useSellerProduct } from '../../../hooks/query/useSellerProduct';

import type {
  UpdateInventoryRequest,
  UpdateLogisticsRequest,
  ProductCategory,
  ProductCondition,
  StockStatus,
  ProductFullResponse,
  UpdateProductRequest,
} from '../../../services/interfaces/productTypes';

// Lazy load step components (reuse from CreateProduct)
const BasicInfoStep = lazy(() => import('../CreateProduct/steps/BasicInfoStep'));
const MediaUploadStep = lazy(() => import('../CreateProduct/steps/MediaUploadStep'));
const InventoryStep = lazy(() => import('../CreateProduct/steps/InventoryStep'));
const ShippingStep = lazy(() => import('../CreateProduct/steps/ShippingStep'));

// Loading fallback
const StepLoading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
    <CircularProgress />
  </Box>
);

// Simple step icon
const CustomStepIcon = memo(function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  const { active, completed, icon } = props;

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: completed || active ? 'primary.main' : 'grey.300',
        color: completed || active ? 'white' : 'grey.600',
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : icon}
    </Box>
  );
});

interface FormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  category: ProductCategory | '';
  productCondition: ProductCondition | '';
  stockStatus: StockStatus | '';
  attributes: Record<string, unknown>;
  // Step 2: Media
  thumbnail: File | null;
  gallery: File[];
  // Step 3: Inventory
  price: string;
  stockQuantity: string;
  minOrderQuantity: string;
  maxOrderQuantity: string;
  // Step 4: Shipping
  location: string;
  supportFastShipping: boolean;
  supportRegularShipping: boolean;
  supportEconomyShipping: boolean;
}

const steps = [
  { label: 'Basic Info' },
  { label: 'Media' },
  { label: 'Inventory' },
  { label: 'Shipping' },
];

export default function EditProductPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data using custom hook
  const {
    data: originalProduct,
    isLoading,
    isError,
  } = useSellerProduct(productId);

  // Initialize form data when product is loaded
  useEffect(() => {
    if (originalProduct && !formData) {
      setFormData({
        name: originalProduct.name || '',
        description: originalProduct.description || '',
        category: originalProduct.category || '',
        productCondition: '',
        stockStatus: originalProduct.stockStatus || '',
        attributes: originalProduct.attributes || {},
        thumbnail: null,
        gallery: [],
        price: originalProduct.inventory?.price || '',
        stockQuantity: String(originalProduct.inventory?.stockQuantity || ''),
        minOrderQuantity: String(originalProduct.inventory?.minOrderQuantity || '1'),
        maxOrderQuantity: String(originalProduct.inventory?.maxOrderQuantity || ''),
        location: originalProduct.logistics?.location || '',
        supportFastShipping: originalProduct.logistics?.shipping?.fast || false,
        supportRegularShipping: originalProduct.logistics?.shipping?.regular || true,
        supportEconomyShipping: originalProduct.logistics?.shipping?.economy || false,
      });
    }
  }, [originalProduct, formData]);

  // Handle error
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load product');
      navigate('/seller/inventory');
    }
  }, [isError, navigate]);

  // Mutations
  const uploadThumbnailMutation = useUploadThumbnail();
  const uploadGalleryMutation = useUploadGallery();
  const updateInventoryMutation = useUpdateInventory();
  const updateLogisticsMutation = useUpdateLogistics();
  const deleteThumbnailMutation = useDeleteThumbnail();
  const deleteGalleryImageMutation = useDeleteGalleryImage();

  // Delete handlers for MediaUploadStep
  const handleDeleteThumbnail = useCallback(async () => {
    if (!productId) return;
    await deleteThumbnailMutation.mutateAsync({ productId });
  }, [productId, deleteThumbnailMutation]);

  const handleDeleteGalleryImage = useCallback(async (imageId: string) => {
    if (!productId) return;
    await deleteGalleryImageMutation.mutateAsync({ productId, imageId });
  }, [productId, deleteGalleryImageMutation]);



  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => prev ? { ...prev, ...updates } : null);
  }, []);

  const handleBack = () => {
    if (activeStep === 0) {
      if (window.confirm('Are you sure you want to leave? Your changes will be lost.')) {
        navigate('/seller/inventory');
      }
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (!formData || !productId) return;
    
    setIsSubmitting(true);
    try {
      switch (activeStep) {
        case 0: {
          // Update basic info
          const payload: UpdateProductRequest = {
            name: formData.name,
            description: formData.description || undefined,
            category: formData.category as ProductCategory,
            stockStatus: formData.stockStatus as StockStatus,
            price: formData.price || '0',
            stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
            minOrderQuantity: formData.minOrderQuantity ? parseInt(formData.minOrderQuantity, 10) : undefined,
            maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity, 10) : undefined,
            attributes: formData.attributes,
            location: formData.location || undefined,
            supportFastShipping: formData.supportFastShipping,
            supportRegularShipping: formData.supportRegularShipping,
            supportEconomyShipping: formData.supportEconomyShipping,
          };
          await updateProduct(productId, payload);
          toast.success('Basic info updated!');
          break;
        }
        case 1: {
          // Upload images if new ones provided
          if (formData.thumbnail) {
            await uploadThumbnailMutation.mutateAsync({
              productId,
              file: formData.thumbnail,
            });
          }
          if (formData.gallery.length > 0) {
            await uploadGalleryMutation.mutateAsync({
              productId,
              files: formData.gallery,
            });
          }
          toast.success('Images updated!');
          break;
        }
        case 2: {
          // Update inventory
          const inventoryPayload: UpdateInventoryRequest = {
            price: formData.price,
            stockQuantity: parseInt(formData.stockQuantity, 10),
            minOrderQuantity: formData.minOrderQuantity
              ? parseInt(formData.minOrderQuantity, 10)
              : undefined,
            maxOrderQuantity: formData.maxOrderQuantity
              ? parseInt(formData.maxOrderQuantity, 10)
              : undefined,
          };
          await updateInventoryMutation.mutateAsync({ productId, data: inventoryPayload });
          toast.success('Inventory updated!');
          break;
        }
        case 3: {
          // Update logistics and finish
          const logisticsPayload: UpdateLogisticsRequest = {
            location: formData.location || undefined,
            supportFastShipping: formData.supportFastShipping,
            supportRegularShipping: formData.supportRegularShipping,
            supportEconomyShipping: formData.supportEconomyShipping,
          };
          await updateLogisticsMutation.mutateAsync({ productId, data: logisticsPayload });
          toast.success('Product updated successfully!');
          navigate('/seller/inventory');
          return;
        }
      }
      setActiveStep((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (!formData) return false;
    
    switch (activeStep) {
      case 0:
        return Boolean(formData.name && formData.category && formData.stockStatus);
      case 1:
        return true; // Media is optional for edits
      case 2:
        return Boolean(formData.price && formData.stockQuantity);
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (isLoading || !formData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate('/seller/inventory')}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Edit Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {originalProduct?.name}
          </Typography>
        </Box>
      </Stack>

      {/* Stepper */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                slots={{
                  stepIcon: CustomStepIcon,
                }}
                slotProps={{
                  stepIcon: { icon: index + 1 },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={activeStep === index ? 600 : 400}
                  color={activeStep >= index ? 'text.primary' : 'text.secondary'}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 1,
          minHeight: 400,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Suspense fallback={<StepLoading />}>
          {activeStep === 0 && <BasicInfoStep data={formData} onChange={updateFormData} />}
          {activeStep === 1 && (
            <MediaUploadStep
              data={formData}
              onChange={updateFormData}
              existingThumbnailUrl={originalProduct?.thumbnailUrl}
              existingImages={originalProduct?.images || []}
              productId={productId}
              onDeleteThumbnail={handleDeleteThumbnail}
              onDeleteImage={handleDeleteGalleryImage}
            />
          )}
          {activeStep === 2 && <InventoryStep data={formData} onChange={updateFormData} />}
          {activeStep === 3 && <ShippingStep data={formData} onChange={updateFormData} />}
        </Suspense>

        {/* Navigation Buttons */}
        <Stack direction="row" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ minWidth: 120, borderRadius: 1 }}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            sx={{ minWidth: 140, borderRadius: 1 }}
          >
            {isSubmitting
              ? 'Saving...'
              : activeStep === steps.length - 1
                ? 'Save Changes'
                : 'Continue'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
