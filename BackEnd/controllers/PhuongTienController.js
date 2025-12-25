const PhuongTien = require("../models/PhuongTien");
const HoKhau = require("../models/HoKhau");

exports.getAll = async (req, res) => {
  try {
    const list = await PhuongTien.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.create = async (req, res) => {
  try {
    const { IDHoKhau, owner, plate, type, note } = req.body;

    if (!IDHoKhau || !owner || !plate || !type) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // ⭐ THÊM Ở ĐÂY
    const hoKhau = await HoKhau.findOne({ IDHoKhau });
    if (!hoKhau) {
      return res.status(400).json({
        message: "Mã hộ khẩu không tồn tại!"
      });
    }

    const exists = await PhuongTien.findOne({ plate });
    if (exists) {
      return res.status(400).json({ message: "Biển số đã tồn tại!" });
    }

    const newPT = await PhuongTien.create({
      IDHoKhau,
      owner,
      plate,
      type,
      note
    });

    res.json({ message: "Thêm phương tiện thành công!", data: newPT });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const deleted = await PhuongTien.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy phương tiện!" });
    }

    res.json({ message: "Xoá thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
