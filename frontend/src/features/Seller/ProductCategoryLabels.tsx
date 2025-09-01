import { Category } from "../../services/interfaces/productInterfaces";

// Mapping để hiển thị label dễ đọc trong dropdown
export const ProductCategoryLabels: Record<Category, string> = {
    [Category.FASHION]: "Fashion",
    [Category.JEWELRY]: "Jewelry",
    [Category.WATCHES]: "Watches",

    [Category.ELECTRONICS]: "Electronics",
    [Category.PHONES]: "Phones",
    [Category.LAPTOPS]: "Laptops",
    [Category.TABLETS]: "Tablets",
    [Category.CAMERAS]: "Cameras",
    [Category.ACCESSORIES]: "Accessories",

    [Category.FURNITURE]: "Furniture",
    [Category.HOME_APPLIANCES]: "Home Appliances",
    [Category.KITCHEN]: "Kitchen",
    [Category.DECOR]: "Decor",

    [Category.BEAUTY]: "Beauty",
    [Category.COSMETICS]: "Cosmetics",
    [Category.SKINCARE]: "Skincare",
    [Category.HAIRCARE]: "Haircare",
    [Category.SUPPLEMENTS]: "Supplements",

    [Category.BOOKS]: "Books",
    [Category.TOYS]: "Toys",
    [Category.SPORTS]: "Sports",
    [Category.AUTOMOTIVE]: "Automotive",
    [Category.PET]: "Pet",

    [Category.FOOD]: "Food",
};

// Convenience list cho dropdown
export const ProductCategoryOptions = Object.values(Category).map((value) => ({
    value,
    label: ProductCategoryLabels[value],
}));
