 

// Kiểu dữ liệu cho OrderItem
  interface OrderItem {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}

// Kiểu dữ liệu cho CustomerInfo
  interface CustomerInfo {
    name: string;
    phone: number;
    email: string;
    city: string;
    districts: string;
    wards: string;
}

// Kiểu dữ liệu cho Order
  interface Order extends Document {
    userId: Types.ObjectId;
    items: OrderItem[];
    orderNumber: string;
    customerInfo: CustomerInfo;
    totalPrice: number;
    status: "pending" | "confirmed" | "shipped" | "canceled";
    createdAt?: Date;
    updatedAt?: Date;
}
