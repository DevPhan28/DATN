import instance from '@/api/axiosIntance';
import Header from '@/components/layoutAdmin/header/header';
import useProductMutation from '@/data/products/useProductMutation';
import { ArrowDownTray, PlusMini, Trash, XMark } from '@medusajs/icons';
import { Button, Input, Select, Textarea } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useRef, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

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
    control,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
    price: number;
    image: string;
    category: string;
    gallery?: string[];
    description: string;
    totalCountInStock: number;
    discount: number;
    variants: Variant[];
  }>({
    defaultValues: {
      variants: [{ size: '', color: '', price: 0, countInStock: 0, sku: '' }],
    },
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<File[] | []>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const { createProduct } = useProductMutation();

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedGallery: File[] = [];
    if (e.target.files && e.target.files.length > 0) {
      // const file = e.target.files[];
      for (let file of e.target.files) {
        selectedGallery.push(file);
      }
      setSelectedGallery(selectedGallery);
    }
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
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

  const onCreateProduct: SubmitHandler<{
    name: string;
    price: number;
    image: string;
    category: string[];
    gallery?: string[];
    description: string;
    totalCountInStock: number;
    discount: number;
    variants: Variant[];
  }> = async data => {
    if (!selectedImage) return;

    const totalCountInStock = data.variants.reduce((total, variant) => {
      console.log(typeof variant.countInStock);
      return total + Number(variant.countInStock);
    }, 0);

    const formDataThumbnail = new FormData();
    const formDataGallery = new FormData();
    formDataThumbnail.append('image', selectedImage);
    for (let file of selectedGallery) {
      formDataGallery.append('photos', file);
    }

    try {
      const [responseThumbnail, responseGallery] = await Promise.all([
        await axios.post(
          `http://localhost:8080/api/upload-thumbnail-product`,
          formDataThumbnail
        ),
        await axios.post(
          `http://localhost:8080/api/upload-gallery-product`,
          formDataGallery
        ),
      ]);
      if (responseThumbnail?.data && responseGallery.data) {
        createProduct.mutate({
          ...data,
          image: responseThumbnail.data,
          gallery: responseGallery.data,
          totalCountInStock: totalCountInStock,
        });
        reset();
      }
      console.log('totalCountInStock', totalCountInStock);
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Create New Products" pathname="/" />
      <form onSubmit={handleSubmit(onCreateProduct)} className="m-8">
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
            <Button variant="secondary" type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create New
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
              <label className="block text-sm font-medium text-ui-fg-base">
                <span className="text-ui-tag-red-text">*</span> Image
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
                    onChange={handleThumbnailChange}
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
                <div className="w-full">
                  <Select
                    onValueChange={value => setValue('category', value)}
                    defaultValue=""
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select a category" />
                    </Select.Trigger>
                    <Select.Content>
                      {categories.map(category => (
                        <Select.Item key={category._id} value={category._id}>
                          {category.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
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
                  <span className="text-ui-tag-red-text">*</span> Description
                </label>
                <Textarea
                  placeholder="Type here"
                  {...register('description')}
                />
              </div>
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="block text-sm font-medium text-ui-fg-base">
                <span className="text-ui-tag-red-text">*</span> Gallerry
              </label>
              <p className="mb-2 text-xs text-ui-fg-muted">
                Max file size is 500KB. Supports .jpg and .png formats.
              </p>
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-ui-border-strong p-8"
                onClick={() => fileInput2Ref.current?.click()}
              >
                <div className="mb-2 flex items-center">
                  <ArrowDownTray className="mr-1 h-5 w-5" />
                  <p className="text-xs font-medium text-ui-fg-base">
                    Import Files
                  </p>
                  <input
                    type="file"
                    id="photos"
                    multiple
                    ref={fileInput2Ref}
                    accept=".jpg, .png"
                    onChange={handleGalleryChange}
                    className="hidden cursor-pointer"
                  />
                </div>
                <p className="mb-2 text-center text-xs text-ui-fg-muted">
                  Drag and drop files here or click to upload
                </p>
              </button>
              <div className="mt-5">
                {selectedGallery.length > 0 &&
                  selectedGallery.map(item => (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border bg-ui-bg-subtle-hover px-2 py-3">
                      <div>
                        <p className="text-sm font-normal text-ui-fg-base">
                          {item.name}
                        </p>
                        <p className="text-xs font-normal text-ui-fg-subtle">
                          {formatFileSize(item.size)}
                        </p>
                      </div>
                      <XMark
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedGallery(prev =>
                            prev.filter(file => file.name != item.name)
                          )
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
            {/* Variants */}
            <div>
              <h2 className="mt-5 text-lg font-medium text-ui-fg-base">
                Variants
              </h2>
              <div className="mt-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="mb-4 flex space-x-4">
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-ui-fg-base">
                        <span className="text-ui-tag-red-text">*</span> Size
                      </label>
                      <Input
                        placeholder="e.g., M"
                        size="base"
                        {...register(`variants.${index}.size` as const, {
                          required: 'Size is required',
                        })}
                      />
                      {errors.variants?.[index]?.size && (
                        <span className="text-xs text-red-500">
                          {errors.variants[index].size.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-ui-fg-base">
                        <span className="text-ui-tag-red-text">*</span> Color
                      </label>
                      <Input
                        placeholder="e.g., Red"
                        size="base"
                        {...register(`variants.${index}.color` as const, {
                          required: 'Size is required',
                        })}
                      />
                      {errors.variants?.[index]?.color && (
                        <span className="text-xs text-red-500">
                          {errors.variants[index].color.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-ui-fg-base">
                        <span className="text-ui-tag-red-text">*</span> Price
                        ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 199.99"
                        size="base"
                        {...register(`variants.${index}.price` as const, {
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' },
                        })}
                      />
                      {errors.variants?.[index]?.price && (
                        <span className="text-xs text-red-500">
                          {errors.variants[index].price.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-ui-fg-base">
                        <span className="text-ui-tag-red-text">*</span>{' '}
                        CountInStock
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 100"
                        size="base"
                        {...register(
                          `variants.${index}.countInStock` as const,
                          {
                            required: 'CountInStock is required',
                            min: {
                              value: 0,
                              message: 'CountInStock must be positive',
                            },
                          }
                        )}
                      />
                      {errors.variants?.[index]?.countInStock && (
                        <span className="text-xs text-red-500">
                          {errors.variants[index].countInStock.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-ui-fg-base">
                        <span className="text-ui-tag-red-text">*</span> SKU
                      </label>
                      <Input
                        placeholder="e.g., SKU123"
                        size="base"
                        {...register(`variants.${index}.sku` as const)}
                      />
                    </div>
                    <Trash
                      className="mt-9 cursor-pointer text-red-500"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
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
                  <PlusMini /> Add Variant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddBrand;
