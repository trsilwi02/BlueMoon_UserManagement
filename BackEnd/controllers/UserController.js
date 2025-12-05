const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập username và password" });
    }

    // Check username tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        username: newUser.username
      }
    });

  } catch (err) {
    console.log("Lỗi register:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
