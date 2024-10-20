import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/data/stores/key.ts'
import instance from '@/api/axiosIntance'

// Hook để thực hiện CRUD cho danh mục
const useCategoryMutation = (
    setCategoryId?: React.Dispatch<React.SetStateAction<string>>,
    setStep?: React.Dispatch<React.SetStateAction<number>>
) => {
    const queryClient = useQueryClient()

    // Tạo danh mục (Create Category)
    const createCategory = useMutation({
        mutationFn: (data: Category) =>
            instance.post('/categories', data),

        onSuccess: async (result) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.FETCH_CATEGORIES],
            })

            if (setCategoryId) {
                setCategoryId(result.data.id)
            }
            if (setStep) {
                setStep((prev) => Math.min(prev + 1, 2))
            }

            return result
        },
    })

    // Cập nhật danh mục (Update Category)
    const updateCategory = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Category }) =>
            instance.put(`/categorys/${id}`, data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.FETCH_CATEGORIES],
            })
        },
    })

    // Xóa danh mục (Delete Category)
    const deleteCategory = useMutation({
        mutationFn: (id: string) =>
            instance.delete(`/categories/${id}`),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.FETCH_CATEGORIES],
            })
        },
    })

    return { createCategory, updateCategory, deleteCategory }
}

export default useCategoryMutation
