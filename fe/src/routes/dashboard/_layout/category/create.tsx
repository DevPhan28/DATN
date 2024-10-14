import Header from '@/components/layoutAdmin/header/header';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import instance from '@/api/axiosIntance';

export const Route = createFileRoute('/dashboard/_layout/category/create')({
  component: AddCategory
});


function AddCategory() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Category>({
    defaultValues: {
      name: ''
    }
  });

  const onCreateCategory: SubmitHandler<Category> = async (data) => {
    try {
      // Send API request to create category
      await instance.post('/categorys', { name: data.name });
      
      // Redirect to categories list after creation
      navigate({ to: '/dashboard/category' });
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Create New Category" pathname="/" />
      <form onSubmit={handleSubmit(onCreateCategory)} className="m-8">
        <div className="my-3 flex justify-between">
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-ui-fg-subtle hover:cursor-pointer"
              onClick={() => navigate({ to: '/dashboard/category' })}
            >
              Category List
            </button>
            <button
              type="submit"
              className="text-sm font-medium text-ui-fg-subtle"
            >
              Create New
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => navigate({ to: '/dashboard/category' })}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Category
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">
            General Information
          </h1>
          <p className="text-sm mb-4 font-normal text-ui-fg-subtle">
            Provide the category name.
          </p>

          <div className="space-y-4">
            {/* Category Name */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Category Name
                </label>
                <Input
                  placeholder="Type here"
                  size="base"
                  {...register('name', { required: 'Category name is required' })}
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
