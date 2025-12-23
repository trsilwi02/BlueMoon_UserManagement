const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const mongoURI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Đã kết nối thành công tới MongoDB Atlas!");

    // Start server
    app.listen(3000, () => console.log("Server chạy port 3000"));

    // ====== REQUIRE CÁC ROUTES ======
    const UserRoute = require("./routes/UserRoute.js");

    const NhanKhauRoute = require("./routes/NhanKhauRoute.js");
    const HoKhauRoute = require("./routes/HoKhauRoute.js");
    const CongNoRoute = require("./routes/CongNoRoute.js");
    const QuyRoute = require("./routes/QuyRoute.js");

    // ====== SỬ DỤNG API ======
    app.use("/api/user", UserRoute);
    app.use("/api/nhankhau", NhanKhauRoute);  // ⭐ Module mới
    app.use("/api/hokhau", HoKhauRoute);
    app.use("/api/congno", CongNoRoute);
    app.use("/api/quy", QuyRoute);

  } catch (err) {
    console.error("❌ Time limit exceed:", err.message);
  }
};

startServer();