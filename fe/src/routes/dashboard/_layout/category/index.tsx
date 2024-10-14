import Header from '@/components/layoutAdmin/header/header';
import { useFetchCategories } from '@/data/category/useCategoryList'; 
import { Adjustments, ArrowUpTray, Plus, EllipsisVertical } from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 7;

export const Route = createFileRoute('/dashboard/_layout/category/')({
  component: CategoryList, 
});

function CategoryList() { 
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const { data: listCategory, error, isLoading } = useFetchCategories({
    limit: pageSize,
    page: currentPage + 1, // Bắt đầu từ 1 cho page
  });

  console.log(listCategory);

  const pageCount = useMemo(() => {
    return listCategory?.meta ? Math.ceil(listCategory.meta.totalItems / pageSize) : 0;
  }, [listCategory]);

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title='Category List' pathname='/' />
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
          <Button variant="primary" onClick={() => navigate({ to: "/dashboard/category/create" })}>
            <Plus />
            Create Category
          </Button>
        </div>
      </div>

      <div className="border-gray-200 mx-6 flex flex-col gap-1 rounded-lg border bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Category Name</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">Description</Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {listCategory?.data && listCategory.data.length > 0 ? (
              listCategory.data.map((category) => (
                <Table.Row
                  key={category._id}
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
                  <Table.Cell className="font-semibold text-ui-fg-base">{category.name}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={3} className="text-center">
                  No categories available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Table.Pagination
          count={listCategory?.meta?.totalItems ?? 0}
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

export default CategoryList;
