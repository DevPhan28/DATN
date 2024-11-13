import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import instance from '@/api/axiosIntance';
import { QUERY_KEY } from '../stores/key';

interface Order {
  id: string;
  totalPrice: number;
  status: string;
}

interface MetaData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface OrdersResponse {
  data: Order[];
  meta: MetaData;
  statusCounts: Record<string, number>; 
  totalDeliveredAmount: number; 
}

// Hàm lấy tất cả đơn hàng với các tham số
export const fetchOrders = async (params: any): Promise<OrdersResponse> => {
  try {
    console.log('Fetching orders with params:', params);
    const res = await instance.get<OrdersResponse>('/orders', { params });

    if (res.status !== 200 && res.status !== 201) {
      console.error('Unexpected status code:', res.status, res.statusText);
      throw new Error(`Error while fetching orders - status code: ${res.status}`);
    }

    console.log('Response from server:', res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
    throw new Error('Error while fetching orders');
  }
};

// Hook lấy đơn hàng với tham số từ query
export const useFetchOrders = (params: any) => {
  const query = useQuery({
    queryKey: [QUERY_KEY.FETCH_ORDERS, params],
    queryFn: () => fetchOrders(params),
    enabled: !!params,
  });

  return {
    ...query,
    totalDeliveredAmount: query.data?.totalDeliveredAmount || 0, 
    statusCounts: query.data?.statusCounts || {},  // Sửa lại để trả về toàn bộ statusCounts
  };
};

// Hook lấy số lượng đơn hàng thành công
export const useFetchSuccessfulOrderCount = () => {
  return useQuery({
    queryKey: ["successfulOrderCount"],
    queryFn: async () => {
      const { data } = await instance.get("/count-successful-orders"); // Đảm bảo endpoint chính xác
      return {
        successfulOrders: data.successfulOrders,
        totalDeliveredAmount: data.totalDeliveredAmount,
      };
    },
  });
};


// Hook lấy tất cả đơn hàng
export const useFetchOrderAll = () => {
  const [listOrder, setListOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDeliveredAmount, setTotalDeliveredAmount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});  // Thêm trạng thái đếm đơn hàng

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await fetchOrders({});
        setListOrder(response.data);
        setTotalDeliveredAmount(response.totalDeliveredAmount);
        setStatusCounts(response.statusCounts);  // Lưu lại statusCounts
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  return { listOrder, loading, error, totalDeliveredAmount, statusCounts };
};

// Hàm lấy đơn hàng theo userId
export const fetchOrdersByUserId = async (userId: string): Promise<OrdersResponse> => {
  try {
    console.log(`Fetching orders for userId: ${userId}`);
    const res = await instance.get<OrdersResponse>(`/orders/${userId}`);

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Error while fetching orders - status code: ${res.status}`);
    }

    return res.data;
  } catch (error: any) {
    console.error("Error while fetching orders by userId:", error.message);
    throw new Error('Error while fetching orders');
  }
};

// Hook lấy đơn hàng theo userId
export const useFetchOrdersByUserId = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.FETCH_ORDERS_BY_USER, userId],
    queryFn: () => fetchOrdersByUserId(userId),
    enabled: !!userId, 
  });
};
