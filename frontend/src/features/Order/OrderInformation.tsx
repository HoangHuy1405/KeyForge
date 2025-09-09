
import {
    Box,
    Avatar,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Divider,
    Button,
} from '@mui/material';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

export type SellerInfo = {
    id: string;
    username: string;
    email: string;
    phoneNum: string;
    avatarUrl: string;
};

type SellerInformationCardProps = {
    seller: SellerInfo;
    onContactSeller?: () => void;
    onViewStore?: () => void;
    title?: string;
};

const rows = [
    {
        id: "p1",
        name: "iPhone 15 Pro Max 256GB",
        image: "https://example.com/images/iphone15.jpg",
        unitPrice: 1200,
        quantity: 1,
        totalPrice: 1200,
        selected: true,
    },
    {
        id: "p2",
        name: "MacBook Pro 14-inch M3",
        image: "https://example.com/images/macbookpro.jpg",
        unitPrice: 2200,
        quantity: 2,
        totalPrice: 4400,
        selected: false,
    },
    {
        id: "p3",
        name: "Sony WH-1000XM5 Headphones",
        image: "https://example.com/images/sonyheadphones.jpg",
        unitPrice: 400,
        quantity: 1,
        totalPrice: 400,
        selected: true,
    },
    {
        id: "p4",
        name: "Samsung 4K Smart TV 55-inch",
        image: "https://example.com/images/samsungtv.jpg",
        unitPrice: 800,
        quantity: 1,
        totalPrice: 800,
        selected: false,
    },
];

export default function OrdersInformation({ seller }: SellerInformationCardProps) {
    return (
        <TableContainer sx={{
            border: '1px solid #75757536',
        }}>
            <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                <TableHead>
                    <TableCell align='left' sx={{ fontSize: 25, width: "50%", }}>Sản phẩm</TableCell>
                    <TableCell align='right'> Đơn giá</TableCell>
                    <TableCell align='right'> Số lượng</TableCell>
                    <TableCell align='right'>Thành tiền</TableCell>
                </TableHead>
                <TableBody >
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Typography
                                variant="h6"
                                component="div"
                                className="flex items-center gap-1"
                            >
                                <Avatar
                                    src={seller.avatarUrl}
                                    alt={seller.username}
                                    sx={{ width: 20, height: 20 }}
                                />
                                {seller.username}
                                <Divider orientation="vertical" sx={{ borderColor: "black", height: 20, mx: 1 }} />
                                <Button variant="text" color="inherit">
                                    <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, mr: 1 }} />
                                    Contact Seller
                                </Button>
                            </Typography>
                        </TableCell>
                    </TableRow>
                    {rows.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" >
                                <OrderItemPreview name={row.name} img={row.image} />
                            </TableCell>
                            <TableCell align="right">{row.unitPrice}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.totalPrice}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}

function OrderItemPreview({ name, img }: { name: string, img: string }) {
    return (
        <Box display="flex" alignItems="center" gap={2} minWidth={0}>
            <Avatar src={img} alt={name} variant="square" sx={{ width: 20, height: 20 }} />
            <Typography
                variant="body1"
                noWrap
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                }}
            >
                {name}
            </Typography>
        </Box>
    );
}
