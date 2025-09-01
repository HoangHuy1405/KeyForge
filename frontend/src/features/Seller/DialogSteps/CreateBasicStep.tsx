
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Category, CreateBasicRequest, ProductBasicResponse, UpdateBasicRequest } from '../../../services/interfaces/productInterfaces';
import { Stack } from "@mui/material";
import { IStepComponent } from "./IStepComponent";
import * as Yup from "yup";
import { createBasicProduct } from "../../../services/ProductService";
import { toast } from "react-toastify"

type BasicFormValues = {
    name: string;
    description: string;
    category: Category | "";
    userId?: string;
    productId?: string;
}

const CreateBasicStep: IStepComponent<BasicFormValues> = ({ values, errors, touched, handleChange, setFieldValue }) => {
    return (
        <Stack mt={3} spacing={3}>
            {/* Tên sản phẩm */}
            <TextField
                fullWidth
                label="Tên sản phẩm"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
            />

            {/* Mô tả sản phẩm */}
            <TextField
                fullWidth
                label="Mô tả sản phẩm"
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                multiline
                minRows={3}
            />

            {/* Loại sản phẩm */}
            <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                <InputLabel>Loại sản phẩm</InputLabel>
                <Select
                    name="category"
                    value={values.category}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    label="Category"
                >
                    {Object.values(Category).map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
                {touched.category && errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                )}
            </FormControl>
        </Stack >
    )
}

CreateBasicStep.label = "Thông tin cơ bản"
CreateBasicStep.initialValues = {
    name: "",
    description: "",
    category: "" as Category | "",
}
CreateBasicStep.validationSchema = Yup.object({
    name: Yup.string()
        .required("Tên sản phẩm là bắt buộc")
        .min(3, "Tên phải có ít nhất 3 ký tự")
        .max(100, "Tên chỉ có tối đa 100 ký tự"),
    description: Yup.string()
        .max(500, "Mô tả không vượt quá 500 ký tự"),
    category: Yup.mixed<Category>()
        .oneOf(Object.values(Category) as Category[])
        .required("Vui lòng chọn loại sản phẩm")
})

CreateBasicStep.visited = false;

CreateBasicStep.onNextStep = async (values, { setFieldValue }) => {
    console.log("Create and get new id")

    if (!values.userId) {
        toast.error("User id không tồn tại, vui lòng đăng nhập lại");
        return;
    }
    const payload: CreateBasicRequest = {
        name: values.name,
        description: values.description,
        category: values.category as Category,
        sellerId: values.userId,
    };

    const data = await createBasicProduct(payload)
    toast.success("Create basic success")
    console.log(data)

    setFieldValue("productId", data.id)
}


CreateBasicStep.onNextStepWhenBack = (values) => {
    console.log("Update information")
}

export default CreateBasicStep