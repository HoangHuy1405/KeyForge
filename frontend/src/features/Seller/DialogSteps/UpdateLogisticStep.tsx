// import { TextField, FormControlLabel, Checkbox, Stack } from "@mui/material";
// import { IStepComponent } from "./IStepComponent";
// import * as Yup from "yup";
// import { updateLogisticProduct } from "../../../services/ProductService";
// import { toast } from "react-toastify"
// import { UpdateLogisticsRequest } from "../../../services/interfaces/productInterfaces";

// type LogisticsFormValues = {
//     weightGrams: number | "";
//     lengthCm: number | "";
//     widthCm: number | "";
//     heightCm: number | "";
//     location: string;
//     preOrder: boolean;
//     preOrderLeadTimeDays: number | "";
//     supportFastShipping: boolean;
//     supportRegularShipping: boolean;
//     supportEconomyShipping: boolean;
//     productId?: string;
//     userId?: string;
// };

// const UpdateLogisticsStep: IStepComponent<LogisticsFormValues> = ({
//     values,
//     errors,
//     touched,
//     handleChange,
//     setFieldValue,
// }) => {
//     return (
//         <Stack mt={3} spacing={3}>
//             {/* Kích thước & cân nặng */}
//             <TextField
//                 fullWidth
//                 type="number"
//                 label="Cân nặng (gram)"
//                 name="weightGrams"
//                 value={values.weightGrams}
//                 onChange={handleChange}
//                 error={touched.weightGrams && Boolean(errors.weightGrams)}
//                 helperText={touched.weightGrams && errors.weightGrams}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },

//                 }}
//             />

//             <TextField
//                 fullWidth
//                 type="number"
//                 label="Chiều dài (cm)"
//                 name="lengthCm"
//                 value={values.lengthCm}
//                 onChange={handleChange}
//                 error={touched.lengthCm && Boolean(errors.lengthCm)}
//                 helperText={touched.lengthCm && errors.lengthCm}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 type="number"
//                 label="Chiều rộng (cm)"
//                 name="widthCm"
//                 value={values.widthCm}
//                 onChange={handleChange}
//                 error={touched.widthCm && Boolean(errors.widthCm)}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 type="number"
//                 label="Chiều cao (cm)"
//                 name="heightCm"
//                 value={values.heightCm}
//                 onChange={handleChange}
//                 error={touched.heightCm && Boolean(errors.heightCm)}
//                 helperText={touched.heightCm && errors.heightCm}
//                 slotProps={{
//                     input: {
//                         inputProps: { min: 0, step: 1 },
//                         onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                     },
//                 }}
//             />

//             {/* Địa điểm */}
//             <TextField
//                 fullWidth
//                 label="Địa điểm"
//                 name="location"
//                 value={values.location}
//                 onChange={handleChange}
//                 error={touched.location && Boolean(errors.location)}
//                 helperText={touched.location && errors.location}
//                 multiline
//                 minRows={3}
//             />

//             {/* Pre-order */}
//             <FormControlLabel
//                 control={
//                     <Checkbox
//                         checked={values.preOrder}
//                         onChange={(e) => setFieldValue("preOrder", e.target.checked)}
//                     />
//                 }
//                 label="Hàng đặt trước (Pre-order)"
//             />

//             {values.preOrder && (
//                 <TextField
//                     fullWidth
//                     type="number"
//                     label="Thời gian chờ (ngày)"
//                     name="preOrderLeadTimeDays"
//                     value={values.preOrderLeadTimeDays}
//                     onChange={handleChange}
//                     error={touched.preOrderLeadTimeDays && Boolean(errors.preOrderLeadTimeDays)}
//                     helperText={touched.preOrderLeadTimeDays && errors.preOrderLeadTimeDays}
//                     slotProps={{
//                         input: {
//                             inputProps: { min: 0, step: 1 },
//                             onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur(),
//                         },
//                     }}
//                 />
//             )}

//             {/* Shipping options */}
//             <FormControlLabel
//                 control={
//                     <Checkbox
//                         checked={values.supportFastShipping}
//                         onChange={(e) => setFieldValue("supportFastShipping", e.target.checked)}
//                     />
//                 }
//                 label="Hỗ trợ giao nhanh"
//             />

//             <FormControlLabel
//                 control={
//                     <Checkbox
//                         checked={values.supportRegularShipping}
//                         onChange={(e) => setFieldValue("supportRegularShipping", e.target.checked)}
//                     />
//                 }
//                 label="Hỗ trợ giao thường"
//             />

//             <FormControlLabel
//                 control={
//                     <Checkbox
//                         checked={values.supportEconomyShipping}
//                         onChange={(e) => setFieldValue("supportEconomyShipping", e.target.checked)}
//                     />
//                 }
//                 label="Hỗ trợ giao tiết kiệm"
//             />
//         </Stack>
//     );
// };

// UpdateLogisticsStep.label = "Thông tin vận chuyển";
// UpdateLogisticsStep.initialValues = {
//     weightGrams: "",
//     lengthCm: "",
//     widthCm: "",
//     heightCm: "",
//     location: "",
//     preOrder: false,
//     preOrderLeadTimeDays: "",
//     supportFastShipping: false,
//     supportRegularShipping: false,
//     supportEconomyShipping: false,
// };
// UpdateLogisticsStep.validationSchema = Yup.object({
//     weightGrams: Yup.number().min(0, "Cân nặng không hợp lệ").required("Bắt buộc nhập cân nặng"),
//     lengthCm: Yup.number().min(0, "Chiều dài không hợp lệ").required("Bắt buộc nhập chiều dài"),
//     widthCm: Yup.number().min(0, "Chiều rộng không hợp lệ").required("Bắt buộc nhập chiều rộng"),
//     heightCm: Yup.number().min(0, "Chiều cao không hợp lệ").required("Bắt buộc nhập chiều cao"),
//     location: Yup.string().max(100, "Địa điểm tối đa 100 ký tự"),
//     preOrder: Yup.boolean(),
//     preOrderLeadTimeDays: Yup.number().min(0, "Ngày chờ không hợp lệ").when("preOrder", {
//         is: true,
//         then: (schema) => schema.required("Vui lòng nhập thời gian chờ khi Pre-order"),
//         otherwise: (schema) => schema.optional(),
//     }),
//     supportFastShipping: Yup.boolean(),
//     supportRegularShipping: Yup.boolean(),
//     supportEconomyShipping: Yup.boolean(),
// });

// UpdateLogisticsStep.visited = false;

// UpdateLogisticsStep.onNextStep = async (values) => {
//     const payload: UpdateLogisticsRequest = {
//         weightGrams: values.weightGrams ? Number(values.weightGrams) : undefined,
//         lengthCm: values.lengthCm ? Number(values.lengthCm) : undefined,
//         widthCm: values.widthCm ? Number(values.widthCm) : undefined,
//         heightCm: values.heightCm ? Number(values.heightCm) : undefined,
//         location: values.location || undefined,
//         preOrder: values.preOrder ?? undefined,
//         preOrderLeadTimeDays: values.preOrderLeadTimeDays ? Number(values.preOrderLeadTimeDays) : undefined,
//         supportFastShipping: values.supportFastShipping ?? undefined,
//         supportRegularShipping: values.supportRegularShipping ?? undefined,
//         supportEconomyShipping: values.supportEconomyShipping ?? undefined,
//     };

//     if (!values.productId) {
//         toast.error("Reload page and try again");
//         return;
//     }

//     if (!values.userId) {
//         toast.error("User id không tồn tại, vui lòng đăng nhập lại");
//         return;
//     }

//     const data = await updateLogisticProduct(payload, values.productId, values.userId,)
//     toast.success("Update inventory success")
// };

// export default UpdateLogisticsStep;
