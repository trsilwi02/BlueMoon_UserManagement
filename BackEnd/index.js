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

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Đã kết nối thành công tới MongoDB Atlas!"))
  .catch(err => console.error('❌ Kết nối MongoDB thất bại:', err.message));

// Định nghĩa model (cái khuôn - chức năng tương tự tảo bảng)

// 