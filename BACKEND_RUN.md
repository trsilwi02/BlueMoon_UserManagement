# Hướng dẫn chạy & kiểm tra backend

Dưới đây là các bước cơ bản để chạy và kiểm tra backend Node.js/Express của bạn.

Yêu cầu trước
- Node.js (khuyến nghị >= 16, tốt nhất là 18+)
- npm hoặc yarn
- MongoDB (local hoặc Atlas). Nếu dùng Atlas, có chuỗi kết nối (connection string).
- Biết file entry point của server (ví dụ `index.js`, `app.js` hoặc `server.js`) hoặc script `start` trong `package.json`.

1) Cài đặt phụ thuộc
- Mở terminal tại thư mục project:
  - npm: `npm install`
  - yarn: `yarn`

2) Thiết lập biến môi trường
Tạo file `.env` ở gốc project (nếu project dùng dotenv) và thêm biến cần thiết, ví dụ:
