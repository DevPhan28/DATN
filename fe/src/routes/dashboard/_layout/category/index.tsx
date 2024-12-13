import Header from '@/components/layoutAdmin/header/header';
import useCategoryMutation from '@/data/category/useCategoryMutation';
import { useFetchCategory } from '@/data/products/useProductList';
import { Adjustments, ArrowUpTray, Plus, EllipsisVertical } from '@medusajs/icons';
import { Button, Input, StatusBadge, Table, DropdownMenu, usePrompt } from '@medusajs/ui';
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

  const { deleteCategory } = useCategoryMutation(); // Hook để gọi hàm xóa

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
  
  const dialog = usePrompt();
   const handleDelete = async (categoryId: string) => {
    const userHasConfirmed = await dialog({
      title: 'Delete products',
      description: 'bạn có muốn xóa không ?',
    });
    if (userHasConfirmed) {
      deleteCategory.mutate(categoryId, {
        onSuccess: () => {
         
        },
        onError: (error) => {
          console.error("Lỗi khi xóa danh mục:", error);
        },
      });
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
           Lọc
          </Button>
          <Button variant="secondary">
            <ArrowUpTray className="text-black" />
           Tải lên 
          </Button>
          <Button
            variant="primary"
            onClick={() => void navigate({ to: '/dashboard/category/create' })}
          >
            <Plus />
            Thêm danh mục
          </Button>
        </div>
      </div>
      <div className="border-gray-200 mx-6 flex flex-col gap-1 rounded-lg border bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base" />
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Tên danh mục
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Trạng thái
            </Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((category: any) => (
                <Table.Row
                  key={category._id}
                  className="[&_td:last-child]:w-[5%] [&_td:last-child]:whitespace-nowrap"
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
                          Xem chi tiết
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="gap-x-2" asChild>
                          <span onClick={() => handleDelete(category._id)}>Xóa</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="gap-x-2"
                          onClick={() => void navigate({ to: `/dashboard/category/${category._id}/edit` })}
                        >
                          Chỉnh sửa
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {category.name}
                  </Table.Cell>
                  <StatusBadge
                    className="mt-2 rounded-full px-2 py-1 [&_div]:rounded-full"
                    color="green"
                  >
                    Hiển thị
                  </StatusBadge>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center" colSpan={3}>
                  không có danh mục nào được tìm thấy
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
