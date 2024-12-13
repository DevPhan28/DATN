import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../stores/key';
import instance from '@/api/axiosIntance';
import { Coupon } from '@/types/coupon';

// Hàm fetch danh sách mã giảm giá từ API
export const fetchCoupons = async (params: CouponParams) => {
  try {
    console.log('Fetching coupons with params:', params);
    const res = await instance.get<{ data: Coupon[]; meta: MetaData }>('/get-coupon', { params });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Error while fetching coupons - status code: ${res.status}`);
    }

    return res.data;
  } catch (error: any) {
    console.error('Error while fetching coupons:', error.message);
    throw new Error('Error while fetching coupons');
  }
};

// Hook `useFetchCoupons` để gọi API và lấy danh sách mã giảm giá
export const useFetchCoupons = (params: CouponParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.FETCH_COUPONS, params],
    queryFn: () => fetchCoupons(params),
    enabled: !!params,
  });
};

// Hàm fetch chi tiết mã giảm giá bằng ID
export const fetchCouponById = async (_id: string): Promise<Coupon> => {
  try {
    const res = await instance.get<{ data: Coupon }>(`/coupon/${_id}`);
    if (res.status !== 200) {
      throw new Error('Error while fetching coupon');
    }
    return res.data;
  } catch (error) {
    console.error('Error while fetching coupon:', error);
    throw error;
  }
};

// Hook `useFetchCouponById` để lấy chi tiết mã giảm giá
export const useFetchCouponById = (_id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.FETCH_COUPON, _id],
    queryFn: () => fetchCouponById(_id),
    enabled: !!_id,
  });
};

// Hàm fetch danh sách mã giảm giá hợp lệ từ API
export const fetchAvailableCoupons = async (orderAmount: number): Promise<Coupon[]> => {
  try {
    const res = await instance.get('/available-coupon', {
      params: { orderAmount },
    });

    if (res.status !== 200) {
      throw new Error(`Error while fetching available coupons - status: ${res.status}`);
    }

    // Kiểm tra nếu response có cấu trúc dữ liệu mong đợi
    if (!Array.isArray(res.data)) {
      throw new Error('Invalid response format from server.');
    }

    return res.data;
  } catch (error: any) {
    console.error('Error fetching available coupons:', error.message);
    throw error;
  }
};


// Hook `useFetchAvailableCoupons` để lấy danh sách mã giảm giá hợp lệ
export const useFetchAvailableCoupons = (orderAmount: number) => {
  return useQuery({
    queryKey: ['availableCoupons', orderAmount],
    queryFn: () => fetchAvailableCoupons(orderAmount),
    enabled: !!orderAmount,
    onError: (error) => {
      console.error('Failed to fetch available coupons:', error);
    },
  });
};
