import {
    Box,
    Button,
    Typography,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CreateProductDialog from "./CreateProductDialog";
import { useState } from "react";
// import { ProductResponse } from "../../services/interfaces/productInterfaces";

// Fake data mẫu
const rows = [
    { id: 1, name: "iPhone 15 Pro", price: 1200, stock: 50, category: "Phones" },
    { id: 2, name: "Samsung Galaxy S24", price: 1000, stock: 35, category: "Phones" },
    { id: 3, name: "MacBook Pro 16", price: 2500, stock: 15, category: "Laptops" },
    { id: 4, name: "Sony WH-1000XM5", price: 400, stock: 80, category: "Headphones" },
];

// Định nghĩa cột bảng
const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Product Name", flex: 1, minWidth: 200 },
    { field: "category", headerName: "Category", width: 150 },
    {
        field: "price",
        headerName: "Price ($)",
        width: 120,
        valueFormatter: (params) => `$${params.value}`,
    },
    { field: "inStock", headerName: "In Stock", width: 120 },
    { field: "status", headerName: "Status", width: 150 },

    {
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <Stack direction="row" spacing={1}>
                <Tooltip title="Edit">
                    <IconButton
                        color="primary"
                        onClick={() => console.log("Edit", params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() => console.log("Delete", params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        ),
    },
];

export default function ProductManagerPage() {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    // const [rows, setRows] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         setLoading(true);
    //         try {
    //             const res = await
    //                 setRows(res.data);
    //         } catch (err) {
    //             console.error("Fetch products error:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProducts();
    // }, []);


    return (
        <Box sx={{ p: 3, width: "100%" }}>
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
            <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                />
            </Box>

            <CreateProductDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}

            />
        </Box>
    );
}

