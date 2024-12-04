const bcryptjs = require("bcryptjs");
const { registerSchema, signinSchema } = require("../schemas/auth");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Mail = require("../helpers/node-mailler");
const mongoose = require("mongoose");

const signup = async (req, res) => {
  try {
    // lấy dữ liệu từ client gửi lên : req.body
    const { username, email, password, confirmPassword, avatar } = req.body;

    // kiểm tra dữ liệu từ client gửi lên có đúng với schema không
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(({ message }) => message);
      return res.status(400).json({
        messages,
      });
    }

    // kiểm tra email có tồn tại trong db chưa
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        messages: "Email đã tồn tại",
      });
    }

    // mã hóa password
    const hashPassword = await bcryptjs.hash(password, 10);
    const role = (await User.countDocuments({})) === 0 ? "admin" : "user";

    // tạo mới user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      avatar,
      role,
    });

    const token = jwt.sign({ userId: user._id }, "123456", { expiresIn: "1h" });

    // trả về client thông tin user vừa tạo
    user.password = undefined;
    return res.status(201).json({
      messages: "Đăng ký thành công",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      messages: error.message,
    });
  }
};

const signin = async (req, res) => {
  // lấy dữ liệu từ client gửi lên : req.body
  const { email, password } = req.body;
  // kiểm tra dữ liệu từ client gửi lên có đúng với schema không
  const { error } = signinSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((error) => error.message);
    return res.status(400).json({
      messages,
    });
  }
  const user = await User.findOne({ email });
  // nếu đúng thì kiểm xem email có tồn tại trong db chưa
  if (!user) {
    return res.status(400).json({
      messages: "Tài khoản không tồn tại",
    });
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  // so sánh mật khẩu client gửi lên với mật khẩu user có khớp nhau không?
  if (!isMatch) {
    return res.status(400).json({
      messages: "Password không đúng",
    });
  }
  // nếu khớp thì tạo token và trả về client
  const token = await jwt.sign({ userId: user._id }, "123456");

  return res.status(200).json({
    message: "Đăng nhập thành công",
    user,
    token,
  });
};

let EMAIL = null;

const requestResetPassword = async (req, res) => {
  // get email ( user nhập vào email)
  try {
    const { email } = req.body;
    // check email có tôn tại trên hệ thống
    const accounts = await User.find();
    const emails = accounts.map((acc) => acc.email);

    if (!emails.includes(email)) res.json("Invalid Email");

    EMAIL = email;

    // create token
    const resetPasswordToken = jwt.sign(
      {
        data: "resetpassword",
      },
      "SECRET",
      {
        expiresIn: 60,
      }
    );
    // send email with code
    if (!resetPasswordToken) return;
    const messageId = Mail.sendResetPassword(email, resetPasswordToken);
    res.json(messageId);
  } catch (error) {
    console.log(error);
  }
};

//http://localhost:5173/reset-password?code=12345

const processResetPassword = async (req, res) => {
  const { code } = req.body;
  if (!code) return;

  // check expires code
  try {
    const decoded = jwt.verify(code, "SECRET");
    res.json("Token Valid");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.json({
        message: "Token expired",
      });
    } else {
      res.json("Token is invalid:", error.message);
    }
  }
};

// client send { newPasword: ... }
const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return;
  try {
    // mã hóa password
    const hashPassword = await bcryptjs.hash(newPassword, 10);
    // tạo mới user
    const result = await User.updateOne(
      { email: EMAIL },
      { password: hashPassword }
    );

    if (result.modifiedCount > 0) {
      res.json("Reset password success!");
    } else {
      res.json("No user found with this email.");
    }
  } catch (error) {
    res.json("error while hash new password");
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // If no users are found
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    // Return the users
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};
const getUserInfo = async (req, res) => {
  // Lấy userId từ header (ví dụ: từ 'user-id' header)
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(400).json({
      message: "userId is required in header",
    });
  }

  // Kiểm tra xem userId có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid userId format",
    });
  }

  try {
    // Tìm người dùng trong database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Không trả về password để bảo mật
    user.password = undefined;

    return res.status(200).json({
      message: "User information fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching user information",
      error: error.message,
    });
  }
};
const updateAccount = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ URL params
  const { username, email, avatar, oldPassword, newPassword, confirmPassword } =
    req.body;

  try {
    // Kiểm tra xem username hoặc email có tồn tại trong hệ thống không
    const existUserByUsername = await User.findOne({ username });
    if (existUserByUsername && existUserByUsername._id.toString() !== userId) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const existUserByEmail = await User.findOne({ email });
    if (existUserByEmail && existUserByEmail._id.toString() !== userId) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Tìm người dùng trong database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Kiểm tra định dạng email (tuỳ chọn)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Kiểm tra mật khẩu (nếu có) phải có độ dài tối thiểu (tuỳ chọn)
    if (newPassword && newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Kiểm tra nếu không có thay đổi
    if (
      user.username === username &&
      user.email === email &&
      user.avatar === avatar &&
      !newPassword // Kiểm tra nếu không có thay đổi mật khẩu
    ) {
      return res.status(400).json({ message: "No changes detected" });
    }

    // Nếu có thay đổi mật khẩu, kiểm tra mật khẩu cũ
    if (newPassword) {
      // Kiểm tra mật khẩu cũ
      if (!oldPassword) {
        return res.status(400).json({
          message: "Old password is required to change password", // Nếu mật khẩu cũ không có, thông báo lỗi
        });
      }

      const isOldPasswordValid = await bcryptjs.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return res.status(400).json({
          message: "Mật khẩu cũ không đúng", // Thông báo khi mật khẩu cũ không đúng
        });
      }

      // Kiểm tra mật khẩu mới và mật khẩu xác nhận phải giống nhau
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Mật khẩu mới và xác nhận không khớp",
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Cập nhật thông tin người dùng
    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    // Lưu lại thông tin cập nhật vào database
    await user.save();

    // Trả về thông tin người dùng sau khi cập nhật (không bao gồm password)
    user.password = undefined;

    return res.status(200).json({
      message: "Account updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating account",
      error: error.message,
    });
  }
};

const verifyOldPassword = async (req, res) => {
  const { userId, oldPassword } = req.body;

  if (!userId || !oldPassword) {
    return res.status(400).json({
      message: "userId và oldPassword là bắt buộc",
    });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // So sánh mật khẩu cũ với mật khẩu trong cơ sở dữ liệu
    const isMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu cũ không chính xác",
      });
    }

    // Nếu mật khẩu cũ chính xác
    return res.status(200).json({
      message: "Mật khẩu cũ chính xác",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi xác minh mật khẩu cũ",
      error: error.message,
    });
  }
};

module.exports = {
  signin,
  signup,
  requestResetPassword,
  processResetPassword,
  updatePassword,
  getAllUsers,
  getUserInfo,
  updateAccount,
  verifyOldPassword,
};
