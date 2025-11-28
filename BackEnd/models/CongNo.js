const mongoose = require('mongoose');

const CongNoSchema = new mongoose.Schema({
    nhanKhauId: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanKhau', required: true },
    hoKhauId: {type: mongoose.Schema.Types.ObjectId, ref: 'HoKhau', required: true },
    loaiPhi: { type: String, required: true },
    soTien: { type: Number, required: true },
    hanThanhToan: { type: Date, required: true },
    daThanhToan: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CongNo', CongNoSchema);