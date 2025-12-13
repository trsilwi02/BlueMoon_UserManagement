const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000; // Khớp với Frontend của bạn

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- 1. KẾT NỐI MONGODB ---
// Đảm bảo MongoDB đã bật ở máy bạn (mongodb://127.0.0.1:27017)
mongoose
  .connect("mongodb://127.0.0.1:27017/quanlynhankhau", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// --- 2. ĐỊNH NGHĨA MODEL (SCHEMA) ---

// Schema Hộ Khẩu
const HoKhauSchema = new mongoose.Schema({
  IDHoKhau: { type: String, required: true, unique: true }, // Khóa chính của hộ
  TenChuHo: String,
  DiaChi: String,
  NgayLap: String, // Lưu dạng string DD/MM/YYYY cho đơn giản giống frontend
});

// Schema Nhân Khẩu
const NhanKhauSchema = new mongoose.Schema({
  cccd: { type: String, required: true, unique: true }, // Dùng CCCD làm khóa chính theo yêu cầu
  HoVaTen: String,
  NgaySinh: String, // YYYY-MM-DD (format từ input type date)
  GioiTinh: String,
  sdt: String,
  IDHoKhau: String, // Khóa ngoại liên kết với HoKhau
  QuanHeVoiChuHo: String,
});

const HoKhau = mongoose.model("HoKhau", HoKhauSchema);
const NhanKhau = mongoose.model("NhanKhau", NhanKhauSchema);

// --- 3. API ROUTES ---

// ================== API HỘ KHẨU ==================

// Lấy danh sách hộ khẩu (kèm số lượng thành viên)
app.get("/api/hokhau", async (req, res) => {
  try {
    const listHoKhau = await HoKhau.find();
    // Tính toán số thành viên cho mỗi hộ
    const result = await Promise.all(
      listHoKhau.map(async (ho) => {
        const count = await NhanKhau.countDocuments({ IDHoKhau: ho.IDHoKhau });
        return {
          ...ho._doc,
          soThanhVien: count,
        };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm mới hộ khẩu (Đồng thời tạo luôn Chủ Hộ vào bảng Nhân Khẩu)
app.post("/api/hokhau", async (req, res) => {
  const { IDHoKhau, TenChuHo, DiaChi, NgaySinh, cccd, sdt, NgayLap } = req.body;

  try {
    // 1. Kiểm tra trùng
    const existHo = await HoKhau.findOne({ IDHoKhau });
    if (existHo)
      return res.status(400).json({ message: "Mã hộ khẩu đã tồn tại!" });

    const existNhanKhau = await NhanKhau.findOne({ cccd });
    if (existNhanKhau)
      return res.status(400).json({ message: "Số CCCD chủ hộ đã tồn tại!" });

    // 2. Tạo Hộ Khẩu
    const newHoKhau = new HoKhau({ IDHoKhau, TenChuHo, DiaChi, NgayLap });
    await newHoKhau.save();

    // 3. Tạo Nhân Khẩu (Chủ hộ)
    const newChuHo = new NhanKhau({
      cccd,
      HoVaTen: TenChuHo,
      NgaySinh,
      GioiTinh: "Nam", // Mặc định hoặc cần thêm field giới tính ở form Hộ khẩu
      sdt,
      IDHoKhau,
      QuanHeVoiChuHo: "Chủ hộ",
    });
    await newChuHo.save();

    res.status(201).json({ message: "Thêm hộ khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa hộ khẩu (Xóa luôn tất cả thành viên trong hộ đó)
app.delete("/api/hokhau/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await HoKhau.findOneAndDelete({ IDHoKhau: id });
    await NhanKhau.deleteMany({ IDHoKhau: id }); // Xóa sạch thành viên
    res.json({ message: "Đã xóa hộ khẩu và các thành viên" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== API NHÂN KHẨU ==================

// Lấy danh sách TẤT CẢ nhân khẩu (dùng cho trang Nhân Khẩu chính)
// Kết hợp (Lookup) để lấy địa chỉ từ bảng Hộ Khẩu
app.get("/api/nhankhau", async (req, res) => {
  try {
    // Lấy nhân khẩu và join với bảng HoKhau để lấy DiaChi
    const data = await NhanKhau.aggregate([
      {
        $lookup: {
          from: "hokhaus", // Tên collection trong MongoDB (thường là tên model + 's')
          localField: "IDHoKhau",
          foreignField: "IDHoKhau",
          as: "thongTinHo",
        },
      },
      {
        $project: {
          HoVaTen: 1,
          NgaySinh: 1,
          GioiTinh: 1,
          cccd: 1,
          sdt: 1,
          IDHoKhau: 1,
          QuanHeVoiChuHo: 1,
          DiaChi: { $arrayElemAt: ["$thongTinHo.DiaChi", 0] }, // Lấy trường DiaChi từ mảng lookup
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy danh sách thành viên theo IDHoKhau (dùng cho trang Chi tiết hộ)
app.get("/api/nhankhau/:idHoKhau", async (req, res) => {
  try {
    const members = await NhanKhau.find({ IDHoKhau: req.params.idHoKhau });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm thành viên mới
app.post("/api/nhankhau", async (req, res) => {
  try {
    const { cccd } = req.body;
    // Validate trùng CCCD
    const exist = await NhanKhau.findOne({ cccd });
    if (exist) return res.status(400).json({ message: "CCCD đã tồn tại!" });

    const newMember = new NhanKhau(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa thành viên (Tìm theo CCCD cũ)
// Lưu ý: Nếu muốn sửa cả số CCCD, logic sẽ phức tạp hơn. Ở đây giả định sửa các info khác.
app.put("/api/nhankhau/:cccd", async (req, res) => {
  try {
    const updatedMember = await NhanKhau.findOneAndUpdate(
      { cccd: req.params.cccd },
      req.body,
      { new: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa thành viên (Tìm theo CCCD)
app.delete("/api/nhankhau/:cccd", async (req, res) => {
  try {
    await NhanKhau.findOneAndDelete({ cccd: req.params.cccd });
    res.json({ message: "Đã xóa thành viên" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. DATA SEEDING (Dữ liệu mẫu để test) ---
app.get("/api/seed", async (req, res) => {
  await HoKhau.deleteMany({});
  await NhanKhau.deleteMany({});

  const hokhauMau = [
    {
      IDHoKhau: "HK001",
      TenChuHo: "Nguyễn Văn A",
      DiaChi: "123 Giải Phóng",
      NgayLap: "01/01/2023",
    },
    {
      IDHoKhau: "HK002",
      TenChuHo: "Trần Thị B",
      DiaChi: "456 Lê Thanh Nghị",
      NgayLap: "15/05/2023",
    },
  ];

  const nhankhauMau = [
    {
      cccd: "001234567890",
      HoVaTen: "Nguyễn Văn A",
      NgaySinh: "1980-01-01",
      GioiTinh: "Nam",
      sdt: "0901234567",
      IDHoKhau: "HK001",
      QuanHeVoiChuHo: "Chủ hộ",
    },
    {
      cccd: "001234567891",
      HoVaTen: "Lê Thị C",
      NgaySinh: "1982-02-02",
      GioiTinh: "Nữ",
      sdt: "0901111111",
      IDHoKhau: "HK001",
      QuanHeVoiChuHo: "Vợ",
    },
    {
      cccd: "001234567892",
      HoVaTen: "Trần Thị B",
      NgaySinh: "1990-05-05",
      GioiTinh: "Nữ",
      sdt: "0912345678",
      IDHoKhau: "HK002",
      QuanHeVoiChuHo: "Chủ hộ",
    },
  ];

  await HoKhau.insertMany(hokhauMau);
  await NhanKhau.insertMany(nhankhauMau);

  res.json({ message: "Đã reset và tạo dữ liệu mẫu thành công!" });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});
