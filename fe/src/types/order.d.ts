type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
  wards: string;
  districts: string;
  city: string;
};

type Product = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  products: Product[];
  totalPrice: number;
  status: OrderStatus;
  refundReason?: string;
};

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'received'
  | 'delivered'
  | 'canceled'
  | 'refund'
  | 'exchange'
  | 'refund_in_progress'
  | 'exchange_in_progress'
  | 'refund_completed'
  | 'exchange_completed';

type OrderMeta = {
  totalItems: number;
  totalPages: number;
  pageSize: number;
};

type OrderListResponse = {
  data: Order[];
  meta: OrderMeta;
};

type UseFetchOrdersProps = {
  limit: number;
  page: number;
};

type UseCheckoutMutation = {
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
};

type UseFetchOrders = (props: UseFetchOrdersProps) => {
  data: OrderListResponse | undefined;
  error: Error | null;
  isLoading: boolean;
};

type UpdateOrderStatus = {
  orderId: string;
  status: OrderStatus;
};
