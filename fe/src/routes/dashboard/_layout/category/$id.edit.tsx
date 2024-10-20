import instance from '@/api/axiosIntance';
import Header from '@/components/layoutAdmin/header/header';
import { useFetchCategoryById } from '@/data/category/useCategoryList';
import useCategoryMutation from '@/data/category/useCategoryMutation';
import { useFetchCategory } from '@/data/products/useProductList';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Define the Route with corrected loader
export const Route = createFileRoute('/dashboard/_layout/category/$id/edit')({
  loader: async ({ params }) => {
    const { id } = params;
    console.log('Loader called with id:', id); // Debug
    if (!id) {
      throw new Error('Category ID is missing');
    }
    try {
      const response = await instance.get(`categorys/${id}`); // Ensure correct endpoint
      console.log('Loader response data:', response.data); // Debug
      return response.data as Category; // Return single Category
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Response('Failed to fetch category', { status: 500 });
    }
  },
  component: EditCategory
});

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/dashboard/_layout/category/$id/edit' }); // Get ID from URL params

  const { updateCategory } = useCategoryMutation();

  // Access loader data using useRouteLoaderData
  const categories = Route.useLoaderData();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Category>({
    defaultValues: {
      name: '' // Default value for the category name
    }
  });

  // Populate the form with the fetched category data
  useEffect(() => {
    if (categories) {
      // Use setValue to update individual fields in the form
      setValue('name', categories.name);
    }
  }, [categories, setValue]);

  const onUpdateCategory: SubmitHandler<Category> = async (data) => {
    try {
      // Call API to update category
      await updateCategory.mutateAsync({ id, data });
      // Navigate back to the category list after updating
      navigate({ to: '/dashboard/category' });
    } catch (error) {
      console.error('Failed to update category:', error);
      // Optionally, display an error message to the user
    }
  };

  // Handle cases where category data might not be available
  if (!categories) return <div>Loading...</div>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Edit Category" pathname="/" />
      <form onSubmit={handleSubmit(onUpdateCategory)} className="m-8">
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
              Save Changes
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => navigate({ to: '/dashboard/category' })}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Category
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">
            General Information
          </h1>
          <p className="text-sm mb-4 font-normal text-ui-fg-subtle">
            Update the category name.
          </p>

          <div className="space-y-4">
            {/* Category Name Input */}
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
                {errors.name && (
                  <span className="text-red-500 text-xs">{errors.name.message}</span>
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
