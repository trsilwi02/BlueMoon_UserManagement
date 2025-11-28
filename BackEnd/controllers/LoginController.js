// ... existing code ...
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
        const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Nếu cần trả thêm thông tin (ví dụ JWT) thì tạo token ở đây.
    // Hiện tại trả về thông tin user đã loại bỏ password bởi toJSON() trong model.
    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
