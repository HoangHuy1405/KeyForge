/**
 * Product Manager Page
 * Uses TanStack Table with styled Box components (no MUI Table)
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Chip,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  PaginationMeta,
  ProductSummaryResponse,
  StockStatus,
  StockStatusLabels,
} from '../../services/interfaces/productTypes';
import { deleteProduct, getProductsBySeller } from '../../services/ProductService';
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  PaginationState,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<ProductSummaryResponse>();

const stockStatusColors: Record<StockStatus, string> = {
  [StockStatus.IN_STOCK]: '#22c55e',
  [StockStatus.PRE_ORDER]: '#3b82f6',
  [StockStatus.GROUP_BUY]: '#8b5cf6',
  [StockStatus.INTEREST_CHECK]: '#f59e0b',
  [StockStatus.OUT_OF_STOCK]: '#6b7280',
};

export default function ProductManagerPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState<ProductSummaryResponse[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 0,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Deleted product');
      setRefresh((prev) => !prev);
    } catch (err: any) {
      toast.error('Error deleting product');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('thumbnailUrl', {
        header: 'Image',
        cell: (info) => {
          const url = info.getValue();
          return (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {url ? (
                <Box
                  component="img"
                  src={url}
                  alt="Product"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No img
                </Typography>
              )}
            </Box>
          );
        },
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <Typography variant="body2" fontWeight={500}>
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <Typography variant="body2">{info.getValue()}</Typography>
        ),
        size: 130,
      }),
      columnHelper.accessor('stockStatus', {
        header: 'Stock Status',
        cell: (info) => {
          const status = info.getValue();
          return (
            <Chip
              label={StockStatusLabels[status] || status}
              size="small"
              sx={{
                bgcolor: alpha(stockStatusColors[status] || '#6b7280', 0.15),
                color: stockStatusColors[status] || '#6b7280',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          );
        },
        size: 130,
      }),
      columnHelper.accessor('availableQuantity', {
        header: 'Available',
        cell: (info) => (
          <Typography variant="body2">{info.getValue() ?? 0}</Typography>
        ),
        size: 90,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          return (
            <Chip
              label={status}
              size="small"
              color={status === 'ACTIVE' ? 'success' : 'warning'}
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          );
        },
        size: 100,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => {
          const price = info.getValue();
          return (
            <Typography variant="body2" fontWeight={500}>
              {price ? `₫${Number(price).toLocaleString()}` : '-'}
            </Typography>
          );
        },
        size: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="small"
                onClick={() => navigate(`/seller/products/${info.row.original.id}/edit`)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteClick(info.row.original.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
        size: 100,
      }),
    ],
    [navigate]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(meta.total / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  useEffect(() => {
    const fetchProducts = async (page: number, size: number) => {
      try {
        setLoading(true);
        const data = await getProductsBySeller({ page, size });
        setRows(data.result);
        setMeta(data.meta);
      } catch (error: any) {
        toast.error('Error fetching products');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, refresh]);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/seller/products/new')}
          sx={{ borderRadius: 1 }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: table
              .getAllColumns()
              .map((col) => (col.getSize() !== 150 ? `${col.getSize()}px` : '1fr'))
              .join(' '),
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <Box
                key={header.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Box>
            ))
          )}
        </Box>

        {/* Table Body */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No products found</Typography>
          </Box>
        ) : (
          table.getRowModel().rows.map((row) => (
            <Box
              key={row.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: table
                  .getAllColumns()
                  .map((col) => (col.getSize() !== 150 ? `${col.getSize()}px` : '1fr'))
                  .join(' '),
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': { borderBottom: 'none' },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <Box
                  key={cell.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </Box>
          ))
        )}
      </Paper>

      {/* Pagination */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                }))
              }
              sx={{ borderRadius: 1 }}
            >
              {[5, 10, 20, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {meta.total > 0
              ? `${pagination.pageIndex * pagination.pageSize + 1}-${Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  meta.total
                )} of ${meta.total}`
              : '0 results'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
