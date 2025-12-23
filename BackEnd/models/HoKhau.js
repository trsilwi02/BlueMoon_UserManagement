const mongoose = require("mongoose");

const HoKhauSchema = new mongoose.Schema({
  IDHoKhau: { type: String, required: true, unique: true },
  DiaChi: { type: String, required: true },

  TenChuHo: { type: String, required: true },
  NgaySinh: { type: String, required: true },
  cccd: { type: String, required: true },
  sdt: { type: String, required: true },

  NgayLap: { type: String, required: true },
  soThanhVien: { type: Number, default: 1 }
});

module.exports = mongoose.model("HoKhau", HoKhauSchema);
