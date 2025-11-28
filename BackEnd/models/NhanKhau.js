const mongoose = require('mongoose');

const NhanKhauSchema = new mongoose.Schema({
    hoTen: { type: String, required: true },
    ngaySinh: { type: Date, required: true },
    gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"], required: true },
    soCCCD: { type: String, required: true, unique: true },
    diaChi: { type: String},
    diaChiTamTru: { type: String },
    sdt: { type: String },
    ngheNghiep: { type: String },
    hoKhauId: { type: mongoose.Schema.Types.ObjectId, ref: 'HoKhau' },
}, { timestamps: true });

module.exports = mongoose.model('NhanKhau', NhanKhauSchema);

