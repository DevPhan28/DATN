const axios = require("axios"); // npm install moment
const CryptoJS = require("crypto-js");
const { config } = require("../zalo_pay/config");
const Order = require("../models/order");
const mongoose = require("mongoose");

const callback = async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    console.log("🚀 ===== dataStr:", dataStr);
    let reqMac = req.body.mac;

    // Kiểm tra tính hợp lệ của mã (mac)
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal"; // Callback không hợp lệ
    } else {
      // Thanh toán thành công, cập nhật trạng thái đơn hàng
      let dataJson = JSON.parse(dataStr);
      console.log("🚀 ===== dataJson:", dataJson);
      const transactionid = dataJson.app_trans_id;
      const orderId = new mongoose.Types.ObjectId(dataJson.app_user);
      if (!transactionid) throw new Error("not exist transId");

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          transactionid,
          paymentStatus: "paid",
        },
        { new: true }
      );

      result.return_code = 1;
      result.return_message = "payment success orderid " + order._id;
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  console.log(result);
  res.json(result); // Gửi kết quả về cho ZaloPay server
};

module.exports = {
  callback,
};
