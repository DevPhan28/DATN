const CustomerInfo = require("../models/customerInfor");

// Tạo mới khách hàng
const createCustomer = async (req, res) => {
    try {
      const { name, phone, email, city, districts, wards, address, zipcode, isDefault } = req.body;
  
      // Kiểm tra các trường bắt buộc
      if (!name || !phone || !email || !city || !districts || !wards || !address) {
        return res.status(400).json({
          success: false,
          message: "Các trường name, phone, email, city, districts, wards, address là bắt buộc!",
        });
      }
  
      // Nếu isDefault là true, cập nhật tất cả các địa chỉ khác thành isDefault: false
      if (isDefault) {
        await CustomerInfo.updateMany({}, { isDefault: false });
      }
  
      // Tạo mới khách hàng
      const newCustomer = new CustomerInfo({
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
      const customers = await CustomerInfo.find();
  
      return res.status(200).json({
        success: true,
        message: "Danh sách địa chỉ khách hàng!",
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
      const { id } = req.params; // Lấy id từ params
      const { name, phone, email, city, districts, wards, address, zipcode, isDefault } = req.body;
  
      // Kiểm tra xem địa chỉ có tồn tại không
      const customer = await CustomerInfo.findById(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy địa chỉ với ID được cung cấp!",
        });
      }
  
      // Nếu isDefault là true, cập nhật các địa chỉ khác thành isDefault: false
      if (isDefault) {
        await CustomerInfo.updateMany({}, { isDefault: false });
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

module.exports = { createCustomer, getCustomers, editCustomer };
