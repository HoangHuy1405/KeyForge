import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Category, CreateProductRequest, UpdateBasicRequest } from '../../../services/interfaces/productInterfaces';
import { Stack } from "@mui/material";
import { IStepComponent } from "./IStepComponent";
import * as Yup from "yup";
import { createProduct, updateBasicProduct } from "../../../services/ProductService";
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
                    onChange={(e) => setFieldValue("category", e.target.value as Category)}
                    label="Category"
                >
                    {Object.entries(Category).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            {value}
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
    category: Yup.mixed<keyof typeof Category>()
        .oneOf(Object.keys(Category) as (keyof typeof Category)[])
        .required("Vui lòng chọn loại sản phẩm"),
})

CreateBasicStep.visited = false;

CreateBasicStep.onNextStep = async (values, { setFieldValue }) => {
    console.log("Create and get new id")

    const payload: CreateProductRequest = {
        name: values.name,
        description: values.description,
        category: values.category as Category,
        sellerId: values.userId!,
    };

    const data = await createProduct(payload)
    toast.success("Create basic success")
    console.log(data)

    setFieldValue("productId", data.id)
}


CreateBasicStep.onNextStepWhenBack = async (values) => {
    const payload: UpdateBasicRequest = {
        name: values.name,
        description: values.description,
        category: values.category as Category
    };

    const data = await updateBasicProduct(payload, values.productId!, values.userId!)

    toast.success("Update basic success")

}

export default CreateBasicStep