import Header from '@/components/layoutAdmin/header/header';
import useCouponMutation from '@/data/coupon/useCouponMutation';
import { Button, Input, Select, DatePicker } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/dashboard/_layout/coupon/create')({
  component: AddCoupon,
});

interface CouponFormValues {
  code: string;
  discount: number;
  minOrder: number;
  expirationDate: string;
  isActive: boolean;
  isFreeShipping: boolean;
}

function AddCoupon() {
  const navigate = useNavigate();
  const { createCoupon } = useCouponMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>();

  const onCreateCoupon: SubmitHandler<CouponFormValues> = async (data) => {
    try {
      // Gọi API để tạo mã giảm giá mới
      createCoupon.mutate(data);
      navigate({ to: '/dashboard/coupon' });
    } catch (error) {
      console.error('Failed to create coupon', error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Create New Coupon" pathname="/" />
      <form onSubmit={handleSubmit(onCreateCoupon)} className="m-8">
        <div className="my-3 flex justify-between">
          <div className="w-[330px]">
            <Input
              placeholder="Search"
              id="search-input"
              size="small"
              type="search"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => navigate({ to: '/dashboard/coupon' })}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Coupon
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">Coupon Information</h1>
          <p className="mb-4 text-sm font-normal text-ui-fg-subtle">
            Enter the coupon details such as code, discount, expiration date, and status.
          </p>

          <div className="space-y-4">
            {/* Coupon Code */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Coupon Code
                </label>
                <Input
                  placeholder="e.g., FREESHIP"
                  size="base"
                  {...register('code', {
                    required: 'Coupon code is required',
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
                  <span className="text-ui-tag-red-text">*</span> Discount (%)
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
                  <span className="text-ui-tag-red-text">*</span> Free Shipping
                </label>
                <Select
                  onValueChange={(value) => setValue('isFreeShipping', value === 'true')}
                  defaultValue="false"
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
                  <span className="text-ui-tag-red-text">*</span> Expiration Date
                </label>
                <DatePicker
                  placeholder="Select expiration date"
                  onChange={(date) => setValue('expirationDate', date)}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Status
                </label>
                <Select
                  onValueChange={(value) => setValue('isActive', value === 'true')}
                  defaultValue="true"
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select status" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="true">Active</Select.Item>
                    <Select.Item value="false">Inactive</Select.Item>
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

export default AddCoupon;
