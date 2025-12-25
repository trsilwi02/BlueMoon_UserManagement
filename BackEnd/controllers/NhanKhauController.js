const NhanKhau = require("../models/NhanKhau");
const HoKhau = require("../models/HoKhau");

exports.getAll = async (req, res) => {
  try {
    const list = await NhanKhau.aggregate([
      {
        $lookup: {
          from: "hokhaus",          // collection HoKhau
          localField: "IDHoKhau",   // string trong NhanKhau
          foreignField: "IDHoKhau", // string trong HoKhau
          as: "hoKhau"
        }
      },
      {
        $unwind: {
          path: "$hoKhau",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          DiaChi: "$hoKhau.DiaChi"
        }
      },
      {
        $project: {
          hoKhau: 0 // ẩn object thừa
        }
      }
    ]);

    res.json(list);
  } catch (error) {
    console.error("Lỗi getAll nhân khẩu:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * ===============================
 * Lấy nhân khẩu theo ID hộ khẩu (info_family)
 * GET /api/nhankhau/hokhau/:id
 * ===============================
 */
exports.getByHoKhau = async (req, res) => {
  try {
    const list = await NhanKhau.find({ IDHoKhau: req.params.id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Thêm nhân khẩu
 * POST /api/nhankhau
 * → TĂNG soThanhVien trong HoKhau
 * ===============================
 */
exports.create = async (req, res) => {
  try {
    const nk = await NhanKhau.create(req.body);

    // 🔥 Tăng số thành viên
    await HoKhau.findOneAndUpdate(
      { IDHoKhau: req.body.IDHoKhau },
      { $inc: { soThanhVien: 1 } }
    );

    res.json({
      message: "Thêm nhân khẩu thành công!",
      data: nk
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Cập nhật nhân khẩu
 * PUT /api/nhankhau/:id
 * (KHÔNG ảnh hưởng số thành viên)
 * ===============================
 */
exports.update = async (req, res) => {
  try {
    const updated = await NhanKhau.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy nhân khẩu!" });
    }

    res.json({
      message: "Cập nhật nhân khẩu thành công!",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Xóa nhân khẩu
 * DELETE /api/nhankhau/:id
 * → GIẢM soThanhVien trong HoKhau
 * ===============================
 */
exports.delete = async (req, res) => {
  try {
    const nk = await NhanKhau.findById(req.params.id);

    if (!nk) {
      return res.status(404).json({ message: "Không tìm thấy nhân khẩu!" });
    }

    await NhanKhau.findByIdAndDelete(req.params.id);

    // 🔥 Giảm số thành viên
    await HoKhau.findOneAndUpdate(
      { IDHoKhau: nk.IDHoKhau },
      { $inc: { soThanhVien: -1 } }
    );

    res.json({ message: "Xóa nhân khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
