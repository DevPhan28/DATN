// components/VoucherModal.jsx
import { useFetchAvailableCoupons } from '@/data/coupon/useCouponList';
import React, { useState } from 'react';
const VoucherModal = ({ isOpen, onClose, onApplyCoupon }) => {
  const { data: availableCoupons, isLoading } = useFetchAvailableCoupons();
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Chọn Voucher</h2>
        
        <div className="overflow-y-auto max-h-64">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading vouchers...</p>
          ) : (
            availableCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg mb-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedCoupon(coupon)}
              >
                <input
                  type="radio"
                  id={coupon.code}
                  name="voucher"
                  value={coupon.code}
                  checked={selectedCoupon?.code === coupon.code}
                  onChange={() => setSelectedCoupon(coupon)}
                  className="form-radio text-red-500"
                />
                <label htmlFor={coupon.code} className="flex-1">
                  <p className="font-medium text-gray-700">{coupon.isFreeShipping ? 'Miễn phí vận chuyển' : `Giảm ${coupon.discount}%`}</p>
                  <p className="text-sm text-gray-500">Điều kiện: Đơn tối thiểu {coupon.minOrder || 0}k</p>
                </label>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Trở lại
          </button>
          <button
            onClick={() => {
              onApplyCoupon(selectedCoupon);
              onClose();
            }}
            disabled={!selectedCoupon}
            className={`flex-1 py-2 rounded-lg ${
              selectedCoupon ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
