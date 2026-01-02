// import { TextField, Stack } from "@mui/material";
// import { IStepComponent } from "./IStepComponent";
// import * as Yup from "yup";
// import { toast } from "react-toastify"
// import { updateInventoryProduct } from "../../../services/ProductService";
// import { UpdateInventoryRequest } from "../../../services/interfaces/productInterfaces";

// type UpdateInventoryValues = {
//     price: number | "";
//     stockQuantity: number | "";
//     reservedQuantity: number | "";
//     minOrderQuantity: number | "";
//     maxOrderQuantity: number | ""; // null = unlimited
//     productId?: string;
//     userId?: string;
// };

// const UpdateInventoryStep: IStepComponent<UpdateInventoryValues> = (props) => {
//     const { values, errors, touched, handleChange } = props;

//     return (
//         <Stack mt={3} spacing={3}>
//             <TextField
//                 fullWidth
//                 label="Giá bán"
//                 name="price"
//                 type="number"
//                 value={values.price}
//                 onChange={handleChange}
//                 error={touched.price && Boolean(errors.price)}
//                 helperText={touched.price && errors.price}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 0.01 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 label="Số lượng tồn kho"
//                 name="stockQuantity"
//                 type="number"
//                 value={values.stockQuantity}
//                 onChange={handleChange}
//                 error={touched.stockQuantity && Boolean(errors.stockQuantity)}
//                 helperText={touched.stockQuantity && errors.stockQuantity}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 label="Số lượng đã đặt trước"
//                 name="reservedQuantity"
//                 type="number"
//                 value={values.reservedQuantity}
//                 onChange={handleChange}
//                 error={touched.reservedQuantity && Boolean(errors.reservedQuantity)}
//                 helperText={touched.reservedQuantity && errors.reservedQuantity}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 label="Số lượng đặt tối thiểu"
//                 name="minOrderQuantity"
//                 type="number"
//                 value={values.minOrderQuantity}
//                 onChange={handleChange}
//                 error={touched.minOrderQuantity && Boolean(errors.minOrderQuantity)}
//                 helperText={touched.minOrderQuantity && errors.minOrderQuantity}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 label="Số lượng đặt tối đa (null = không giới hạn)"
//                 name="maxOrderQuantity"
//                 type="number"
//                 value={values.maxOrderQuantity}
//                 onChange={handleChange}
//                 error={touched.maxOrderQuantity && Boolean(errors.maxOrderQuantity)}
//                 helperText={touched.maxOrderQuantity && errors.maxOrderQuantity}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 1, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />
//         </Stack>
//     );
// };

// UpdateInventoryStep.label = "Thông tin tồn kho";

// UpdateInventoryStep.initialValues = {
//     price: "" as number | "",
//     stockQuantity: "" as number | "",
//     reservedQuantity: "" as number | "",
//     minOrderQuantity: "" as number | "",
//     maxOrderQuantity: "" as number | ""
// };

// UpdateInventoryStep.validationSchema = Yup.object({
//     price: Yup.number()
//         .min(0, "Giá phải lớn hơn hoặc bằng 0")
//         .required("Bắt buộc nhập giá"),
//     stockQuantity: Yup.number()
//         .min(0, "Số lượng tồn kho >= 0")
//         .required("Bắt buộc nhập số lượng tồn kho"),
//     reservedQuantity: Yup.number()
//         .min(0, "Số lượng đã đặt >= 0")
//         .required("Bắt buộc nhập số lượng đã đặt"),
//     minOrderQuantity: Yup.number()
//         .min(1, "Số lượng đặt tối thiểu >= 1")
//         .required("Bắt buộc nhập số lượng đặt tối thiểu"),
//     maxOrderQuantity: Yup.number()
//         .min(1, "Số lượng đặt tối đa >= 1")
//         .nullable()
// });

// UpdateInventoryStep.onNextStep = async (values) => {
//     const payload: UpdateInventoryRequest = {
//         price: Number(values.price),
//         stockQuantity: Number(values.stockQuantity),
//         reservedQuantity: Number(values.reservedQuantity),
//         minOrderQuantity: values.minOrderQuantity ? Number(values.minOrderQuantity) : undefined,
//         maxOrderQuantity: values.maxOrderQuantity ? Number(values.maxOrderQuantity) : undefined,
//     };

//     const data = await updateInventoryProduct(payload, values.productId!, values.userId!)
//     toast.success("Update inventory success")
// };

// UpdateInventoryStep.visited = false;

// export default UpdateInventoryStep;
