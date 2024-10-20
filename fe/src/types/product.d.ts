type Variant = {
  size: string;
  color: string;
  price: number;
  countInStock: number;
  sku: string;
};

type Category = {
  data: Category | PromiseLike<Category>;
  status: number;
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;  
  image: string;
  category: string[]; // Thay đổi từ string thành Category
  gallery?: string[];
  description: string;
  discount: number;
  countInStock: number;
  featured?: boolean;
  tags?: string[];
  variants: Variant[];
};

type ProductParams = {
    keyWord?: string
    page: number
    limit: number
  }
  interface CategoryParams {
    name?: string;
    parentCategoryId?: string;
    sort?: string;
}

type MetaData = {
  totalItems: number;
};
