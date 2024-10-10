import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/data/stores/key.ts'
import instance from '@/api/axiosIntance'

const useProductMutation = (
    setProductId: React.Dispatch<React.SetStateAction<string>>,
    setStep: React.Dispatch<React.SetStateAction<number>>
) => {
    const queryClient = useQueryClient()

    const createProduct = useMutation({
        mutationFn: (data: Product) =>
            instance.post<{ id: string }>('/products', data),

        onSuccess: async (result) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.FETCH_PRODUCT],
            })

            setProductId(result.data.id)
            setStep((prev) => Math.min(prev + 1, 2))

            return result
        },
    })

    return { createProduct }
}

export default useProductMutation
