const API_HOKHAU = "http://localhost:3000/api/hokhau";

const tableBody = document.getElementById("tableBody");
const modalOverlay = document.getElementById("modalOverlay");
const btnAdd = document.getElementById("newadd");
const btnClose = document.getElementById("close");
const btnSave = document.getElementById("save");
const searchInput = document.getElementById("searchInput");

let danhSachHoKhau = [];

/* ===============================
   1. LOAD DANH SÁCH HỘ KHẨU
   =============================== */
async function fetchHoKhau() {
  try {
    const res = await fetch(API_HOKHAU);
    danhSachHoKhau = await res.json();
    renderTable(danhSachHoKhau);
  } catch (error) {
    console.error("Lỗi tải danh sách hộ khẩu:", error);
  }
}

/* ===============================
   2. RENDER TABLE
   =============================== */
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(hk => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:center;font-weight:bold">${hk.IDHoKhau}</td>
      <td>${hk.TenChuHo}</td>
      <td>${hk.DiaChi}</td>
      <td style="text-align:center">${hk.soThanhVien}</td>
      <td style="text-align:center">${hk.NgayLap}</td>
      <td class="task-btn">
        <button class="action-btn view-btn"
          onclick="xemChiTiet('${hk.IDHoKhau}')">Xem</button>
        <button class="action-btn delete-btn"
          onclick="xoaHoKhau('${hk.IDHoKhau}')">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/* ===============================
   3. MODAL THÊM HỘ KHẨU
   =============================== */
btnAdd.onclick = () => {
  modalOverlay.style.display = "flex";
  clearForm();
};

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  document.getElementById("IDHoKhau").value = "";
  document.getElementById("DiaChi").value = "";
  document.getElementById("TenChuHo").value = "";
  document.getElementById("NgaySinh").value = "";
  document.getElementById("cccd").value = "";
  document.getElementById("sdt").value = "";
}

/* ===============================
   4. LƯU HỘ KHẨU (TẠO + CHỦ HỘ)
   =============================== */
btnSave.onclick = async () => {
  const IDHoKhau = document.getElementById("IDHoKhau").value.trim();
  const DiaChi = document.getElementById("DiaChi").value.trim();
  const TenChuHo = document.getElementById("TenChuHo").value.trim();
  const NgaySinh = document.getElementById("NgaySinh").value;
  const cccd = document.getElementById("cccd").value.trim();
  const sdt = document.getElementById("sdt").value.trim();

  if (!IDHoKhau || !TenChuHo || !DiaChi || !cccd) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    return;
  }

  const payload = {
    IDHoKhau,
    DiaChi,
    TenChuHo,
    NgaySinh,
    GioiTinh: "Khác", // backend dùng cho chủ hộ
    cccd,
    sdt,
    NgayLap: new Date().toLocaleDateString("vi-VN")
  };

  try {
    const res = await fetch(API_HOKHAU, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Lỗi: " + result.message);
      return;
    }

    alert("Thêm hộ khẩu thành công!");
    modalOverlay.style.display = "none";
    fetchHoKhau();

  } catch (error) {
    alert("Không thể kết nối tới server!");
  }
};

/* ===============================
   5. XÓA HỘ KHẨU
   =============================== */
window.xoaHoKhau = async (id) => {
  if (!confirm(`Xác nhận xóa hộ khẩu ${id}?`)) return;

  try {
    const res = await fetch(`${API_HOKHAU}/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok) {
      alert("Lỗi: " + result.message);
      return;
    }

    alert("Đã xóa hộ khẩu!");
    fetchHoKhau();
  } catch (error) {
    alert("Lỗi kết nối server!");
  }
};

/* ===============================
   6. XEM CHI TIẾT HỘ
   =============================== */
window.xemChiTiet = (id) => {
  window.location.href = `./info_family/info_table.html?IDHoKhau=${id}`;
};

/* ===============================
   7. TÌM KIẾM
   =============================== */
searchInput.oninput = () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = danhSachHoKhau.filter(hk =>
    hk.IDHoKhau.toLowerCase().includes(keyword) ||
    hk.TenChuHo.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
};

/* ===============================
   INIT
   =============================== */
fetchHoKhau();
