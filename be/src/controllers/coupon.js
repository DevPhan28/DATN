const Coupon = require("../models/coupon");
const { StatusCodes } = require("http-status-codes");

// Tạo mã giảm giá mới
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    const coupon = new Coupon({
      code,
      discount,
      expirationDate,
      isActive: true,
    });

    await coupon.save();
    return res.status(StatusCodes.CREATED).json(coupon);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Lấy danh sách các mã giảm giá
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    return res.status(StatusCodes.OK).json(coupons);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getCouponById = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Coupon not found" });
    }

    return res.status(StatusCodes.OK).json(coupon);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Lấy các mã giảm giá hợp lệ
const getAvailableCoupons = async (req, res) => {
    try {
      const availableCoupons = await Coupon.find({
        isActive: true,
        expirationDate: { $gte: new Date() },
      });
  
      return res.status(StatusCodes.OK).json(availableCoupons);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };
  
const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;  // lấy _id từ URL
    const { code, discount, expirationDate, isActive, isFreeShipping } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { code, discount, expirationDate, isActive, isFreeShipping },
      { new: true }
    );

    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Coupon not found" });
    }

    return res.status(StatusCodes.OK).json(coupon);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Xoá mã giảm giá
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Coupon not found" });
    }

    return res.status(StatusCodes.OK).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Sử dụng mã giảm giá
const applyCoupon = async (req, res) => {
    try {
      const { code } = req.body;
  
      const coupon = await Coupon.findOne({
        code,
        isActive: true,
        expirationDate: { $gte: new Date() },
      });
  
      if (!coupon) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid or expired coupon code" });
      }
  
      // Trả về loại giảm giá hoặc miễn phí vận chuyển
      if (coupon.isFreeShipping) {
        return res.status(StatusCodes.OK).json({ isFreeShipping: true });
      } else {
        return res.status(StatusCodes.OK).json({ discount: coupon.discount });
      }
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
};
  

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  getAvailableCoupons
};
