const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/quanlydancu")
  .then(() => console.log("Kết nối nạp dữ liệu..."));

const HoKhau = mongoose.model(
  "HoKhau",
  new mongoose.Schema({
    IDHoKhau: String,
    TenChuHo: String,
    DiaChi: String,
    NgayLap: String,
  })
);

const NhanKhau = mongoose.model(
  "NhanKhau",
  new mongoose.Schema({
    IDHoKhau: String,
    HoVaTen: String,
    NgaySinh: String,
    GioiTinh: String,
    cccd: String,
    sdt: String,
    QuanHeVoiChuHo: String,
  })
);

const seedData = async () => {
  await HoKhau.deleteMany({});
  await NhanKhau.deleteMany({});

  // 1. Hộ 101
  await HoKhau.create({
    IDHoKhau: "101",
    TenChuHo: "Nguyễn Văn A",
    DiaChi: "Hà Nội",
    NgayLap: "01/01/2023",
  });
  await NhanKhau.insertMany([
    {
      IDHoKhau: "101",
      HoVaTen: "Nguyễn Văn A",
      NgaySinh: "1980-01-01",
      GioiTinh: "Nam",
      cccd: "001080001",
      sdt: "0901",
      QuanHeVoiChuHo: "Chủ Hộ",
    },
    {
      IDHoKhau: "101",
      HoVaTen: "Lê Thị Vợ",
      NgaySinh: "1985-02-02",
      GioiTinh: "Nữ",
      cccd: "001085002",
      sdt: "0902",
      QuanHeVoiChuHo: "Vợ",
    },
  ]);

  // 2. Hộ 102
  await HoKhau.create({
    IDHoKhau: "102",
    TenChuHo: "Trần Thị B",
    DiaChi: "Đà Nẵng",
    NgayLap: "15/05/2023",
  });
  await NhanKhau.insertMany([
    {
      IDHoKhau: "102",
      HoVaTen: "Trần Thị B",
      NgaySinh: "1990-05-05",
      GioiTinh: "Nữ",
      cccd: "001090003",
      sdt: "0903",
      QuanHeVoiChuHo: "Chủ Hộ",
    },
  ]);

  console.log("✅ Đã nạp dữ liệu thành công!");
  process.exit();
};

seedData();
