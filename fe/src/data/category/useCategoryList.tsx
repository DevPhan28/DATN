import { useQuery } from '@tanstack/react-query';
import instance from "@/api/axiosIntance";
import { QUERY_KEY } from "../stores/key";

// Hàm fetch danh mục từ API
export const fetchCategory = async (params: CategoryParams) => {
    try {
        console.log("Fetching categories with params:", params); // Log các tham số request
        const res = await instance.get<{
            data: Category[];
            meta: MetaData;
        }>('/categorys', { params });  

        console.log("Response from server:", res); // Log chi tiết response từ server

        if (res.status !== 200 && res.status !== 201) {
            console.error("Unexpected status code:", res.status, res.statusText);
            throw new Error(`Error while fetching categories - status code: ${res.status}`);
        }

        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Response error:", error.response.data);
        } else {
            console.error("Request error:", error.message);
        }
        throw new Error('Error while fetching categories');
    }
};

// Hook `useFetchCategories` sử dụng `useQuery` để gọi API
export const useFetchCategories = (params: CategoryParams) => {
    return useQuery({
        queryKey: [QUERY_KEY.FETCH_CATEGORIES, params],
        queryFn: () => fetchCategory(params),
        enabled: !!params,
    });
};
