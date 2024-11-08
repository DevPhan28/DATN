import Header from '@/components/layoutAdmin/header/header';
import { useFetchOrders } from '@/data/oder/useOderList';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import { Adjustments, ArrowUpTray, EllipsisVertical } from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table, Tooltip } from '@medusajs/ui';
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

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    // Xác định thứ tự các trạng thái
    const statusOrder = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'canceled',
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    // Không cho phép quay lại trạng thái trước đó
    if (newIndex < currentIndex) {
      return;
    }

    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          // Tải lại danh sách hoặc cập nhật trạng thái cục bộ để hiển thị thay đổi
        },
        onError: error => {
          console.error('Failed to update status:', error);
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
              Address
            </Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Products
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
                  <Table.Cell className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ui-fg-base">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <span className="cursor-pointer">
                          {order.customerInfo.address},{' '}
                          {order.customerInfo.wards},{' '}
                          {order.customerInfo.districts},{' '}
                          {order.customerInfo.city}
                        </span>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="w-96 p-4">
                        <div>
                          <p className="font-semibold">Địa chỉ chi tiết:</p>
                          <p>
                            {order.customerInfo.address},{' '}
                            {order.customerInfo.wards},{' '}
                            {order.customerInfo.districts},{' '}
                            {order.customerInfo.city}
                          </p>
                        </div>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.items.map((product, index) => (
                      <span key={product._id || index}>
                        <div className="">{product.name}</div>
                      </span>
                    ))}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {order.totalPrice}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    <select
                      value={order.status}
                      onChange={e =>
                        handleStatusChange(
                          order._id,
                          e.target.value,
                          order.status
                        )
                      }
                      disabled={
                        order.status === 'delivered' ||
                        order.status === 'canceled'
                      } // Khóa toàn bộ select khi đã giao hoặc đã hủy
                    >
                      <option
                        value="pending"
                        disabled={order.status !== 'pending'}
                      >
                        Pending
                      </option>
                      <option
                        value="confirmed"
                        disabled={
                          order.status === 'shipped' ||
                          order.status === 'canceled' ||
                          order.status === 'delivered'
                        }
                      >
                        Confirmed
                      </option>
                      <option
                        value="shipped"
                        disabled={
                          order.status === 'canceled' ||
                          order.status === 'delivered'
                        }
                      >
                        Shipped
                      </option>
                      <option
                        value="delivered"
                        disabled={order.status === 'delivered'}
                      >
                        Delivered
                      </option>
                      <option
                        value="canceled"
                        disabled={order.status !== 'pending'}
                      >
                        Canceled
                      </option>
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
