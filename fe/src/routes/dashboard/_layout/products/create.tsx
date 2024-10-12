import Header from '@/components/layoutAdmin/header/header';
import { Button, Input, Select, Textarea } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { ArrowDownTray, PlayMiniSolid, XMark } from '@medusajs/icons';
import instance from '@/api/axiosIntance';
import useProductMutation from '@/data/products/useProductMutation';
import axios from 'axios';

export const Route = createFileRoute('/dashboard/_layout/products/create')({
  loader: async () => {
    const response = await instance.get('categories');

    return response.data as Category[];
  },
  component: AddBrand,
});

function AddBrand() {
  const navigate = useNavigate();

  const categories = Route.useLoaderData();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<{
    name: string;
    price: number;
    image: string;
    category: string[];
    gallery?: string[];
    description: string;
    discount: number;
    variants: Variant[];
  }>({
    defaultValues: {
      variants: [{ size: '', color: '', price: 0, countInStock: 0, sku: '' }],
    },
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createProduct } = useProductMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
      } else {
        setSelectedImage(null);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (size: number) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(2)}KB`
      : `${(size / (1024 * 1024)).toFixed(2)}MB`;
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onCreateBrand: SubmitHandler<{
    name: string;
    price: number;
    image: string;
    category: string[];
    gallery?: string[];
    description: string;
    discount: number;
    variants: Variant[];
  }> = async data => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/upload-thumbnail-product`,
        formData
      );

      if (response?.data) {
        createProduct.mutate({
          ...data,
          image: response.data,
        });
      }
    } catch (error) {
      throw new Error('Failed to upload image');
    }

    // const formData = new FormData();

    // formData.append('brand_name', data.name); // Sửa tên trường
    // formData.append('price', data.price.toString());
    // formData.append('category', data.category.name); // Sửa tên trường nếu cần
    // formData.append('discount', data.discount.toString());
    // formData.append('description', data.description);

    // data.variants.forEach((variant, index) => {
    //   formData.append(`variants[${index}][size]`, variant.size);
    //   formData.append(`variants[${index}][color]`, variant.color);
    //   formData.append(`variants[${index}][price]`, variant.price.toString());
    //   formData.append(
    //     `variants[${index}][countInStock]`,
    //     variant.countInStock.toString()
    //   );
    //   formData.append(`variants[${index}][sku]`, variant.sku);
    // });

    // if (selectedImage) {
    //   formData.append('file', selectedImage);
    // }

    // try {
    //   // Gọi API để tạo sản phẩm
    //   await instance.post('/products', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   navigate({ to: '/dashboard/products/create' }); // Chuyển hướng sau khi tạo
    // } catch (error) {
    //   console.error('Failed to create brand:', error);
    // }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Create New Brand" pathname="/" />
      <form onSubmit={handleSubmit(onCreateBrand)} className="m-8">
        <div className="my-3 flex justify-between">
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-ui-fg-subtle hover:cursor-pointer"
            >
              Brand List
            </button>
            <PlayMiniSolid className="text-ui-fg-subtle" />
            <button
              type="submit"
              className="text-sm font-medium text-ui-fg-subtle"
            >
              Create New
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Brand
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-ui-bg-base p-7">
          <h1 className="text-2xl font-medium text-ui-fg-base">
            General Information
          </h1>
          <p className="mb-4 text-sm font-normal text-ui-fg-subtle">
            Provide the basic brand details like name, category, price,
            discount, and description.
          </p>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Product Name
                </label>
                <Input
                  placeholder="Type here"
                  size="base"
                  {...register('name', {
                    required: 'Product name is required',
                  })}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-ui-fg-subtle"
              >
                Image
              </label>
              <p className="mb-2 text-xs text-ui-fg-muted">
                Max file size is 500KB. Supports .jpg and .png formats.
              </p>
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-ui-border-strong p-8"
                onClick={handleClick}
              >
                <div className="mb-2 flex items-center">
                  <ArrowDownTray className="mr-1 h-5 w-5" />
                  <p className="text-xs font-medium text-ui-fg-base">
                    Import Files
                  </p>
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    accept=".jpg, .png"
                    onChange={handleImageChange}
                    multiple={false}
                    className="hidden cursor-pointer"
                  />
                </div>
                <p className="mb-2 text-center text-xs text-ui-fg-muted">
                  Drag and drop files here or click to upload
                </p>
              </button>
              <div className="mt-5">
                {selectedImage && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border bg-ui-bg-subtle-hover px-2 py-3">
                    <div>
                      <p className="text-sm font-normal text-ui-fg-base">
                        {selectedImage.name}
                      </p>
                      <p className="text-xs font-normal text-ui-fg-subtle">
                        {formatFileSize(selectedImage.size)}
                      </p>
                    </div>
                    <XMark
                      className="cursor-pointer"
                      onClick={() => setSelectedImage(null)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 199.99"
                  size="base"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                />
                {errors.price && (
                  <span className="text-xs text-red-500">
                    {errors.price.message}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  <span className="text-ui-tag-red-text">*</span> Category
                </label>
                <div className="w-[256px]">
                  {categories.length > 0 ? (
                    <div className="w-[256px]">
                      <Select>
                        <Select.Trigger>
                          <Select.Value placeholder="Select a currency" />
                        </Select.Trigger>
                        <select {...register('category')}>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </Select>
                    </div>
                  ) : (
                    <>No Categories</>
                  )}
                </div>

                {/* <Input
                  placeholder="Type here"
                  size='base'
                  {...register('category', { required: 'Category is required' })}
                /> */}
                {errors.category && (
                  <span className="text-xs text-red-500">
                    {errors.category.message}
                  </span>
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
                  step="0.01"
                  placeholder="e.g., 10"
                  size="base"
                  {...register('discount', {
                    required: 'Discount is required',
                    min: { value: 0, message: 'Discount must be positive' },
                  })}
                />
                {errors.discount && (
                  <span className="text-xs text-red-500">
                    {errors.discount.message}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex space-x-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-ui-fg-base">
                  Description
                </label>
                <Textarea
                  placeholder="Type here"
                  {...register('description')}
                />
              </div>
            </div>

            {/* Variants */}
            <div>
              <h2 className="text-lg font-medium text-ui-fg-base">
                Product Variants
              </h2>
              {fields.map((field, index) => (
                <div key={field.id} className="mt-4 flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Size"
                      {...register(`variants.${index}.size`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Color"
                      {...register(`variants.${index}.color`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Price"
                      {...register(`variants.${index}.price`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Count in Stock"
                      {...register(`variants.${index}.countInStock`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="SKU"
                      {...register(`variants.${index}.sku`)}
                    />
                  </div>
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  append({
                    size: '',
                    color: '',
                    price: 0,
                    countInStock: 0,
                    sku: '',
                  })
                }
              >
                Add Variant
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddBrand;
