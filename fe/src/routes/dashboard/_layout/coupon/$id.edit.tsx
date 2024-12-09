import Header from '@/components/layoutAdmin/header/header';
import useCouponMutation from '@/data/coupon/useCouponMutation';
import { Button, Input, Select, DatePicker } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import instance from '@/api/axiosIntance';

export const Route = createFileRoute('/dashboard/_layout/coupon/$id/edit')({
  loader: async ({ params }: { params: RouteParams }) => {
    const { id } = params;
    if (!id) {
      throw new Error('Coupon ID is required');
    }
    const response = await instance.get(`get-coupon/${id}`);
    return response.data;
  },
  component: EditCoupon,
});

interface CouponFormValues {
  _id: string;
  code: string;
  discount: number;
  minOrder: number;
  expirationDate: string;
  isActive: boolean;
  isFreeShipping: boolean;
}

function EditCoupon() {
  const navigate = useNavigate();
  const { editCoupon } = useCouponMutation();
  const couponData = Route.useLoaderData<CouponFormValues>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    defaultValues: {
      _id: '',
      code: '',
      discount: 0,
      expirationDate: '',
      isActive: true,
      isFreeShipping: false,
    },
  });

  useEffect(() => {
    if (couponData) {
      setValue('_id', couponData._id);
      setValue('code', couponData.code);
      setValue('discount', couponData.discount);
      setValue('expirationDate', couponData.expirationDate);
      setValue('isActive', couponData.isActive);
      setValue('isFreeShipping', couponData.isFreeShipping);
    }
  }, [couponData, setValue]);

  console.log('log data', couponData);
  
  const onEditCoupon: SubmitHandler<CouponFormValues> = async (data) => {
    try {
      editCoupon.mutate(data);
      navigate({ to: '/dashboard/coupon' });
    } catch (error) {
      console.error('Failed to update coupon', error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Edit Coupon" pathname="/dashboard/coupons" />
      <form onSubmit={handleSubmit(onEditCoupon)} className="m-8">
        <div className="my-3 flex justify-between">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate({ to: '/dashboard/coupon' })}
          >
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Lưu thay đổi
          </Button>
        </div>

        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">Thông tin phiếu giảm giá</h1>
          <p className="mb-4 text-sm font-normal text-ui-fg-subtle">
           
Cập nhật chi tiết phiếu giảm giá như mã, giảm giá, ngày hết hạn và trạng thái.
          </p>

          <div className="space-y-4">
            {/* Coupon Code */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  Phiếu giảm giá
                </label>
                <Input
                  placeholder="e.g., FREESHIP"
                  size="base"
                  {...register('code', {
                    required: 'Cần phiếu giảm giá',
                  })}
                />
                {errors.code && (
                  <span className="text-xs text-red-500">{errors.code.message}</span>
                )}
              </div>
            </div>

            {/* Discount */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  Giảm giá (%)
                </label>
                <Input
                  type="number"
                  step="1"
                  placeholder="e.g., 10"
                  size="base"
                  {...register('discount', {
                    required: 'Discount is required',
                    min: { value: 0, message: 'Discount must be positive' },
                  })}
                />
                {errors.discount && (
                  <span className="text-xs text-red-500">{errors.discount.message}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Min Order
                </label>
                <Input
                  type="number"
                  step="1"
                  placeholder="e.g., 10"
                  size="base"
                  {...register('minOrder', {
                    required: 'minOrder is required',
                    min: { value: 0, message: 'minOrder must be positive' },
                  })}
                />
                {errors.discount && (
                  <span className="text-xs text-red-500">{errors.discount.message}</span>
                )}
              </div>
            </div>
            {/* Free Shipping */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                 free ship
                </label>
                <Select
                  defaultValue={String(couponData.isFreeShipping)}
                  onValueChange={(value) => setValue('isFreeShipping', value === 'true')}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select an option" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="true">Yes</Select.Item>
                    <Select.Item value="false">No</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>

            {/* Expiration Date */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                Ngày hết hạn
                </label>
                <DatePicker
                  selectedDate={new Date(couponData.expirationDate)}
                  onDateChange={(date) => setValue('expirationDate', date.toISOString())}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  Trạng thái
                </label>
                <Select
                  defaultValue={String(couponData.isActive)}
                  onValueChange={(value) => setValue('isActive', value === 'true')}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select status" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="true">Áp dụng</Select.Item>
                    <Select.Item value="false">Hủy áp dụng</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCoupon;
