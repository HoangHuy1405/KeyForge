import React, { useEffect, useMemo, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateProductDialog from './CreateProductDialog';
import { Meta, Product } from '../../services/interfaces/productInterfaces';
import { useSelector } from 'react-redux';
import { getUserId } from '../../redux/slice/accountSlice';
import {
  deleteProduct,
  getProductsBySeller,
} from '../../services/ProductService';
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  PaginationState,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Product>();

export default function ProductManagerPage() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 0,
    pageSize: 10,
    pages: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sellerId = useSelector(getUserId);
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
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {String(info.getValue()).slice(0, 8)}...
          </Typography>
        ),
        size: 100,
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
        cell: (info) => info.getValue(),
        size: 150,
      }),
      columnHelper.accessor('availableQuantity', {
        header: 'Available',
        cell: (info) => info.getValue(),
        size: 100,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          return (
            <Box
              sx={(theme) => ({
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor:
                  status === 'ACTIVE'
                    ? theme.palette.success.main + '20'
                    : theme.palette.warning.main + '20',
                color:
                  status === 'ACTIVE'
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
              })}
            >
              {status}
            </Box>
          );
        },
        size: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="small"
                onClick={() => console.log('Edit', info.row.original)}
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
        size: 120,
      }),
    ],
    []
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
        const data = await getProductsBySeller({ page, size }, sellerId);
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
  }, [pagination.pageIndex, pagination.pageSize, refresh, sellerId]);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Product
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No products found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                }))
              }
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
            {pagination.pageIndex * pagination.pageSize + 1}-
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              meta.total
            )}{' '}
            of {meta.total}
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
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Product Dialog */}
      <CreateProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreateSuccess={() => setRefresh((prev) => !prev)}
      />
    </Box>
  );
}
