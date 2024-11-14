import Header from '@/components/layoutAdmin/header/header';
import { useFetchOrders } from '@/data/oder/useOderList';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import { Adjustments, ArrowUpTray, EllipsisVertical } from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table, Tooltip } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 10;

export const Route = createFileRoute('/dashboard/_layout/order/')({
  component: OrderList,
});

function OrderList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('all'); // State for selected tab
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

  // Function to handle status updates
  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    const statusOrder = [
      'pending',
      'confirmed',
      'shipped',
      'received',
      'delivered',
      'canceled',
      'refund',
      'exchange',
      'refund_in_progress', // Đang hoàn trả hàng
      'exchange_in_progress', // Đang đổi trả hàng
      'refund_completed', // Trạng thái hoàn trả hàng đã hoàn thành
      'exchange_completed', // Trạng thái đổi trả hàng đã hoàn thành
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      return;
    }

    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          // Optional: Reload list or update status locally to reflect change
          console.log('Status updated successfully');
        },
        onError: error => {
          console.error('Failed to update status:', error);
        },
      }
    );
  };

  // Tabs for filtering orders
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Chờ lấy hàng' },
    { id: 'shipped', label: 'Chờ giao hàng' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'canceled', label: 'Đã hủy' },
    { id: 'refund', label: 'Trả hàng hoàn tiền' },
    { id: 'exchange', label: 'Đổi trả hàng' },
  ];

  const filteredOrders = listOrder?.data?.filter(order => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') {
      return order.status === 'pending';
    }

    if (selectedTab === 'confirmed') {
      return order.status === 'confirmed';
    }

    if (selectedTab === 'shipped') {
      return order.status === 'shipped' || order.status === 'received';
    }

    if (selectedTab === 'delivered') {
      return order.status === 'delivered';
    }

    if (selectedTab === 'canceled') {
      return order.status === 'canceled';
    }

    if (selectedTab === 'refund') {
      return order.status === 'refund' || order.status === 'return_completed'; // Hiển thị đơn hàng hoàn tiền và đổi trả thành công
    }

    if (selectedTab === 'exchange') {
      return order.status === 'exchange' || order.status === 'return_completed'; // Hiển thị đơn hàng đổi trả và đổi trả thành công
    }

    return order.status === selectedTab;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Order List" pathname="/" />
      <div className="relative flex justify-between px-6 pt-4">
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
      <div className="m-6 flex justify-start space-x-4 rounded-lg border bg-white px-6 py-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`text-gray-700 ${
              selectedTab === tab.id
                ? 'border-b-2 border-red-500 text-red-600'
                : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
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
            <Table.HeaderCell className="font-semibold text-ui-fg-base">
              Refund Reason
            </Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {filteredOrders?.length > 0 ? (
              filteredOrders.map(order => (
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
                        <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ui-fg-base">
                          {product.name}
                        </div>
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
                      }
                    >
                      <option
                        value="pending"
                        disabled={order.status !== 'pending'}
                      >
                        Chờ xác nhận
                      </option>
                      <option
                        value="confirmed"
                        disabled={
                          order.status === 'shipped' ||
                          order.status === 'canceled' ||
                          order.status === 'delivered'
                        }
                      >
                        Chờ lấy hàng
                      </option>
                      <option
                        value="shipped"
                        disabled={
                          order.status === 'canceled' ||
                          order.status === 'delivered'
                        }
                      >
                        Chờ giao hàng
                      </option>
                      <option
                        value="received"
                        disabled={
                          order.status === 'canceled' ||
                          order.status === 'delivered'
                        }
                      >
                        Đã nhận
                      </option>
                      <option
                        value="delivered"
                        disabled={order.status === 'delivered'}
                      >
                        Đã giao
                      </option>
                      <option
                        value="canceled"
                        disabled={order.status !== 'pending'}
                      >
                        Đã hủy
                      </option>
                      <option
                        value="refund"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Hoàn trả hàng
                      </option>
                      <option
                        value="exchange"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Đổi trả hàng
                      </option>
                      <option
                        value="refund_in_progress"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Đang hoàn trả hàng
                      </option>
                      <option
                        value="exchange_in_progress"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Đang đổi trả hàng
                      </option>
                      <option
                        value="refund_completed"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Hoàn trả hàng hoàn thành
                      </option>
                      <option
                        value="exchange_completed"
                        disabled={
                          order.status === 'delivered' ||
                          order.status === 'canceled'
                        }
                      >
                        Đổi trả hàng hoàn thành
                      </option>
                    </select>
                  </Table.Cell>

                  <Table.Cell className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ui-fg-base">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <span className="cursor-pointer">
                          {order.returnReason || 'N/A'}
                        </span>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="w-96 p-4">
                        <div>
                          <p className="font-semibold">Lý do chi tiết:</p>
                          <p>{order.returnReason || 'N/A'} </p>
                        </div>
                      </DropdownMenu.Content>
                    </DropdownMenu>
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
