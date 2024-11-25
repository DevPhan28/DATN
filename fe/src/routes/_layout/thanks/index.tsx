import instance from '@/api/axiosIntance';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { AxiosError } from 'axios';
import * as z from 'zod';

// Định nghĩa route với validateSearch
export const Route = createFileRoute('/_layout/thanks/')({
  component: ReturnPage,
  validateSearch: z
    .object({
      status: z.union([z.string(), z.number()]).optional(),
      apptransid: z.union([z.string(), z.number()]), // Chấp nhận cả string và number
      // Chấp nhận cả string và number
    })
    .transform(query => ({
      ...query,
      status: query.status?.toString(),
      apptransid: query.apptransid?.toString(), // Chuyển về chuỗi sau khi validate
      // Chuyển về chuỗi sau khi validate
    })).parse,
});

function ReturnPage() {
  const navigate = useNavigate();
  const { status, apptransid } = useSearch({ from: '/_layout/thanks/' });
  const orderId = apptransid.split('_')[2].trim();
  const isSuccess = status === '1'; 
  const message = isSuccess
    ? 'Thanh toán thành công! Cảm ơn bạn đã đặt hàng.'
    : 'Thanh toán đã bị hủy. Vui lòng thử lại.';

  const subMessage = isSuccess
    ? 'Bạn có thể kiểm tra thông tin đơn hàng trong "Đơn mua".'
    : 'Nếu bạn cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng.';

  // Gọi API và cập nhật trạng thái thanh toán
  const updatePaymentStatus = async (orderId: string, status: string) => {
    console.log('////// update status fail');
    try {
      // Kiểm tra xem giá trị status có hợp lệ không
      if (status !== 'failed') {
        throw new Error('Invalid status parameter');
      }

      const response = await instance.post('/update-payment-status', {
        orderId,
        status,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update payment status');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error during API call:', error.message);
      }
      throw error;
    }
  };

  const paymentStatus = 'failed';

  // Cập nhật trạng thái thanh toán qua API
  updatePaymentStatus(orderId, paymentStatus)
    .then(() => {
      // Điều hướng đến trang Thanks sau khi cập nhật trạng thái
      navigate({
        to: `/thanks`,
        search: {
          status: '1',
          apptransid,
        },
      });
    })
    .catch(error => {
      // Nếu có lỗi xảy ra, bạn có thể xử lý tại đây
      console.error('Error during payment status update:', error);
    });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="max-w-2xl rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div
            className={`${isSuccess ? 'bg-blue-500' : 'bg-red-500'
              } rounded-full p-4`}
          >
            {isSuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{message}</h2>
        <p className="mt-2 text-gray-500">{subMessage}</p>

        <div className="mt-6 flex justify-center gap-4">
          {isSuccess ? (
            <>
              <Link
                to="/orderuser"
                className="rounded-md bg-gray-500 px-6 py-2 text-white hover:bg-black"
              >
                ĐƠN MUA
              </Link>
              <Link
                to="/shop"
                className="rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-black"
              >
                TIẾP TỤC MUA SẮM
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/checkout"
                className="rounded-md bg-green-500 px-6 py-2 text-white hover:bg-black"
              >
                THANH TOÁN LẠI
              </Link>
              <Link
                to="/shop"
                className="rounded-md bg-gray-500 px-6 py-2 text-white hover:bg-black"
              >
                TRỞ LẠI CỬA HÀNG
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}