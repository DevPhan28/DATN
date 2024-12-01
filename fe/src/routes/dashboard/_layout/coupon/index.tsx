import Header from '@/components/layoutAdmin/header/header';
import { useFetchCoupons } from '@/data/coupon/useCouponList';
import useCouponMutation from '@/data/coupon/useCouponMutation';
import { Adjustments, ArrowUpTray, EllipsisVertical, Plus } from '@medusajs/icons';
import { Button, DropdownMenu, Input, Table, usePrompt } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

const pageSize = 7;

export const Route = createFileRoute('/dashboard/_layout/coupon/')({
  component: CouponList,
});

function CouponList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();
  const dialog = usePrompt();

  const { data: listCoupon, error, isLoading } = useFetchCoupons({
    limit: pageSize,
    page: currentPage + 1,
  });

  const pageCount = useMemo(() => {
    return listCoupon?.meta ? Math.ceil(listCoupon.meta.totalItems / pageSize) : 0;
  }, [listCoupon]);

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

  const { deleteCoupon } = useCouponMutation();
  const deleteEntity = async (_id: string) => {
    const userHasConfirmed = await dialog({
      title: 'Delete coupon',
      description: 'Are you sure you want to delete this coupon?',
    });
    if (userHasConfirmed) {
      deleteCoupon.mutate(_id);
    }
  };

  // Filter coupons based on the search query
  const filteredCoupons = useMemo(() => {
    return Array.isArray(listCoupon)
      ? listCoupon.filter(coupon => 
          coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by coupon code
        )
      : [];
  }, [listCoupon, searchQuery]);

  if (isLoading) return <p>Loading coupons...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Coupon List" pathname="/" />
      <div className="relative flex justify-between px-6 py-4">
        <div className="relative w-80">
          {/* Search input */}
          <Input
            className="bg-ui-bg-base"
            placeholder="Find Something"
            id="search-input"
            size="small"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
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
          <Button variant="primary" onClick={() => navigate({ to: '/dashboard/coupon/create' })}>
            <Plus />
            Create Coupon
          </Button>
        </div>
      </div>

      <div className="mx-6 flex flex-col gap-1 rounded-lg border border-gray-200 bg-ui-bg-base px-6 py-4">
        <Table>
          <thead>
            <Table.Row className="bg-ui-bg-base-hover">
              <Table.HeaderCell className="font-semibold text-ui-fg-base"></Table.HeaderCell>
              <Table.HeaderCell className="font-semibold text-ui-fg-base">Coupon Code</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold text-ui-fg-base">Discount</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold text-ui-fg-base">Free Shipping</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold text-ui-fg-base">Expiration Date</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold text-ui-fg-base">Status</Table.HeaderCell>
            </Table.Row>
          </thead>
          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <Table.Row key={coupon._id} className="[&_td:last-child]:w-[10%] [&_td:last-child]:whitespace-nowrap">
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
                        <DropdownMenu.Item className="gap-x-2" asChild>
                          <span onClick={async () => deleteEntity(coupon._id)}>Delete</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="gap-x-2"
                          onClick={() => void navigate({ to: `/dashboard/coupon/${coupon._id}/edit` })}>
                          Edit
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{coupon.code}</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {coupon.isFreeShipping ? 'N/A' : `${coupon.discount} VND`}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">{coupon.isFreeShipping ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center" colSpan={6}>No coupons available</Table.Cell>
              </Table.Row>
            )}
          </tbody>
        </Table>
        <Table.Pagination
          count={listCoupon?.meta?.totalItems ?? 0}
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

export default CouponList;
