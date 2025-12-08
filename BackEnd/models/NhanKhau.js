const mongoose = require("mongoose");

const NhanKhauSchema = new mongoose.Schema({
  HoVaTen: { type: String, required: true },
  NgaySinh: { type: String, required: true },   
  GioiTinh: { type: String, required: true },
  cccd: { type: String, required: true },
  sdt: { type: String, required: true },
  QuanHeVoiChuHo: { type: String, default: "" },
  IDHoKhau: { type: String, required: true },   
  diaChi: { type: String, default: "" }
});

module.exports = mongoose.model("NhanKhau", NhanKhauSchema);
