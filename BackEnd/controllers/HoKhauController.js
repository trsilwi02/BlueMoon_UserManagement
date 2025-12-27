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
 * 👉 Tự động:
 *  - Tạo nhân khẩu (chủ hộ)
 *  - Tạo công nợ khởi tạo (0 đồng)
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

    /* ========= VALIDATE ========= */
    if (!IDHoKhau || !TenChuHo || !DiaChi || !cccd || !sdt) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin bắt buộc!"
      });
    }

    if (!/^\d{12}$/.test(cccd)) {
      return res.status(400).json({
        message: "CCCD phải gồm đúng 12 chữ số!"
      });
    }

    if (!/^\d{10}$/.test(sdt)) {
      return res.status(400).json({
        message: "Số điện thoại phải gồm đúng 10 chữ số!"
      });
    }

    const cccdExists = await NhanKhau.findOne({ cccd });
    if (cccdExists) {
      return res.status(400).json({
        message: "CCCD đã tồn tại trong hệ thống!"
      });
    }

    const exists = await HoKhau.findOne({ IDHoKhau });
    if (exists) {
      return res.status(400).json({
        message: "Mã hộ khẩu đã tồn tại!"
      });
    }

    /* ========= TẠO HỘ KHẨU ========= */
    const newHoKhau = await HoKhau.create({
      IDHoKhau,
      DiaChi,
      TenChuHo,
      NgaySinh,
      GioiTinh: GioiTinh || "Khác",
      cccd,
      sdt,
      NgayLap,
      soThanhVien: 1
    });

    /* ========= TẠO NHÂN KHẨU = CHỦ HỘ ========= */
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

    /* ========= TẠO CÔNG NỢ KHỞI TẠO (0 ĐỒNG) ========= */
    await CongNo.create({
      hoKhauId: newHoKhau._id,
      loaiPhi: "ql",
      soTien: 0,
      hanThanhToan: new Date(),
      daThanhToan: true
    });

    res.status(201).json({
      message: "Thêm hộ khẩu, chủ hộ và công nợ khởi tạo thành công!",
      data: newHoKhau
    });

  } catch (error) {
    console.error("Lỗi tạo hộ khẩu:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * Cập nhật hộ khẩu
 * PUT /api/hokhau/:id
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
      return res.status(404).json({
        message: "Hộ khẩu không tồn tại!"
      });
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
 * 👉 Nếu còn công nợ chưa thanh toán → yêu cầu xác nhận
 * ===============================
 */
exports.delete = async (req, res) => {
  try {
    const idHoKhau = req.params.id;

    const hk = await HoKhau.findOne({ IDHoKhau: idHoKhau });
    if (!hk) {
      return res.status(404).json({
        message: "Hộ khẩu không tồn tại!"
      });
    }

    /* ===== KIỂM TRA CÒN CÔNG NỢ CHƯA THANH TOÁN ===== */
    const conNoChuaTra = await CongNo.findOne({
      hoKhauId: hk._id,
      daThanhToan: false
    });

    if (conNoChuaTra) {
      return res.status(409).json({
        message: "Hộ khẩu vẫn còn công nợ, bạn có chắc chắn muốn xóa chứ?",
        requireConfirm: true
      });
    }

    /* ===== XÓA TOÀN BỘ DỮ LIỆU LIÊN QUAN ===== */
    await NhanKhau.deleteMany({ IDHoKhau: idHoKhau });
    await CongNo.deleteMany({ hoKhauId: hk._id });
    await PhuongTien.deleteMany({ IDHoKhau: idHoKhau });
    await HoKhau.findOneAndDelete({ IDHoKhau: idHoKhau });

    res.json({
      message: "Đã xóa hộ khẩu, nhân khẩu và toàn bộ công nợ liên quan!"
    });

  } catch (error) {
    console.error("Lỗi xóa hộ khẩu:", error);
    res.status(500).json({ message: error.message });
  }
};
