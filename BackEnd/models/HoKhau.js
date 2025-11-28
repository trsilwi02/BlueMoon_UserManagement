const mongoose = require('mongoose');

const HoKhauSchema = new mongoose.Schema({
    maHoKhau: { type: String, required: true, unique: true },
    diaChi: { type: String, required: true },
    idChuHo: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanKhau', required: true },
    idThanhVien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NhanKhau' }],
}, { timestamps: true });

module.exports = mongoose.model('HoKhau', HoKhauSchema);