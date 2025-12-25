const mongoose = require("mongoose");

const PhuongTienSchema = new mongoose.Schema(
  {
    IDHoKhau: { type: String, required: true },
    owner: { type: String, required: true },
    plate: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    note: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhuongTien", PhuongTienSchema);
