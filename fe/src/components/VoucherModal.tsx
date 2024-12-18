import { useFetchAvailableCoupons } from '@/data/coupon/useCouponList';
import React, { useState } from 'react';
import CurrencyVND from './config/vnd';

const VoucherModal = ({ isOpen, onClose, onApplyCoupon, totalAmount, userId, code }) => {
  const { data: availableCoupons, error, isLoading } = useFetchAvailableCoupons(totalAmount, userId, code);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  if (!isOpen) return null;

  // Đảm bảo dữ liệu `availableCoupons` luôn là mảng
  const coupons = Array.isArray(availableCoupons) ? availableCoupons : [];

  const handleCouponSelect = (coupon) => {
    if (coupon.canApply) {
      setSelectedCoupon(coupon);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Chọn Voucher</h2>

        {/* Vùng hiển thị danh sách mã giảm giá */}
        <div className="overflow-y-auto max-h-64">
          {isLoading ? (
            <p className="text-center text-gray-600">Đang tải mã giảm giá...</p>
          ) : error ? (
            <p className="text-center text-red-500">Lỗi tải dữ liệu mã giảm giá</p>
          ) : coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon.code}
                className={`flex items-center space-x-3 p-3 border rounded-lg mb-2 cursor-pointer ${
                  coupon.canApply ? 'hover:bg-gray-100' : 'bg-gray-200 cursor-not-allowed'
                }`}
                onClick={() => handleCouponSelect(coupon)}
              >
                <input
                  type="radio"
                  id={coupon.code}
                  name="voucher"
                  value={coupon.code}
                  checked={selectedCoupon?.code === coupon.code}
                  onChange={() => handleCouponSelect(coupon)}
                  className="form-radio text-red-500"
                  disabled={!coupon.canApply} // Chặn chọn mã không hợp lệ
                />
                <label htmlFor={coupon.code} className="flex-1">
                  <p className="font-medium text-gray-700">
                    {coupon.isFreeShipping
                      ? 'Miễn phí vận chuyển'
                      : `Giảm ${coupon.discount || 0}% (Tối đa  ${coupon.maxDiscountAmount || 0} đ)`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Điều kiện: Đơn tối thiểu <CurrencyVND amount={coupon.minOrder || 0}/> {}
                  </p>
                  {coupon.applicableDiscount > 0 && coupon.canApply && (
                    <p className="text-sm text-green-500">
                      Áp dụng giảm: <CurrencyVND amount={coupon.applicableDiscount}/> 
                    </p>
                  )}
                  {!coupon.canApply && (
                    <p className="text-xs text-red-500">
                      Không đủ điều kiện: {coupon.message}
                    </p>
                  )}
                </label>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Không có mã giảm giá nào</p>
          )}
        </div>

        {/* Vùng nút thao tác */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Trở lại
          </button>
          <button
            onClick={() => {
              if (selectedCoupon) {
                onApplyCoupon(selectedCoupon);
                onClose();
              }
            }}
            disabled={!selectedCoupon}
            className={`flex-1 py-2 rounded-lg ${
              selectedCoupon
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
