import ModalCreateCustomInfor from '@/components/custom-infor/modal-create-custom-infor';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_layout/blog/text')({
  component: Test,
});

function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Store Management</h1>

      <button
        onClick={openModal}
        className="rounded bg-blue-500 p-2 text-white"
      >
        Edit Store
      </button>

      <ModalCreateCustomInfor isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
