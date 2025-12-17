const API_HOKHAU = "http://localhost:3000/api/hokhau";

const tableBody = document.getElementById("tableBody");
const modalOverlay = document.getElementById("modalOverlay");
const btnAdd = document.getElementById("newadd");
const btnClose = document.getElementById("close");
const btnSave = document.getElementById("save");
const searchInput = document.getElementById("searchInput");

let danhSachHoKhau = [];

// 1. Tải danh sách hộ khẩu
async function fetchHoKhau() {
  try {
    const response = await fetch(API_HOKHAU);
    danhSachHoKhau = await response.json();
    renderTable(danhSachHoKhau);
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  }
}

// 2. Render bảng với đầy đủ nút Xem và Xóa
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td style="text-align:center; font-weight:bold;">${item.IDHoKhau}</td>
            <td>${item.TenChuHo}</td>
            <td>${item.DiaChi}</td>
            <td style="text-align:center">${item.soThanhVien || 1}</td>
            <td style="text-align:center">${item.NgayLap}</td>
            <td class="task-btn">
                <button class="action-btn view-btn" style="background-color: #98fb98; border: 1px solid #000; cursor: pointer;" onclick="xemChiTiet('${item.IDHoKhau}')">Xem</button>
                <button class="action-btn delete-btn" style="background-color: #fff; border: 1px solid #000; cursor: pointer;" onclick="xoaHoKhau('${item.IDHoKhau}')">Xóa</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// 3. Điều khiển Modal thêm hộ khẩu
btnAdd.onclick = () => (modalOverlay.style.display = "flex");
btnClose.onclick = () => (modalOverlay.style.display = "none");

// 4. Thêm hộ khẩu mới
btnSave.onclick = async () => {
  const IDHoKhau = document.getElementById("IDHoKhau").value.trim();
  const DiaChi = document.getElementById("DiaChi").value.trim();
  const TenChuHo = document.getElementById("TenChuHo").value.trim();
  const NgaySinh = document.getElementById("NgaySinh").value;
  const cccd = document.getElementById("cccd").value.trim();
  const sdt = document.getElementById("sdt").value.trim();
  const NgayLap = new Date().toLocaleDateString("vi-VN");

  if (!IDHoKhau || !TenChuHo || !DiaChi || !cccd) {
    alert("Vui lòng nhập các thông tin bắt buộc!");
    return;
  }

  const payload = { IDHoKhau, DiaChi, TenChuHo, NgaySinh, cccd, sdt, NgayLap };

  try {
    const response = await fetch(API_HOKHAU, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Thêm thành công!");
      modalOverlay.style.display = "none";
      fetchHoKhau();
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    alert("Lỗi kết nối server!");
  }
};

// 5. Chức năng Xóa hộ khẩu
window.xoaHoKhau = async (id) => {
  if (!confirm(`Xác nhận xóa hộ khẩu ${id}?`)) return;
  try {
    const res = await fetch(`${API_HOKHAU}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Đã xóa!");
      fetchHoKhau();
    } else {
      alert("Xóa thất bại!");
    }
  } catch (error) {
    alert("Lỗi kết nối!");
  }
};

// 6. CHỨC NĂNG XEM (Đã sửa lại đường dẫn để vào đúng mục info_family)
window.xemChiTiet = (id) => {
  window.location.href = `./info_family/info_table.html?IDHoKhau=${id}`;
};
// 7. Tìm kiếm
searchInput.oninput = () => {
  const val = searchInput.value.toLowerCase();
  const filtered = danhSachHoKhau.filter(
    (hk) =>
      hk.TenChuHo.toLowerCase().includes(val) ||
      hk.IDHoKhau.toLowerCase().includes(val)
  );
  renderTable(filtered);
};

fetchHoKhau();