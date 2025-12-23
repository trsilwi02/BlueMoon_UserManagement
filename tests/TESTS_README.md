Hướng dẫn vị trí và cách chạy tests

1) Vị trí file test
- Đặt file test vào thư mục `tests` ở gốc project.
  Ví dụ: `./tests/user.test.js`
- Bạn có thể dùng tên khác nhưng nên tuân theo quy ước:
  - `tests/*.test.js` hoặc `__tests__/*.(test|spec).js`

2) Thư mục mẫu
- Cấu trúc ví dụ:
  ```
  project-root/
  ├─ controllers/
  ├─ models/
  ├─ routes/
  ├─ tests/
  │  └─ user.test.js
  ├─ package.json
  └─ index.js
  ```

3) Cài đặt dependencies (chạy ở gốc project)
- Cài dev dependencies:
  ```
  npm install --save-dev jest supertest mongodb-memory-server
  ```
  Hoặc với yarn:
  ```
  yarn add --dev jest supertest mongodb-memory-server
  ```

4) Thêm script test vào package.json
- Mở `package.json` và thêm trong `"scripts"`:
  ```json
  "scripts": {
    "test": "jest --runInBand"
  }
  ```
  Nếu `scripts` đã tồn tại, chỉ cần thêm hoặc chỉnh sửa trường `"test"`.

5) Cách chạy test
- Chạy toàn bộ test:
  ```
  npm test
  ```
  hoặc
  ```
  npx jest
  ```
- Chạy một file test cụ thể:
  ```
  npx jest tests/user.test.js
  ```
- Khi dùng `mongodb-memory-server`, test sẽ chạy mà không cần MongoDB thật.

6) Lưu ý
- Đảm bảo test import đúng đường dẫn đến router/model (ví dụ `require('../routes/user')`), vì khi test nằm trong `/tests` thì đường dẫn tương đối phải phù hợp.
- Nếu test gặp vấn đề `EADDRINUSE` hoặc lỗi kết nối DB, kiểm tra port server và trạng thái Mongo (nhưng với mongodb-memory-server, thường không cần).

Kết luận
- Đặt `user.test.js` vào `./tests/user.test.js`, cài các dev-dependencies, thêm script `test` trong `package.json`, rồi chạy `npm test` hoặc `npx jest tests/user.test.js`.
