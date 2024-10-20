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
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )

  const { data: listCategory } = useFetchCategory()

  // const { deleteCategory } = useCategoryMutation()

  // const pageCount = Math.ceil(listCategory?.meta.totalItems ?? 0 / pageSize)

  // const canNextPage = useMemo(
  //   () => currentPage < pageCount - 1,
  //   [currentPage, pageCount]
  // )

  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage])

  // const nextPage = () => {
  //   if (canNextPage) {
  //     setCurrentPage(currentPage + 1)
  //   }
  // }
  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }
  // const handleDelete = () => {
  //   if (selectedCategoryId) {
  //     deleteCategory.mutate(selectedCategoryId)
  //     setSelectedCategoryId(null)
  //   }
  // }
  // const openDeletePrompt = (categoryId: string) => {
  //   setSelectedCategoryId(categoryId)
  // }
  // const closeDeletePrompt = () => {
  //   setSelectedCategoryId(null)
  // }

  return (
    <div className="h-screen overflow-y-auto">
      <Header title='Category' pathname='' />
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
            {listCategory?.map((category) => {
              // const badgeColor = category.status === 'SHOW' ? 'green' : 'red'
              return (
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
                      {/* <Prompt>
                        <Prompt.Trigger asChild>
                          <Button
                            variant="secondary"
                            onClick={() => openDeletePrompt(category.id)}
                          >
                            Delete
                          </Button>
                        </Prompt.Trigger>
                        <Prompt.Content>
                          <Prompt.Header>
                            <Prompt.Title>Delete Category</Prompt.Title>
                            <Prompt.Description>
                              Are you sure you want to delete this category?
                              This action cannot be undone.
                            </Prompt.Description>
                          </Prompt.Header>
                          <Prompt.Footer>
                            <Prompt.Cancel onClick={closeDeletePrompt}>
                              Cancel
                            </Prompt.Cancel>
                            <Prompt.Action onClick={handleDelete}>
                              Delete
                            </Prompt.Action>
                          </Prompt.Footer>
                        </Prompt.Content>
                      </Prompt> */}
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        {/* <Table.Pagination
          count={listCategory?.meta.totalItems ?? 0}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        /> */}
      </div>
    </div>
  )
}

