import { Box, Card, CardContent, Chip } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import {
  Logistic,
  ProductDetails,
} from '../../../services/interfaces/productInterfaces';

type ProductSpecificationProps = {
  details: ProductDetails;
  logistics: Logistic;
};

export default function ProductSpecification({
  details,
  logistics,
}: ProductSpecificationProps) {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundImage:
          'linear-gradient(to bottom right, #eff6ff, #ffffff, #f5f3ff)',
        borderRadius: '12px',
        border: '1px solid #75757536',
      }}
    >
      <Box className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <h2 className="flex items-center gap-2">
          <InfoOutlinedIcon className="h-5 w-5 text-blue-600" />
          Technical Specifications
        </h2>
      </Box>
      <CardContent className="mt-4">
        <div className="grid grid-cols-1 gap-12 p-4 lg:grid-cols-2">
          {/* Product Details */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h4 className="mb-4 flex items-center gap-2 text-slate-700">
                <Inventory2OutlinedIcon className="h-4 w-4" />
                Product Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-[#f3f3f5] px-4 py-3">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{details.brand}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#f3f3f5] px-4 py-3">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{details.model}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#f3f3f5] px-4 py-3">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">{details.material}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#f3f3f5] px-4 py-3">
                  <span className="text-muted-foreground">Condition</span>
                  <Chip label={details.condition} variant="outlined" />
                </div>
              </div>
            </div>
          </div>

          {/* Physical Specifications */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h4 className="mb-4 flex items-center gap-2 text-slate-700">
                <PublicOutlinedIcon className="h-4 w-4" />
                Physical Specifications
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{logistics.weightGrams}g</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">
                    {logistics.lengthCm} × {logistics.widthCm} ×{' '}
                    {logistics.heightCm} cm
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <span className="text-muted-foreground">Origin</span>
                  <span className="font-medium">{details.origin}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <span className="text-muted-foreground">Ships From</span>
                  <span className="font-medium">{logistics.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
