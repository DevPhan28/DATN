type Variant = {
  size: string;
  color: string;
  price: number;
  countInStock: number;
  sku: string;
};

type Category = {
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
<<<<<<< Updated upstream
  keyWord?: string;
  page: number;
  limit: number;
};
=======
    keyWord?: string
    page: number
    limit: number
  }
  interface CategoryParams {
    name?: string;
    parentCategoryId?: string;
    sort?: string;
}

>>>>>>> Stashed changes
type MetaData = {
  totalItems: number;
};
