const express = require("express");
const cors = require("cors");
// 1. Import Mongoose và dotenv
const mongoose = require("mongoose");
require('dotenv').config(); // Đọc file .env

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối với Mongoose Atlas (đọc từ file .env)
const mongoURI = process.env.MONGODB_URI;
const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Đã kết nối thành công tới MongoDB Atlas!");
    // Start server sau khi DB connect
    app.listen(3000, () => console.log("Server chạy port 3000"));
    // tích hợp API 
    const NhanKhauRoute = require('./routes/NhanKhauRoute.js');
    const HoKhauRoute = require('./routes/HoKhauRoute.js');
    const CongNoRoute = require('./routes/CongNoRoute.js');
    const QuyRoute = require('./routes/QuyRoute.js');

    // sử dụng api
    app.use('/api/nhankhau', NhanKhauRoute);
    app.use('/api/hokhau', HoKhauRoute);
    app.use('/api/congno', CongNoRoute);
    app.use('/api/quy', QuyRoute);


  } catch (err) {
    console.error('❌ Time limit exceed:', err.message);
  }
};

startServer();

/*
mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Đã kết nối thành công tới MongoDB Atlas!");
    console.log("hehehehehehehehe");
    app.listen(3000, () => console.log("Server chạy port 3000"));
    })
  .catch(err => console.error('❌ Kết nối MongoDB thất bại:', err.message));
*/
// Định nghĩa model (cái khuôn - chức năng tương tự tảo bảng)

// test ở port 3000
