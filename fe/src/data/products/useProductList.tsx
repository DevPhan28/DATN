import { useQuery } from '@tanstack/react-query';
import instance from "@/api/axiosIntance";
import { QUERY_KEY } from "../stores/key";

// Hàm fetch sản phẩm từ API
export const fetchProduct = async (params: ProductParams) => {
    try {
        console.log("Fetching products with params:", params); // Log các tham số request
        const res = await instance.get<{
            data: Product[];
            meta: MetaData;
        }>('/products', { params });

        console.log("Response from server:", res); // Log chi tiết response từ server

        // Thay đổi điều kiện kiểm tra để chấp nhận cả mã 200 và 201
        if (res.status !== 200 && res.status !== 201) {
            console.error("Unexpected status code:", res.status, res.statusText);
            throw new Error(`Error while fetching products - status code: ${res.status}`);
        }

        return res.data;
    } catch (error: any) {
        // Log chi tiết lỗi để kiểm tra thêm
        if (error.response) {
            console.error("Response error:", error.response.data);
        } else {
            console.error("Request error:", error.message);
        }
        throw new Error('Error while fetching products');
    }
};



// Hook `useFetchProducts` sử dụng `useQuery` để gọi API
export const useFetchProducts = (params: ProductParams) => {
    return useQuery({
        queryKey: [QUERY_KEY.FETCH_PRODUCT, params],
        queryFn: () => fetchProduct(params),
        enabled: !!params, // Chỉ thực hiện khi params không null hoặc undefined
    });
};
