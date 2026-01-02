/**
 * Step 1: Basic Information
 * Product name, description, category, condition, stock status, custom attributes
 * Clean, professional design without icons
 */
import { useRef, useState, memo, lazy, Suspense } from 'react';
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Button,
  Paper,
  Stack,
  Chip,
  alpha,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Lazy load TinyMCE to improve initial load performance
const Editor = lazy(() => import('@tinymce/tinymce-react').then(mod => ({ default: mod.Editor })));
import {
  ProductCategory,
  ProductCategoryLabels,
  ProductCondition,
  ProductConditionLabels,
  StockStatus,
  StockStatusLabels,
} from '../../../../services/interfaces/productTypes';

interface BasicInfoStepProps {
  data: {
    name: string;
    description: string;
    category: ProductCategory | '';
    productCondition: ProductCondition | '';
    stockStatus: StockStatus | '';
    attributes: Record<string, unknown>;
  };
  onChange: (updates: Partial<BasicInfoStepProps['data']>) => void;
}

const conditionColors: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: '#22c55e',
  [ProductCondition.LIKE_NEW]: '#84cc16',
  [ProductCondition.GOOD]: '#eab308',
  [ProductCondition.FAIR]: '#f97316',
  [ProductCondition.FOR_PARTS]: '#ef4444',
};

const stockColors: Record<StockStatus, string> = {
  [StockStatus.IN_STOCK]: '#22c55e',
  [StockStatus.PRE_ORDER]: '#3b82f6',
  [StockStatus.GROUP_BUY]: '#8b5cf6',
  [StockStatus.INTEREST_CHECK]: '#f59e0b',
  [StockStatus.OUT_OF_STOCK]: '#6b7280',
};

interface AttributePair {
  key: string;
  value: string;
}

const BasicInfoStep = memo(function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  const theme = useTheme();
  const editorRef = useRef<any>(null);
  
  const [attributePairs, setAttributePairs] = useState<AttributePair[]>(() => {
    const pairs: AttributePair[] = [];
    Object.entries(data.attributes || {}).forEach(([key, value]) => {
      pairs.push({ key, value: String(value) });
    });
    return pairs.length > 0 ? pairs : [{ key: '', value: '' }];
  });

  const handleEditorChange = (content: string) => {
    onChange({ description: content });
  };

  const updateAttributes = (pairs: AttributePair[]) => {
    setAttributePairs(pairs);
    const newAttributes: Record<string, unknown> = {};
    pairs.forEach((pair) => {
      if (pair.key.trim()) {
        newAttributes[pair.key.trim()] = pair.value;
      }
    });
    onChange({ attributes: newAttributes });
  };

  const addAttribute = () => {
    updateAttributes([...attributePairs, { key: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    const newPairs = attributePairs.filter((_, i) => i !== index);
    updateAttributes(newPairs.length > 0 ? newPairs : [{ key: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const newPairs = [...attributePairs];
    newPairs[index][field] = value;
    updateAttributes(newPairs);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Product Name Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product Name *
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g., GMK Olivia R3 Base Kit — Cherry Profile PBT Keycaps"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          required
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
      </Paper>

      

      {/* Category, Condition, Stock Status */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product Classification
        </Typography>
        <Grid container spacing={2}>
          {/* Category */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: 'text.secondary' }}>
              Category *
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={data.category}
                displayEmpty
                onChange={(e) => onChange({ category: e.target.value as ProductCategory })}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Select category</Typography>
                </MenuItem>
                {Object.values(ProductCategory).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {ProductCategoryLabels[cat]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Condition */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: 'text.secondary' }}>
              Condition *
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={data.productCondition}
                displayEmpty
                onChange={(e) => onChange({ productCondition: e.target.value as ProductCondition })}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Select condition</Typography>
                </MenuItem>
                {Object.values(ProductCondition).map((cond) => (
                  <MenuItem key={cond} value={cond}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: conditionColors[cond],
                        }}
                      />
                      {ProductConditionLabels[cond]}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Stock Status */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom sx={{ color: 'text.secondary' }}>
              Stock Status *
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={data.stockStatus}
                displayEmpty
                onChange={(e) => onChange({ stockStatus: e.target.value as StockStatus })}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Select status</Typography>
                </MenuItem>
                {Object.values(StockStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip
                      label={StockStatusLabels[status]}
                      size="small"
                      sx={{
                        bgcolor: alpha(stockColors[status], 0.15),
                        color: stockColors[status],
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Custom Attributes Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 1,
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Custom Attributes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add specifications like Profile, Material, Layout, etc.
        </Typography>

        <Stack spacing={1.5}>
          {attributePairs.map((pair, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder="Attribute name"
                value={pair.key}
                onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />
              <TextField
                placeholder="Value"
                value={pair.value}
                onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                size="small"
                sx={{
                  flex: 1.5,
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />
              <IconButton
                onClick={() => removeAttribute(index)}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Button
          variant="outlined"
          size="small"
          onClick={addAttribute}
          sx={{
            mt: 2,
            borderRadius: 1,
            textTransform: 'none',
          }}
        >
          + Add Attribute
        </Button>

        {/* Attribute Preview */}
        {Object.keys(data.attributes || {}).length > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
              PREVIEW
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {Object.entries(data.attributes || {}).map(([key, value]) => (
                key.trim() && (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                )
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Description Section with TinyMCE */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product Description
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe your product with rich formatting
        </Typography>
        <Box
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            '& .tox-tinymce': {
              border: 'none !important',
            },
          }}
        >
          <Suspense fallback={<Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />}>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={data.description}
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | bold italic forecolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat',
                content_style: `
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    font-size: 14px; 
                    line-height: 1.6;
                    padding: 16px;
                  }
                `,
                placeholder: 'Describe your product in detail...',
                skin: theme.palette.mode === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: theme.palette.mode === 'dark' ? 'dark' : 'default',
              }}
            />
          </Suspense>
        </Box>
      </Paper>
    </Box>
  );
});

export default BasicInfoStep;
