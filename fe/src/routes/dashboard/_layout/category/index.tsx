import Header from '@/components/layoutAdmin/header/header';
import { useFetchCategory } from '@/data/products/useProductList';
import { Adjustments, ArrowUpTray, Plus } from '@medusajs/icons';
import { Button, Input, StatusBadge, Table } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 7;

export const Route = createFileRoute('/dashboard/_layout/category/')({
  component: CategoryList,
});

function CategoryList() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const { data: listCategory } = useFetchCategory();

  const filteredCategories = useMemo(() => {
    if (!listCategory || !searchTerm) return listCategory;
    return listCategory.filter((category: any) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listCategory, searchTerm]);

  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Category" pathname="" />
      <div className="relative flex justify-between px-6 py-4">
        <div className="relative w-80">
          <Input
            className="bg-ui-bg-base"
            placeholder="Find Something"
            id="search-input"
            size="small"
            type="search"
            value={searchTerm} // Bind input to searchTerm
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
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
          <Button
            variant="primary"
            onClick={() => void navigate({ to: '/dashboard/category/create' })}
          >
            <Plus />
            Create Category
          </Button>
        </div>
      </div>
      <div className="border-gray-200 mx-6 flex flex-col gap-1 rounded-lg border bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Category Name
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Status
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Action
            </Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((category: any) => (
                <Table.Row
                  key={category._id}
                  className="[&_td:last-child]:w-[5%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {category.name}
                  </Table.Cell>
                  <StatusBadge
                    className="mt-2 rounded-full px-2 py-1 [&_div]:rounded-full"
                    color="green"
                  >
                    SHOW
                  </StatusBadge>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    <div className="flex gap-2">
                      <Button
                        variant={'secondary'}
                        onClick={() =>
                          void navigate({
                            to: `/dashboard/category/${category._id}/edit`,
                          })
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center" colSpan={3}>
                  No categories found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
