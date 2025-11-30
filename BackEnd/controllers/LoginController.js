const User = require('../models/User');

// ĐĂNG NHẬP — kiểm tra username và password dạng thô
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ username và password.' });
    }

    // Tìm user theo username
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    // So sánh mật khẩu thô
    if (user.password !== password) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    // Đăng nhập thành công
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
};
