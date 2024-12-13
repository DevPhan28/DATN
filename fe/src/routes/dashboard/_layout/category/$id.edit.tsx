import instance from '@/api/axiosIntance';
import Header from '@/components/layoutAdmin/header/header';
import useCategoryMutation from '@/data/category/useCategoryMutation';
import { Button, Input } from '@medusajs/ui';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export const Route = createFileRoute('/dashboard/_layout/category/$id/edit')({
  loader: async ({ params }) => {
    const { id } = params;
    if (!id) {
      throw new Error('ID danh mục bị thiếu');
    }
    try {
      const response = await instance.get(`categorys/${id}`);
      return response.data as Category;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin danh mục:', error);
      throw new Response('Không thể tải thông tin danh mục', { status: 500 });
    }
  },
  component: EditCategory,
});

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/dashboard/_layout/category/$id/edit' });

  const { updateCategory } = useCategoryMutation();

  const categories = Route.useLoaderData();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Category>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (categories) {
      setValue('name', categories.name);
    }
  }, [categories, setValue]);

  const onUpdateCategory: SubmitHandler<Category> = async (data) => {
    try {
      await updateCategory.mutateAsync({ id, data });
      navigate({ to: '/dashboard/category' });
    } catch (error) {
      console.error('Cập nhật danh mục thất bại:', error);
    }
  };

  if (!categories) return <div>Đang tải thông tin danh mục...</div>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Chỉnh sửa danh mục" pathname="/" />
      <form onSubmit={handleSubmit(onUpdateCategory)} className="m-8">
        <div className="my-3 flex justify-between">
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-ui-fg-subtle hover:cursor-pointer"
              onClick={() => navigate({ to: '/dashboard/category' })}
            >
              Danh sách danh mục
            </button>
            <button
              type="submit"
              className="text-sm font-medium text-ui-fg-subtle"
            >
              Lưu thay đổi
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate({ to: '/dashboard/category' })}
            >
              Hủy bỏ
            </Button>
            <Button variant="primary" type="submit">
              Cập nhật danh mục
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">
            Thông tin chung
          </h1>
          <p className="mb-4 text-sm font-normal text-ui-fg-subtle">
            Cập nhật tên danh mục.
          </p>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Tên danh mục
                </label>
                <Input
                
                  placeholder="Nhập tên danh mục"
                  size="base"
                  {...register('name', {
                    required: 'Tên danh mục là bắt buộc',
                  })}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCategory;
