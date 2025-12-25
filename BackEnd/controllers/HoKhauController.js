const HoKhau = require("../models/HoKhau");
const NhanKhau = require("../models/NhanKhau");
const CongNo = require("../models/CongNo");
const PhuongTien = require("../models/PhuongTien");

/**
 * ===============================
 * Lấy tất cả hộ khẩu
 * GET /api/hokhau
 * ===============================
 */
exports.getAll = async (req, res) => {
  try {
    const data = await HoKhau.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Lấy hộ khẩu theo IDHoKhau
 * GET /api/hokhau/:id
 * ===============================
 */
exports.getId = async (req, res) => {
  try {
    const hk = await HoKhau.findOne({ IDHoKhau: req.params.id });

    if (!hk) {
      return res.status(404).json({ message: "Không tìm thấy hộ khẩu!" });
    }

    res.json(hk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Thêm hộ khẩu
 * POST /api/hokhau
 * 👉 TỰ ĐỘNG TẠO NHÂN KHẨU CHỦ HỘ
 * ===============================
 */
exports.create = async (req, res) => {
  try {
    const {
      IDHoKhau,
      DiaChi,
      TenChuHo,
      NgaySinh,
      GioiTinh,
      cccd,
      sdt,
      NgayLap
    } = req.body;

    // 1️⃣ Kiểm tra trùng mã hộ
    const exists = await HoKhau.findOne({ IDHoKhau });
    if (exists) {
      return res.status(400).json({ message: "Mã hộ khẩu đã tồn tại!" });
    }

    // 2️⃣ Tạo HỘ KHẨU
    const newHoKhau = await HoKhau.create({
      IDHoKhau,
      DiaChi,
      TenChuHo,
      NgaySinh,
      cccd,
      sdt,
      NgayLap,
      soThanhVien: 1
    });

    // 3️⃣ Tạo NHÂN KHẨU = CHỦ HỘ ⭐
    await NhanKhau.create({
      HoVaTen: TenChuHo,
      NgaySinh,
      GioiTinh: GioiTinh || "Khác",
      cccd,
      sdt,
      QuanHeVoiChuHo: "Chủ hộ",
      IDHoKhau,
      diaChi: DiaChi
    });

    res.status(201).json({
      message: "Thêm hộ khẩu và chủ hộ thành công!",
      data: newHoKhau
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Cập nhật hộ khẩu
 * PUT /api/hokhau/:id
 * (KHÔNG sửa chủ hộ ở đây)
 * ===============================
 */
exports.update = async (req, res) => {
  try {
    const updated = await HoKhau.findOneAndUpdate(
      { IDHoKhau: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Hộ khẩu không tồn tại!" });
    }

    res.json({
      message: "Cập nhật hộ khẩu thành công!",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Xóa hộ khẩu
 * DELETE /api/hokhau/:id
 * 👉 XÓA LUÔN TOÀN BỘ NHÂN KHẨU
 * ===============================
 */
exports.delete = async (req, res) => {
  try {
    const idHoKhau = req.params.id;

    // 1️⃣ Kiểm tra hộ khẩu
    const hk = await HoKhau.findOne({ IDHoKhau: idHoKhau });
    if (!hk) {
      return res.status(404).json({ message: "Hộ khẩu không tồn tại!" });
    }

    // 2️⃣ XÓA TOÀN BỘ NHÂN KHẨU
    await NhanKhau.deleteMany({ IDHoKhau: idHoKhau });

    // 3️⃣ XÓA TOÀN BỘ CÔNG NỢ
    await CongNo.deleteMany({ hoKhauId: hk._id });

    //Xoa phuong tien
    await PhuongTien.deleteMany({ IDHoKhau });

    // 4️⃣ XÓA HỘ KHẨU
    await HoKhau.findOneAndDelete({ IDHoKhau: idHoKhau });

    res.json({
      message: "Đã xóa hộ khẩu, nhân khẩu và toàn bộ công nợ liên quan!"
    });

  } catch (error) {
    console.error("Lỗi xóa hộ khẩu:", error);
    res.status(500).json({ message: error.message });
  }
};
