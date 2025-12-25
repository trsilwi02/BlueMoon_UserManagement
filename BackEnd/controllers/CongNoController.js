const CongNo = require('../models/CongNo');
const HoKhau = require('../models/HoKhau');

/**
 * =================================================
 * API TỔNG HỢP CÔNG NỢ (PHỤC VỤ FRONTEND)
 * GET /api/congno/summary
 * =================================================
 */
exports.getSummary = async (req, res) => {
  try {
    const congNos = await CongNo.find()
      .populate('hoKhauId', 'IDHoKhau TenChuHo');

    const resultMap = {};

    congNos.forEach(item => {
      // Nếu không populate được thì bỏ qua (nhưng có log)
      if (!item.hoKhauId) {
        console.warn('⚠️ Công nợ không map được hộ khẩu:', item._id);
        return;
      }

      const maHo = item.hoKhauId.IDHoKhau;
      const tenChuHo = item.hoKhauId.TenChuHo;

      // Kỳ theo tháng/năm tạo công nợ
      const ky = new Date(item.createdAt)
        .toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

      if (!resultMap[maHo]) {
        resultMap[maHo] = {
          maHo,
          tenChuHo,
          ky,
          tongTien: 0,
          conNo: 0,
          chiTiet: {
            dien: 0,
            nuoc: 0,
            rac: 0,
            ql: 0
          }
        };
      }

      // Tổng tiền
      resultMap[maHo].tongTien += item.soTien;

      // Còn nợ
      if (!item.daThanhToan) {
        resultMap[maHo].conNo += item.soTien;
      }

      // Chi tiết theo loại phí
      if (resultMap[maHo].chiTiet[item.loaiPhi] !== undefined) {
        resultMap[maHo].chiTiet[item.loaiPhi] += item.soTien;
      }
    });

    res.json(Object.values(resultMap));

  } catch (error) {
    console.error('❌ Lỗi API summary công nợ:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * =================================================
 * CRUD CÔNG NỢ
 * =================================================
 */

// Lấy tất cả công nợ
exports.getAll = async (req, res) => {
  try {
    const list = await CongNo.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy công nợ theo ID
exports.getId = async (req, res) => {
  try {
    const item = await CongNo.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Công nợ không tồn tại' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ THÊM CÔNG NỢ (ĐÃ FIX MAP HỘ KHẨU)
exports.create = async (req, res) => {
  try {
    const { hoKhauId, loaiPhi, soTien, hanThanhToan } = req.body;

    // hoKhauId frontend gửi là IDHoKhau (VD: HK001)
    const hoKhau = await HoKhau.findOne({ IDHoKhau: hoKhauId });

    if (!hoKhau) {
      return res.status(400).json({ message: 'Hộ khẩu không tồn tại' });
    }

    const newItem = await CongNo.create({
      hoKhauId: hoKhau._id, // ✅ ObjectId chuẩn
      loaiPhi,
      soTien,
      hanThanhToan,
      daThanhToan: false
    });

    res.json({
      message: 'Thêm công nợ thành công',
      data: newItem
    });

  } catch (err) {
    console.error('❌ Lỗi thêm công nợ:', err);
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật công nợ
exports.update = async (req, res) => {
  try {
    const updated = await CongNo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Công nợ không tồn tại' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa công nợ
exports.delete = async (req, res) => {
  try {
    const deleted = await CongNo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Công nợ không tồn tại' });
    }

    res.json({ message: 'Xóa công nợ thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
