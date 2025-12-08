const NhanKhau = require("../models/NhanKhau");

// ===============================
// Lấy toàn bộ nhân khẩu (nhankhau.html)
// ===============================
exports.getAll = async (req, res) => {
  try {
    const list = await NhanKhau.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Lấy nhân khẩu theo ID hộ khẩu (info_family)
// ===============================
exports.getByHoKhau = async (req, res) => {
  try {
    const list = await NhanKhau.find({ IDHoKhau: req.params.id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Thêm nhân khẩu
// ===============================
exports.create = async (req, res) => {
  try {
    const nk = await NhanKhau.create(req.body);
    res.json({ message: "Thêm nhân khẩu thành công!", data: nk });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Cập nhật nhân khẩu
// ===============================
exports.update = async (req, res) => {
  try {
    const updated = await NhanKhau.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy nhân khẩu!" });

    res.json({ message: "Cập nhật thành công!", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Xoá nhân khẩu
// ===============================
exports.delete = async (req, res) => {
  try {
    const deleted = await NhanKhau.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy nhân khẩu!" });

    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
