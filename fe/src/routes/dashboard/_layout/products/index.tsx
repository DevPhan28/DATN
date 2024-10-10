import Header from '@/components/layoutAdmin/header/header';
import { useFetchProducts } from '@/data/products/useProductList';
import { Adjustments, ArrowUpTray, Plus, EllipsisVertical } from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 7;

export const Route = createFileRoute('/dashboard/_layout/products/')({
  component: ProductList,
});

function ProductList() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const { data: listproduct, error, isLoading } = useFetchProducts({
    limit: pageSize,
    page: currentPage + 1, // Bắt đầu từ 1 cho page
  });

  // Ghi log để kiểm tra dữ liệu
  console.log(listproduct);

  const pageCount = useMemo(() => {
    return listproduct?.meta ? Math.ceil(listproduct.meta.totalItems / pageSize) : 0;
  }, [listproduct]);

  const canNextPage = useMemo(() => currentPage < pageCount - 1, [currentPage, pageCount]);
  const canPreviousPage = useMemo(() => currentPage > 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentProducts = useMemo(() => {
    return listproduct?.data ?? [];
  }, [listproduct]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title='Product List' pathname='/' />
      <div className="relative flex justify-between px-6 py-4">
        <div className="relative w-80">
          <Input
            className="bg-ui-bg-base"
            placeholder="Find Something"
            id="search-input"
            size="small"
            type="search"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Adjustments className="text-black" />
            Filter
          </Button>
          <Button variant="secondary">
            <ArrowUpTray className="text-black" />
            Export list
          </Button>
          <Button variant="primary" onClick={() => navigate({ to: "/dashboard/products/create" })}>
            <Plus />
            Create Category
          </Button>
        </div>
      </div>

      <div className="border-gray-200 mx-6 flex flex-col gap-1 rounded-lg border bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Product Name</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Image</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Price</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Category</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Discount</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Count In Stock</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Description</Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <Table.Row
                  key={product._id}
                  className="[&_td:last-child]:w-[10%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell>
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <button type="button" className="outline-none">
                          <EllipsisVertical />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="space-y-2">
                        <DropdownMenu.Item className="p-2 text-ui-tag-neutral-text hover:text-ui-code-bg-base">
                          View Details
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="gap-x-2">
                          Delete
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="gap-x-2">
                          Edit
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{product.name}</Table.Cell>
                  <Table.Cell>
                    {product.image && (
                      <img
                        src={product.image}
                        alt="product"
                        className="h-10 w-8 object-contain"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{product.price}</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{product.category?.name}</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">giảm {product.discount} %</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{product.countInStock} items</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{product.description}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center">
                  Không có sản phẩm nào
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Table.Pagination
          count={listproduct?.meta?.totalItems ?? 0}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </div>
    </div>
  );
}

export default ProductList;
