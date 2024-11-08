const calculateShippingFee = (weight, address, orderValue = 0, coupon = null) => { 
  let shippingFee = 0;

  const shippingZones = {
    urban: {
      districts: [
        "Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Hai Bà Trưng",
        "Quận Tây Hồ", "Quận Cầu Giấy", "Quận Thanh Xuân", "Quận Hoàng Mai", "Quận Long Biên"
      ],
      baseFee: 2000
    },
    suburban: {
      districts: [
        "Huyện Gia Lâm", "Huyện Đông Anh", "Huyện Sóc Sơn", "Huyện Thanh Trì", "Huyện Thường Tín",
        "Huyện Phú Xuyên", "Huyện Ba Vì", "Huyện Phúc Thọ", "Huyện Thạch Thất", "Huyện Quốc Oai",
        "Huyện Đan Phượng", "Huyện Hoài Đức", "Huyện Chương Mỹ", "Huyện Thanh Oai", "Huyện Mỹ Đức",
        "Huyện Ứng Hòa"
      ],
      baseFee: 3000 
    },
    rural: {
      districts: [],
      baseFee: 5000 
    }
  };

  let zone = 'rural'; 
  if (shippingZones.urban.districts.includes(address.district)) {
    zone = 'urban';
  } else if (shippingZones.suburban.districts.includes(address.district)) {
    zone = 'suburban';
  }

  shippingFee = shippingZones[zone].baseFee;

  if (weight > 1000) {
    shippingFee += Math.ceil((weight - 1000) / 500) * 1000; 
  }

  // Kiểm tra điều kiện miễn phí vận chuyển
  if (coupon && coupon.isFreeShipping) {
    shippingFee = 0;
  } else if (orderValue > 250000) {
    shippingFee = 0;
  }

  return shippingFee;
};

module.exports = { calculateShippingFee };
