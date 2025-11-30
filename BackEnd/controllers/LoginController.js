const User = require('../models/User');

// LOGIN — kiểm tra username và password dạng thô
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Tìm user theo username
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Kiểm tra password dạng thô
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
