import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { ProductCondition, UpdateDetailsRequest } from '../../../services/interfaces/productInterfaces';
import { Stack } from "@mui/material";
import { IStepComponent } from "./IStepComponent";
import * as Yup from "yup";
import { updateDetailsProduct } from "../../../services/ProductService";
import { toast } from "react-toastify";

type UpdateDetailValues = {
    brand: string;
    model: string;
    size: string;
    material: string;
    origin: string;
    condition: ProductCondition | "";
    productId?: string;
    userId?: string;
}
const UpdateDetailStep: IStepComponent<UpdateDetailValues> = (props) => {
    const { values, errors, touched, handleChange, setFieldValue } = props;

    return (
        <Stack mt={3} spacing={3}>
            <TextField
                fullWidth
                label="Thương hiệu"
                name="brand"
                value={values.brand}
                onChange={handleChange}
                error={touched.brand && Boolean(errors.brand)}
                helperText={touched.brand && errors.brand}
            />

            <TextField
                fullWidth
                label="Model"
                name="model"
                value={values.model}
                onChange={handleChange}
                error={touched.model && Boolean(errors.model)}
                helperText={touched.model && errors.model}
            />

            <TextField
                fullWidth
                label="Size"
                name="size"
                value={values.size}
                onChange={handleChange}
                error={touched.size && Boolean(errors.size)}
                helperText={touched.size && errors.size}
            />

            <TextField
                fullWidth
                label="Chất liệu"
                name="material"
                value={values.material}
                onChange={handleChange}
                error={touched.material && Boolean(errors.material)}
                helperText={touched.material && errors.material}
            />

            <TextField
                fullWidth
                label="Xuất xứ"
                name="origin"
                value={values.origin}
                onChange={handleChange}
                error={touched.origin && Boolean(errors.origin)}
                helperText={touched.origin && errors.origin}
            />

            <FormControl fullWidth error={touched.condition && Boolean(errors.condition)}>
                <InputLabel>Tình trạng</InputLabel>
                <Select
                    name="condition"
                    value={values.condition}
                    onChange={(e) => setFieldValue("condition", e.target.value as ProductCondition)}
                    label="condition"
                >
                    {Object.entries(ProductCondition).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
                {touched.condition && errors.condition && (
                    <FormHelperText>{errors.condition}</FormHelperText>
                )}
            </FormControl>
        </Stack>
    )
}


UpdateDetailStep.label = "Thông tin chi tiết"

UpdateDetailStep.initialValues = {
    brand: "",
    model: "",
    size: "",
    material: "",
    origin: "",
    condition: "" as ProductCondition | ""
}

UpdateDetailStep.validationSchema = Yup.object({
    brand: Yup.string()
        .max(100, "Không vượt quá 100 ký tự")
        .required("Bắt buộc nhập thương hiệu"),
    model: Yup.string()
        .max(100, "Không vượt quá 100 ký tự")
        .required("Bắt buộc nhập model"),
    size: Yup.string()
        .max(50, "Không vượt quá 50 ký tự")
        .required("Bắt buộc nhập size"),
    material: Yup.string()
        .max(100, "Không vượt quá 100 ký tự")
        .required("Bắt buộc nhập chất liệu"),
    origin: Yup.string()
        .max(100, "Không vượt quá 100 ký tự")
        .required("Bắt buộc nhập xuất xứ"),
    condition: Yup.mixed<keyof typeof ProductCondition>()
        .oneOf(Object.keys(ProductCondition) as (keyof typeof ProductCondition)[])
        .required("Vui lòng chọn loại sản phẩm"),
})


UpdateDetailStep.onNextStep = async (values) => {
    const payload: UpdateDetailsRequest = {
        brand: values.brand,
        model: values.model,
        size: values.size,
        material: values.material,
        origin: values.origin,
        condition: values.condition as ProductCondition,
    };

    console.log("Update Details Product")
    if (!values.productId) {
        toast.error("Reload page and try again");
        return;
    }

    if (!values.userId) {
        toast.error("User id không tồn tại, vui lòng đăng nhập lại");
        return;
    }

    const data = await updateDetailsProduct(payload, values.productId, values.userId,)
    toast.success("Update detail success")
};

UpdateDetailStep.visited = false;

export default UpdateDetailStep