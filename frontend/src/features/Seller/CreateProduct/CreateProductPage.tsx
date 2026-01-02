/**
 * Create Product Page - 4-Step Wizard
 * Clean, professional UI for product creation
 */
import { useState, useCallback, lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { alpha, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';

import {
  useCreateProduct,
  useUploadThumbnail,
  useUploadGallery,
  useUpdateInventory,
  useUpdateLogistics,
} from '../../../hooks/mutation/useProductMutations';

import type {
  CreateProductRequest,
  UpdateInventoryRequest,
  UpdateLogisticsRequest,
  ProductCategory,
  ProductCondition,
  StockStatus,
} from '../../../services/interfaces/productTypes';

// Lazy load step components for better initial load performance
const BasicInfoStep = lazy(() => import('./steps/BasicInfoStep'));
const MediaUploadStep = lazy(() => import('./steps/MediaUploadStep'));
const InventoryStep = lazy(() => import('./steps/InventoryStep'));
const ShippingStep = lazy(() => import('./steps/ShippingStep'));

// Loading fallback component
const StepLoading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
    <CircularProgress />
  </Box>
);

// Simple step icon with number
const CustomStepIcon = memo(function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  const { active, completed, icon } = props;
  const theme = useTheme();

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

// ===== TYPES =====
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

const initialFormData: FormData = {
  name: '',
  description: '',
  category: '',
  productCondition: '',
  stockStatus: '',
  attributes: {},
  thumbnail: null,
  gallery: [],
  price: '',
  stockQuantity: '',
  minOrderQuantity: '1',
  maxOrderQuantity: '',
  location: '',
  supportFastShipping: false,
  supportRegularShipping: true,
  supportEconomyShipping: false,
};

const steps = [
  { label: 'Basic Info', description: 'Product details' },
  { label: 'Media', description: 'Images & gallery' },
  { label: 'Inventory', description: 'Pricing & stock' },
  { label: 'Shipping', description: 'Delivery options' },
];

// ===== MAIN COMPONENT =====
export default function CreateProductPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [productId, setProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations
  const createProductMutation = useCreateProduct();
  const uploadThumbnailMutation = useUploadThumbnail();
  const uploadGalleryMutation = useUploadGallery();
  const updateInventoryMutation = useUpdateInventory();
  const updateLogisticsMutation = useUpdateLogistics();

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleBack = () => {
    if (activeStep === 0) {
      if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
        navigate('/seller/inventory');
      }
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      switch (activeStep) {
        case 0: {
          // Create product
          const payload: CreateProductRequest = {
            name: formData.name,
            description: formData.description || undefined,
            category: formData.category as ProductCategory,
            productCondition: formData.productCondition as ProductCondition,
            stockStatus: formData.stockStatus as StockStatus,
            attributes: formData.attributes,
          };
          const result = await createProductMutation.mutateAsync(payload);
          setProductId(result.id);
          toast.success('Product created successfully!');
          break;
        }
        case 1: {
          // Upload images
          if (!productId) throw new Error('Product ID not found');
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
          toast.success('Images uploaded successfully!');
          break;
        }
        case 2: {
          // Update inventory
          if (!productId) throw new Error('Product ID not found');
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
          await updateInventoryMutation.mutateAsync({
            productId,
            data: inventoryPayload,
          });
          toast.success('Inventory updated successfully!');
          break;
        }
        case 3: {
          // Update logistics
          if (!productId) throw new Error('Product ID not found');
          const logisticsPayload: UpdateLogisticsRequest = {
            location: formData.location || undefined,
            supportFastShipping: formData.supportFastShipping,
            supportRegularShipping: formData.supportRegularShipping,
            supportEconomyShipping: formData.supportEconomyShipping,
          };
          await updateLogisticsMutation.mutateAsync({
            productId,
            data: logisticsPayload,
          });
          toast.success('Product created and activated!');
          navigate('/seller/inventory');
          return;
        }
      }
      setActiveStep((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (activeStep) {
      case 0:
        return !!(
          formData.name.trim() &&
          formData.category &&
          formData.productCondition &&
          formData.stockStatus
        );
      case 1:
        return true; // Images are optional
      case 2:
        return !!(formData.price && formData.stockQuantity);
      case 3:
        return true; // Shipping options have defaults
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton onClick={handleBack} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Create New Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new mechanical keyboard product to your store
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
          {activeStep === 1 && <MediaUploadStep data={formData} onChange={updateFormData} />}
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
              ? 'Processing...'
              : activeStep === steps.length - 1
                ? 'Complete'
                : 'Continue'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
