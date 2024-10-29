import Header from '@/components/layoutAdmin/header/header';
import { useFetchOrders } from '@/data/oder/useOderList';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import {
  Adjustments,
  ArrowUpTray,
  EllipsisVertical,
} from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 7;

export const Route = createFileRoute('/dashboard/_layout/order/')({
  component: OrderList,
});

function OrderList() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const {
    data: listOrder,
    error,
    isLoading,
  } = useFetchOrders({
    limit: pageSize,
    page: currentPage + 1,
  });

  const { updateOrderStatus } = useCheckoutMutation();
  
  const pageCount = useMemo(() => {
    return listOrder?.meta
      ? Math.ceil(listOrder.meta.totalItems / pageSize)
      : 0;
  }, [listOrder]);

  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  );
  const canPreviousPage = useMemo(() => currentPage > 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          // Tải lại danh sách hoặc cập nhật trạng thái cục bộ để hiển thị thay đổi
        },
        onError: error => {
          console.error("Failed to update status:", error);
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Order List" pathname="/" />
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
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-1 rounded-lg border border-gray-200 bg-ui-bg-base px-6 py-4">
        <Table>
          <Table.Row className="bg-ui-bg-base-hover">
            <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Order Number
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Customer Name
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Phone
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Email
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Total Price ($)
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Status
            </Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {listOrder?.data?.length > 0 ? (
              listOrder.data.map(order => (
                <Table.Row
                  key={order._id}
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
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.orderNumber}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.customerInfo.name}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.customerInfo.phone}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.customerInfo.email}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.totalPrice.toFixed(2)}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center">
                  Không có đơn hàng nào
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Table.Pagination
          count={listOrder?.meta?.totalItems ?? 0}
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

export default OrderList;
