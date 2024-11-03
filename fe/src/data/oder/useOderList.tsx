import { useQuery } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { QUERY_KEY } from '../stores/key';
import { useEffect, useState } from 'react';

// Hàm fetch đơn hàng từ API
export const fetchOrders = async (params: any) => {
  try {
    console.log('Fetching orders with params:', params); // Log các tham số request
    const res = await instance.get<{
      data: Order[];
      meta: MetaData;
    }>('/orders', { params });

    console.log('Response from server:', res); // Log chi tiết response từ server

    // Kiểm tra mã trạng thái
    if (res.status !== 200 && res.status !== 201) {
      console.error('Unexpected status code:', res.status, res.statusText);
      throw new Error(
        `Error while fetching orders - status code: ${res.status}`
      );
    }

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

// Hook `useFetchOrders` sử dụng `useQuery` để gọi API
export const useFetchOrders = (params: any) => {
  return useQuery({
    queryKey: [QUERY_KEY.FETCH_ORDERS, params],
    queryFn: () => fetchOrders(params),
    enabled: !!params,
  });
};

// Hook `useFetchOrderAll` để lấy tất cả đơn hàng
export const useFetchOrderAll = () => {
  const [listOrder, setListOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await instance.get('/orders');
        setListOrder(response.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  return { listOrder, loading, error };
};

export const fetchOrdersByUserId = async (userId) => {
  try {
    const res = await instance.get(`/orders/${userId}`);

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(
        `Error while fetching orders - status code: ${res.status}`
      );
    }

    return res.data;
  } catch (error) {
    console.error("Error while fetching orders:", error);
    throw new Error('Error while fetching orders');
  }
};

// Hook `useFetchOrdersByUserId` để gọi API lấy đơn hàng của người dùng theo `userId`
export const useFetchOrdersByUserId = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEY.FETCH_ORDERS_BY_USER, userId],
    queryFn: () => fetchOrdersByUserId(userId),
    enabled: !!userId, // Chỉ kích hoạt khi `userId` có giá trị
  });
};