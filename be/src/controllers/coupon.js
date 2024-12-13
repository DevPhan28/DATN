const Coupon = require("../models/coupon");
const { StatusCodes } = require("http-status-codes");

// Tạo mã giảm giá mới
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      expirationDate,
      startDate, // Thêm startDate từ request body
      maxDiscountAmount, // Thêm maxDiscountAmount từ request body
      minOrder, // Thêm minOrder từ request body nếu cần
      isFreeShipping, // Thêm isFreeShipping từ request body nếu cần
      isActive, // Thêm isActive từ request body nếu muốn tùy chỉnh
    } = req.body;

    // Kiểm tra các trường bắt buộc (optional: nếu cần kiểm tra thêm)
    if (!startDate || !expirationDate) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "startDate and expirationDate are required." });
    }

    const coupon = new Coupon({
      code,
      discount,
      expirationDate,
      startDate: new Date(startDate), // Đảm bảo chuyển đổi sang kiểu Date
      maxDiscountAmount: maxDiscountAmount || 0, // Mặc định là 0 nếu không được cung cấp
      minOrder: minOrder || 0, // Mặc định là 0 nếu không được cung cấp
      isFreeShipping: isFreeShipping || false, // Mặc định là false nếu không được cung cấp
      isActive: isActive !== undefined ? isActive : true, // Mặc định là true nếu không được cung cấp
    });

    await coupon.save();
    return res.status(StatusCodes.CREATED).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error.message); // Ghi log để debug
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

const getAvailableCoupons = async (req, res) => {
  try {
    const { orderAmount } = req.query;

    if (!orderAmount || isNaN(Number(orderAmount))) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Số tiền đơn hàng là bắt buộc và phải là một số hợp lệ." });
    }

    // Lấy mã giảm giá đang hoạt động và đã bắt đầu hoặc chưa đến ngày bắt đầu
    const availableCoupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gte: new Date() },
    });

    if (!availableCoupons || availableCoupons.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Không tìm thấy mã giảm giá nào." });
    }

    const couponsWithStatus = availableCoupons.map((coupon) => {
      let canApply = true;
      let message = '';

      // Kiểm tra nếu chưa đến ngày bắt đầu
      if (coupon.startDate > new Date()) {
        canApply = false;
        message = `Mã giảm giá chưa đến ngày bắt đầu (${coupon.startDate.toLocaleDateString()}).`;
      }

      // Kiểm tra điều kiện đơn hàng tối thiểu
      if (canApply && coupon.minOrder && Number(orderAmount) < Number(coupon.minOrder)) {
        canApply = false;
        message = `Đơn hàng tối thiểu phải đạt ${coupon.minOrder} để áp dụng mã giảm giá này.`;
      }

      let applicableDiscount = 0;

      // Nếu là mã giảm phí ship
      if (coupon.isFreeShipping) {
        applicableDiscount = 0; // Không giảm trực tiếp tiền, nhưng áp dụng miễn phí ship
      } else {
        // Tính giảm giá nếu không phải mã miễn phí vận chuyển
        const calculatedDiscount = (coupon.discount / 100) * Number(orderAmount);
        applicableDiscount = Math.min(calculatedDiscount, coupon.maxDiscountAmount || calculatedDiscount);

        if (canApply && applicableDiscount <= 0) {
          canApply = false;
          message = `Mức giảm giá tối đa là ${coupon.maxDiscountAmount}, nhưng đơn hàng không đủ điều kiện.`;
        }
      }

      return {
        ...coupon.toObject(),
        canApply,
        message,
        applicableDiscount, // Số tiền giảm giá hoặc giá trị 0 nếu chỉ miễn phí ship
        isFreeShipping: coupon.isFreeShipping, // Để FE nhận biết mã miễn phí ship
        notStarted: coupon.startDate > new Date(), // Thêm trạng thái để nhận biết mã chưa đến ngày bắt đầu
      };
    });

    return res.status(StatusCodes.OK).json(couponsWithStatus);
  } catch (error) {
    console.error("Lỗi khi lấy mã giảm giá khả dụng:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
  }
};



const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params; // Lấy _id từ URL
    const {
      code,
      discount,
      expirationDate,
      startDate,
      maxDiscountAmount,
      minOrder,
      isActive,
      isFreeShipping,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (discount && (discount < 0 || discount > 100)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Discount must be between 0 and 100." });
    }

    if (startDate && new Date(startDate) > new Date(expirationDate)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Start date cannot be after expiration date." });
    }

    // Cập nhật mã giảm giá
    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code,
        discount,
        expirationDate,
        startDate,
        maxDiscountAmount,
        minOrder,
        isActive,
        isFreeShipping,
      },
      { new: true, runValidators: true } // `runValidators` để áp dụng validate trong schema
    );

    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Coupon not found" });
    }

    return res.status(StatusCodes.OK).json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error.message); // Log lỗi để debug
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

const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body; // orderAmount là số tiền đơn hàng

    // Tìm mã giảm giá hợp lệ
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      expirationDate: { $gte: new Date() }, // Mã giảm giá chưa hết hạn
      startDate: { $lte: new Date() }, // Mã giảm giá đã bắt đầu
    });

    if (!coupon) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid, expired, or not yet active coupon code" });
    }

    // Kiểm tra số tiền giảm giá không vượt quá giới hạn
    let discountAmount = coupon.discount;

    // Nếu mã giảm giá có giới hạn tối đa, áp dụng giới hạn này
    if (coupon.maxDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }

    // Nếu có điều kiện đơn hàng tối thiểu, kiểm tra đơn hàng có đủ không
    if (coupon.minOrder && orderAmount < coupon.minOrder) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Minimum order of ${coupon.minOrder} required for this coupon` });
    }

    // Trả về thông tin giảm giá hoặc miễn phí vận chuyển
    if (coupon.isFreeShipping) {
      return res.status(StatusCodes.OK).json({ isFreeShipping: true });
    } else {
      return res.status(StatusCodes.OK).json({ discount: discountAmount });
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
