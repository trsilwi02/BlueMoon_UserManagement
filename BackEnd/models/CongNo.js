const mongoose = require('mongoose');

const CongNoSchema = new mongoose.Schema({
  hoKhauId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HoKhau',
    required: true
  },

  loaiPhi: {
    type: String,
    enum: ['dien', 'nuoc', 'rac', 'ql'],
    required: true
  },

  soTien: {
    type: Number,
    required: true
  },

  hanThanhToan: {
    type: Date,
    required: true
  },

  daThanhToan: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('CongNo', CongNoSchema);
