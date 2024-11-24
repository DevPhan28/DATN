type Variant = {
  size: string;
  color: string;
  price: number;
  countInStock: number;
  weight: number;
};

type Category = {
  data: Category | PromiseLike<Category>;
  status: number;
  _id: string;
  name: string;
  slug: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string[]; // Thay đổi từ string thành Category
  gallery?: string[];
  description: string;
  discount: number;
  countInStock: number;
  featured?: boolean;
  tags?: string[];
  variants: Variant[];
  comments?: Comment[]; // Thêm danh sách bình luận cho sản phẩm
};

type ProductParams = {
  keyWord?: string;
  page: number;
  limit: number;
};
interface CategoryParams {
  name?: string;
  parentCategoryId?: string;
  sort?: string;
}

type MetaData = {
  totalItems: number;
};
