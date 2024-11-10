const bcryptjs = require("bcryptjs");
const { registerSchema, signinSchema } = require("../schemas/auth");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Mail = require("../helpers/node-mailler");

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

module.exports = {
  signin,
  signup,
  requestResetPassword,
  processResetPassword,
  updatePassword,
  getAllUsers, 
};
