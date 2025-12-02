const newadd = document.getElementById("newadd");
const close = document.getElementById("close");
const overlay = document.getElementById("modalOverlay");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const btnSave = document.getElementById("save");

//API: URL của Backend (Server Node.js)
const API_URL = "http://localhost:5000/api/hokhau";

let danhSachHoKhau = []; //mảng để lưu dữ liệu từ server gửi về

//gọi api để lấy dữ liệu từ database: Quy trình: Frontend gọi API -> Backend nhận lệnh -> Backend lấy từ MongoDB -> Trả về Frontend -> Frontend hiển thị lên bảng
async function fetchHoKhau() {
  try {
    const response = await fetch(API_URL); // Gọi bồi bàn (Server)
    const data = await response.json(); // Nhận món (Dữ liệu)

    danhSachHoKhau = data; // Lưu vào biến toàn cục để dùng cho tìm kiếm
    renderTable(danhSachHoKhau); // Vẽ lên bảng
  } catch (error) {
    console.error("Lỗi kết nối Server:", error);
    alert("Không kết nối được với Server! Hãy kiểm tra Backend.");
  }
}

//hàm vẽ bảng (render) - chạy mỗi khi dữ liệu thay đổi
function renderTable(data) {
  tableBody.innerHTML = ""; //bảng id = tableBody, xoá trắng bảng trước khi vẽ lại
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding: 20px; color: #64748b;">Không tìm thấy kết quả nào</td></tr>`;
    return;
  }
  data.forEach((hoKhau) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align: center">${hoKhau.IDHoKhau}</td>
      <td>${hoKhau.TenChuHo}</td>
      <td>${hoKhau.DiaChi}</td>
      <td style="text-align: center">${hoKhau.soThanhVien}</td>
      <td style="text-align: center">${hoKhau.NgayLap}</td>
      <td style="text-align: center">
        <button class="action-btn view-btn" onclick="xemChiTiet('${hoKhau.IDHoKhau}')">Xem</button>
        <button class="action-btn delete-btn" onclick="xoaHoKhau('${hoKhau.IDHoKhau}')">Xoá</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

//Tìm kiếm
searchInput.addEventListener("input", (e) => {
  const tuKhoa = e.target.value.toLowerCase(); //lấy từ khoá người dùng nhập, chuyển thành viết thường
  //lọc danh sách
  const kqLoc = danhSachHoKhau.filter(
    //hàm lọc
    (item) =>
      item.TenChuHo.toLowerCase().includes(tuKhoa) ||
      item.IDHoKhau.toLowerCase().includes(tuKhoa)
  );
  renderTable(kqLoc);
});

//Thêm mới
newadd.onclick = () => {
  overlay.style.display = "flex"; //thay đổi css của phần tử overlay để hiện popup
};
close.onclick = () => {
  overlay.style.display = "none"; //thay đổi css của phần tử overlay để ẩn popup
};
overlay.onclick = (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none"; //// Đóng popup khi click ra ngoài
  }
};
btnSave.onclick = async () => {
  // Lấy dữ liệu từ Form
  // Lưu ý: Các ID này phải khớp với file hokhau.html
  const maHoVal = document.getElementById("IDHoKhau").value;
  const DiaChiVal = document.getElementById("DiaChi").value;
  const TenChuHoVal = document.getElementById("TenChuHo").value;
  const NgaySinhVal = document.getElementById("NgaySinh").value;
  const cccdVal = document.getElementById("cccd").value;
  const sdtVal = document.getElementById("sdt").value;

  // Validate đơn giản
  if (
    !maHoVal ||
    !TenChuHoVal ||
    !DiaChiVal ||
    !NgaySinhVal ||
    !cccdVal ||
    !sdtVal
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (cccdVal.length != 12 || isNaN(cccdVal)) {
    alert("CCCD phải là 12 chữ số. Hãy kiểm tra lại!");
    return;
  }

  if (sdtVal.length != 10 || isNaN(sdtVal)) {
    alert("SĐT phải là 10 chữ số. Hãy kiểm tra lại!");
    return;
  }

  // Tạo object dữ liệu để gửi lên Server
  // Tên key (IDHoKhau, TenChuHo...) phải khớp với Schema trong server.js
  const newData = {
    IDHoKhau: maHoVal,
    DiaChi: DiaChiVal,
    TenChuHo: TenChuHoVal,
    NgaySinh: NgaySinhVal,
    cccd: cccdVal,
    sdt: sdtVal,
    NgayLap: new Date().toLocaleDateString("vi-VN"), //thời điểm ấn lưu
  };

  try {
    // Gửi yêu cầu POST
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      alert("Thêm mới thành công!");
      overlay.style.display = "none";

      // Reset form
      document.getElementById("IDHoKhau").value = "";
      document.getElementById("DiaChi").value = "";
      document.getElementById("TenChuHo").value = "";
      document.getElementById("NgaySinh").value = "";
      document.getElementById("cccd").value = "";
      document.getElementById("sdt").value = "";

      // Tải lại dữ liệu mới nhất
      fetchHoKhau();
    } else {
      alert("Lỗi khi thêm mới!");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không kết nối được server");
  }
};

//Chức năng Xem (chuyển trang)
window.xemChiTiet = (IDHoKhau) => {
  window.location.href = `./info_family/info_table.html?IDHoKhau=${IDHoKhau}`;
};

//Chức năng Xoá (xoá luôn trong database)
window.xoaHoKhau = async (IDHoKhau) => {
  if (confirm(`Bạn muốn xóa hộ ${IDHoKhau} không?`)) {
    try {
      await fetch(`${API_URL}/${IDHoKhau}`, { method: "DELETE" });
      alert("Đã xóa!");
      fetchHoKhau(); // Tải lại bảng
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  }
};

fetchHoKhau();
// renderTable(danhSachHoKhau2);

// DỮ LIỆU GIẢ LẬP (Thay vì gọi API, ta dùng mảng này để test)
// khai báo đối tượng object
// let danhSachHoKhau2 = [
//   {
//     IDHoKhau: "HK001",
//     TenChuHo: "Nguyễn Văn A",
//     DiaChi: "Số 1 Đại Cồ Việt",
//     NgayLap: "27/11/2025",
//     soThanhVien: 4,
//   },
//   {
//     IDHoKhau: "HK002",
//     TenChuHo: "Trần Thị B",
//     DiaChi: "15 Lê Thanh Nghị",
//     NgayLap: "28/11/2025",
//     soThanhVien: 2,
//   },
//   {
//     IDHoKhau: "HK003",
//     TenChuHo: "Lê Văn C",
//     DiaChi: "30 Tạ Quang Bửu",
//     NgayLap: "29/11/2025",
//     soThanhVien: 5,
//   },
// ];
