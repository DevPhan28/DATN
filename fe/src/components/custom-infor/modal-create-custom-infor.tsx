import { FocusModal } from '@/components/ui/custom-focus-modal';
import { Button, Input, Label, Select } from '@medusajs/ui';

const ModalCreateCustomInfor = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <FocusModal open={isOpen} onOpenChange={handleClose}>
      <FocusModal.Content className="m-auto h-fit max-h-[80%] w-[calc(100%-24px)] max-w-[650px] overflow-visible">
        <FocusModal.Header className="flex flex-row-reverse px-8 py-6 [&_kbd]:hidden">
          <p className="font-semibold">Thêm Địa Chỉ Mới</p>
        </FocusModal.Header>
        <div className="flex h-full flex-col justify-between overflow-y-auto p-8">
          <div className="gap- flex flex-wrap justify-between gap-y-4">
            <div className="space-y-2">
              <Label>Tên Người Nhận</Label>
              <div className="relative z-50 w-[276px]">
                <Input
                  placeholder="Sales Channel Name"
                  id="sales-channel-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Số Điện Thoại</Label>
              <div className="relative z-50 w-[276px]">
                <Input
                  placeholder="Sales Channel Name"
                  id="sales-channel-name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Xã/Phường</Label>
              <div className="relative z-50 w-[276px]">
                <Select>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a currency" />
                  </Select.Trigger>
                  <Select.Content className="absolute z-50 bg-white">
                    {currencies.map(item => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Quận/Huyện</Label>
              <div className="relative z-50 w-[276px]">
                <Select>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a currency" />
                  </Select.Trigger>
                  <Select.Content className="absolute z-50 bg-white">
                    {currencies.map(item => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tính/Thành Phố</Label>
              <div className="relative z-50 w-[276px]">
                <Select>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a currency" />
                  </Select.Trigger>
                  <Select.Content className="absolute z-50 bg-white">
                    {currencies.map(item => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Địa Chỉ Cụ Thể</Label>
              <div className="relative z-50 w-[276px]">
                <Input
                  placeholder="Sales Channel Name"
                  id="sales-channel-name"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-2 border-t border-ui-border-base pb-6 pr-8 pt-4">
          {/* <Button
            variant="secondary"
            type="button"
            className="mr-2"
            onClick={handleClose}
          >
            Cancel
          </Button> */}
          <Button variant="primary" type="button">
            Thêm Địa Chỉ
          </Button>
        </div>
      </FocusModal.Content>
    </FocusModal>
  );
};

const currencies = [
  {
    value: 'eur',
    label: 'EUR',
  },
  {
    value: 'usd',
    label: 'USD',
  },
  {
    value: 'dkk',
    label: 'DKK',
  },
];

export default ModalCreateCustomInfor;
