const mongoose = require('mongoose');

const QuySchema = new mongoose.Schema({
    tenQuy: { type: String, required: true },
    moTa: { type: String },
    tongSoTien: { type: Number, default: 0, required: true },
    mucTieu: { type: Number },
    ghiChu: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Quy', QuySchema);
