const CustomerInfo = require("../models/customerInfor");

// Tạo mới khách hàng
const createCustomer = async (req, res) => {
    try {
      const { userId, name, phone, email, city, districts, wards, address, zipcode, isDefault } = req.body;
  
      // Kiểm tra các trường bắt buộc
      if (!userId || !name || !phone || !email || !city || !districts || !wards || !address) {
        return res.status(400).json({
          success: false,
          message: "Các trường userId, name, phone, email, city, districts, wards, address là bắt buộc!",
        });
      }
  
      // Kiểm tra nếu địa chỉ mặc định, cập nhật tất cả các địa chỉ của người dùng này thành không mặc định
      if (isDefault) {
        await CustomerInfo.updateMany({ userId }, { isDefault: false });
      }
  
      // Tạo mới khách hàng
      const newCustomer = new CustomerInfo({
        userId,
        name,
        phone,
        email,
        city,
        districts,
        wards,
        address,
        zipcode,
        isDefault: !!isDefault, // Đảm bảo là boolean
      });
  
      // Lưu vào cơ sở dữ liệu
      await newCustomer.save();
  
      return res.status(201).json({
        success: true,
        message: "Khách hàng được tạo thành công!",
        data: newCustomer,
      });
    } catch (error) {
      console.error("Lỗi khi tạo khách hàng:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra trong quá trình tạo khách hàng!",
      });
    }
  };
  

  const getCustomers = async (req, res) => {
    try {
      const { userId } = req.params; // Lấy userId từ tham số URL
  
      // Tìm tất cả các địa chỉ của khách hàng với userId
      const customers = await CustomerInfo.find({ userId });
  
      return res.status(200).json({
        success: true,
        message: "Danh sách địa chỉ của khách hàng!",
        data: customers,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi lấy danh sách địa chỉ!",
      });
    }
  };
  

  const editCustomer = async (req, res) => {
    try {
      const { userId, id } = req.params; // Lấy userId và id từ params
      const { name, phone, email, city, districts, wards, address, zipcode, isDefault } = req.body;
  
      // Kiểm tra xem địa chỉ có tồn tại không
      const customer = await CustomerInfo.findOne({ _id: id, userId });
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ với ID được cung cấp!",
        });
      }
  
      // Nếu isDefault là true, cập nhật các địa chỉ khác thành isDefault: false
      if (isDefault) {
        await CustomerInfo.updateMany({ userId }, { isDefault: false });
      }
  
      // Cập nhật thông tin địa chỉ
      customer.name = name || customer.name;
      customer.phone = phone || customer.phone;
      customer.email = email || customer.email;
      customer.city = city || customer.city;
      customer.districts = districts || customer.districts;
      customer.wards = wards || customer.wards;
      customer.address = address || customer.address;
      customer.zipcode = zipcode || customer.zipcode;
      customer.isDefault = isDefault !== undefined ? isDefault : customer.isDefault;
  
      // Lưu thay đổi vào cơ sở dữ liệu
      await customer.save();
  
      return res.status(200).json({
        success: true,
        message: "Cập nhật địa chỉ thành công!",
        data: customer,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi cập nhật địa chỉ!",
      });
    }
  };
  
  const getCustomerById = async (req, res) => {
    try {
      const { userId } = req.params; 
  
      const customerInfo = await CustomerInfo.findOne({ userId, isDefault: true });
  
      if (!customerInfo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ mặc định cho khách hàng.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Địa chỉ mặc định của khách hàng.",
        data: customerInfo,
      });
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ khách hàng:", error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi lấy địa chỉ khách hàng.",
      });
    }
  };
  

module.exports = { createCustomer, getCustomers, editCustomer, getCustomerById};
