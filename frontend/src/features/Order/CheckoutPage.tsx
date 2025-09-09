
import { useSelector, useDispatch } from "react-redux";
import {
    getCart,
    getTotalCartPrice,
    clearCart,
} from "../../redux/slice/cartSlice";
import { Card, Stack } from "@mui/material";
import UserAddressCard from "./UserAddressCard";
import OrdersInformation from "./OrderInformation";

const seller = {
    id: "1",
    username: "anhkhoa13",
    email: "anhkhoa13@example.com",
    phoneNum: "0987654321",
    avatarUrl: "https://example.com/avatar.jpg",
};

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(getCart);
    const totalPrice = useSelector(getTotalCartPrice);

    // chỉ lấy sản phẩm được chọn
    const selectedItems = cartItems.filter((item) => item.selected);

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
            return;
        }

        // chuẩn bị payload gửi lên backend
        const orderPayload = {
            items: selectedItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.unitPrice,
            })),
            total: totalPrice,
        };


    };

    return (
        <Stack
            direction="column"
            gap={2}
            sx={
                { width: '100%' }
            }>
            <UserAddressCard />
            <OrdersInformation seller={seller} />

        </Stack>
    );
};


