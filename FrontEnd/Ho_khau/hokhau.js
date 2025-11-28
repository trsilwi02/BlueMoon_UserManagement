const newadd = document.getElementById("newadd");
const close = document.getElementById("close");
const overlay = document.getElementById("modalOverlay");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const btnSave = document.getElementById("save");

//API: URL của Backend (Server Node.js)
const API_URL = "http://localhost:5000/api/hokhau";

//DỮ LIỆU GIẢ LẬP (Thay vì gọi API, ta dùng mảng này để test)
let danhSachHoKhau2 = [
  {
    maHo: "HK001",
    chuHo: "Nguyễn Văn A",
    diaChi: "Số 1 Đại Cồ Việt",
    ngayLap: "27/11/2025",
    soThanhVien: 4,
  },
  {
    maHo: "HK002",
    chuHo: "Trần Thị B",
    diaChi: "15 Lê Thanh Nghị",
    ngayLap: "28/11/2025",
    soThanhVien: 2,
  },
  {
    maHo: "HK003",
    chuHo: "Lê Văn C",
    diaChi: "30 Tạ Quang Bửu",
    ngayLap: "29/11/2025",
    soThanhVien: 5,
  },
];

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
      <td style="text-align: center">${hoKhau.maHo}</td>
      <td>${hoKhau.chuHo}</td>
      <td>${hoKhau.diaChi}</td>
      <td style="text-align: center">${hoKhau.soThanhVien}</td>
      <td style="text-align: center">${hoKhau.ngayLap}</td>
      <td>
        <button class="action-btn view-btn" onclick="xemChiTiet('${hoKhau.maHo}')">Xem</button>
        <button class="action-btn view-btn" onclick="xoaHoKhau('${hoKhau.maHo}')">Xoá</button>
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
    (item) =>
      item.chuHo.toLowerCase().includes(tuKhoa) ||
      item.maHo.toLowerCase().includes(tuKhoa)
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
  const maHoVal = document.getElementById("ma").value;
  const diaChiVal = document.getElementById("diaChi").value;
  const chuHoVal = document.getElementById("chuHo").value;
  const ngaySinhVal = document.getElementById("ngaySinh").value;
  const cccdVal = document.getElementById("cccd").value;
  const sdtVal = document.getElementById("sdt").value;

  // Validate đơn giản
  if (!maHoVal || !chuHoVal) {
    alert("Vui lòng nhập Mã hộ và Chủ hộ!");
    return;
  }

  // Tạo object dữ liệu để gửi lên Server
  // Tên key (maHo, chuHo...) phải khớp với Schema trong server.js
  const newData = {
    maHo: maHoVal,
    diaChi: diaChiVal,
    chuHo: chuHoVal,
    ngaySinh: ngaySinhVal,
    cccd: cccdVal,
    sdt: sdtVal,
    ngayLap: new Date().toLocaleDateString("vi-VN"), //thời điểm ấn lưu
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
      document.getElementById("maHo").value = "";
      document.getElementById("diaChi").value = "";
      document.getElementById("chuHo").value = "";
      document.getElementById("ngaySinh").value = "";
      document.getElementById("cccs").value = "";
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
window.xemChiTiet = (maHo) => {
  window.location.href = `/FrontEnd/Ho_khau/info_family/info_table.html?maHo=${maHo}`;
};

//Chức năng Xoá (xoá luôn trong database)
window.xoaHoKhau = async (maHo) => {
  if (confirm(`Bạn muốn xóa hộ ${maHo} khỏi Database?`)) {
    try {
      await fetch(`${API_URL}/${maHo}`, { method: "DELETE" });
      alert("Đã xóa!");
      fetchHoKhau(); // Tải lại bảng
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  }
};

fetchHoKhau();
