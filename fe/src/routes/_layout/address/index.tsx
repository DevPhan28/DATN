import CustomUser from '@/components/useroder/custom-menu';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronRightMini, Plus } from '@medusajs/icons';
import { Badge, Button } from '@medusajs/ui';
import ModalCreateCustomInfor from '@/components/custom-infor/modal-create-custom-infor';
import { useEffect, useState } from 'react';
import { useFetchAddress } from '@/data/address/useFetchAddress';

export const Route = createFileRoute('/_layout/address/')({
  component: Address,
});

function Address() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const { data, isLoading, error, refetch } = useFetchAddress(userId);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    refetch();
  };

  // Sắp xếp địa chỉ sao cho địa chỉ mặc định đứng đầu
  const sortedAddresses = data?.data.sort((a, b) =>
    a.isDefault ? -1 : b.isDefault ? 1 : 0
  );

  return (
    <div className="bg-gray-50">
      <div className="bg-white">
        <div className="main-content flex h-48 w-full flex-col items-center justify-center">
          <div className="text-content">
            <div className="text-center text-4xl font-semibold">Địa Chỉ</div>
            <div className="link caption1 mt-3 flex items-center justify-center gap-1">
              <div className="flex items-center justify-center">
                <a href="/">Trang chủ</a>
                <ChevronRightMini />
              </div>
              <div className="flex items-center justify-center">
                <a href="/">User</a>
                <ChevronRightMini />
              </div>
              <div className="capitalize text-gray-500">
                <a href="#">Địa Chỉ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl bg-gray-50 py-10 pt-10">
        <CustomUser />
        <div className="ml-6 w-3/4">
          <div className="mb-2 flex justify-between">
            <h1 className="text-xl">Địa chỉ của bạn</h1>
            <Button onClick={openModal}>
              <Plus />
              Thêm địa chỉ
            </Button>
            <ModalCreateCustomInfor isOpen={isModalOpen} onClose={closeModal} />
          </div>
          {isLoading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div>Có lỗi xảy ra khi tải địa chỉ!</div>
          ) : (
            <div>
              {sortedAddresses?.map(address => (
                <div
                  key={address.id}
                  className="mb-2 justify-start rounded-lg border-b bg-white shadow sm:space-x-0"
                >
                  <div className="flex justify-between p-7">
                    <div>
                      <h1 className="mt-1 text-lg">
                        {address.name}, {address.phone}
                      </h1>
                      <h1 className="mt-2 text-sm">{address.address}</h1>
                      <h1 className="mb-2">
                        {address.wards}, {address.districts}, {address.city}
                      </h1>
                      {address.isDefault && <Badge color="red">Mặc Định</Badge>}
                    </div>
                    <div className="mt-2 flex flex-col items-center">
                      <p
                        className="cursor-pointer text-blue-400"
                        onClick={openModal}
                      >
                        Cập Nhật
                      </p>
                      <a href="#" className="text-red-500">
                        Xoá
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
