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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import CreateProductDialog from './CreateProductDialog';
import { useEffect, useState } from 'react';
import { Meta, Product } from '../../services/interfaces/productInterfaces';
import { useSelector } from 'react-redux';
import { getUserId } from '../../redux/slice/accountSlice';
import {
  deleteProduct,
  getProductsBySeller,
} from '../../services/ProductService';
import { toast } from 'react-toastify';

async function handleDelete(id: string) {
  console.log('Delete', id);
  try {
    const data = await deleteProduct(id);
    console.log(data);
  } catch (error: any) {
    toast.error('Lỗi khi lấy sản phẩm:', error);
  }
}

export default function ProductManagerPage() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false); // toggle mỗi khi tạo product thành công

  const [rows, setRows] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 0,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const sellerId = useSelector(getUserId);

  const [loading, setLoading] = useState<boolean>(false);
  // State to control dialog
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
      toast.error('Lỗi khi xóa sản phẩm');
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'availableQuantity', headerName: 'Available', width: 120 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => console.log('Edit', params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async (page: number, size: number) => {
      try {
        setLoading(true);
        const data = await getProductsBySeller({ page, size }, sellerId);
        console.log(data);
        setRows(data.result);
        setMeta(data.meta);
      } catch (error: any) {
        toast.error('Lỗi khi lấy sản phẩm:', error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel, refresh]);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
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

      {/* DataGrid */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={meta.total}
          paginationModel={paginationModel}
          pageSizeOptions={[5]}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
        <Dialog open={confirmOpen} onClose={handleCancel}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="inherit">
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <CreateProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreateSuccess={() => setRefresh((prev) => !prev)}
      />
    </Box>
  );
}
