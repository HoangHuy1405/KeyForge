import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Logistic } from '../../../services/interfaces/productInterfaces';

type ProductSpecificationProps = {
  attributes?: Record<string, unknown> | null;
  logistics?: Logistic | null;
  stockStatus?: string;
};

export default function ProductSpecification({
  attributes,
  logistics,
  stockStatus,
}: ProductSpecificationProps) {
  // Safe defaults for logistics
  const location = logistics?.location || 'N/A';

  // Convert attributes to array of key-value pairs for display
  const attributeEntries = attributes
    ? Object.entries(attributes).filter(([, value]) => value !== null && value !== undefined)
    : [];

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
          {/* Product Attributes */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h4 className="mb-4 flex items-center gap-2 text-slate-700">
                <Inventory2OutlinedIcon className="h-4 w-4" />
                Product Attributes
              </h4>
              <div className="space-y-4">
                {attributeEntries.length > 0 ? (
                  attributeEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-[#f3f3f5] px-4 py-3"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {key.replace(/_/g, ' ')}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {String(value)}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attributes available
                  </Typography>
                )}
              </div>
            </div>
          </div>

          {/* Stock & Shipping Info */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h4 className="mb-4 flex items-center gap-2 text-slate-700">
                <PublicOutlinedIcon className="h-4 w-4" />
                Shipping & Stock Information
              </h4>
              <div className="space-y-4">
                {stockStatus && (
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                    <Typography variant="body2" color="text.secondary">
                      Stock Status
                    </Typography>
                    <Chip
                      label={stockStatus.replace(/_/g, ' ')}
                      variant="outlined"
                      size="small"
                      color={stockStatus === 'IN_STOCK' ? 'success' : 'default'}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <Typography variant="body2" color="text.secondary">
                    Ships From
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {location}
                  </Typography>
                </div>
                {logistics?.shipping && (
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                    <Typography variant="body2" color="text.secondary">
                      Shipping Options
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {logistics.shipping.fast && (
                        <Chip label="Fast" size="small" color="primary" variant="outlined" />
                      )}
                      {logistics.shipping.regular && (
                        <Chip label="Regular" size="small" variant="outlined" />
                      )}
                      {logistics.shipping.economy && (
                        <Chip label="Economy" size="small" variant="outlined" />
                      )}
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
