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
================================ */
async function fetchHoKhau() {
  try {
    const res = await fetch(API_HOKHAU);
    danhSachHoKhau = await res.json();
    renderTable(danhSachHoKhau);
  } catch (err) {
    console.error("Lỗi tải hộ khẩu:", err);
  }
}

/* ===============================
   2. TẠO ID HỘ KHẨU TỰ ĐỘNG
   FORMAT: N9xxxxxx
================================ */
function generateHoKhauId() {
  if (danhSachHoKhau.length === 0) return "N9000001";

  const maxNumber = Math.max(
    ...danhSachHoKhau.map(hk =>
      parseInt(hk.IDHoKhau.replace("N9", ""), 10)
    )
  );

  const nextNumber = (maxNumber + 1).toString().padStart(6, "0");
  return `N9${nextNumber}`;
}

/* ===============================
   3. RENDER TABLE
================================ */
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
   4. MODAL
================================ */
btnAdd.onclick = () => {
  modalOverlay.style.display = "flex";
  clearForm();
};

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  document.getElementById("DiaChi").value = "";
  document.getElementById("TenChuHo").value = "";
  document.getElementById("NgaySinh").value = "";
  document.getElementById("GioiTinh").value = "Khác";
  document.getElementById("cccd").value = "";
  document.getElementById("sdt").value = "";
}

/* ===============================
   5. LƯU HỘ KHẨU (AUTO ID)
================================ */
btnSave.onclick = async () => {
  const DiaChi = document.getElementById("DiaChi").value.trim();
  const TenChuHo = document.getElementById("TenChuHo").value.trim();
  const NgaySinh = document.getElementById("NgaySinh").value;
  const GioiTinh = document.getElementById("GioiTinh").value;
  const cccd = document.getElementById("cccd").value.trim();
  const sdt = document.getElementById("sdt").value.trim();

  if (!TenChuHo || !DiaChi || !cccd || !sdt) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (!/^\d{12}$/.test(cccd)) {
    alert("CCCD phải đúng 12 chữ số!");
    return;
  }

  if (!/^\d{10}$/.test(sdt)) {
    alert("Số điện thoại phải đúng 10 chữ số!");
    return;
  }

  const IDHoKhau = generateHoKhauId();

  const payload = {
    IDHoKhau,
    DiaChi,
    TenChuHo,
    NgaySinh,
    GioiTinh,
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
      alert(result.message);
      return;
    }

    alert(`Tạo hộ khẩu thành công!\nMã hộ: ${IDHoKhau}`);
    modalOverlay.style.display = "none";
    fetchHoKhau();

  } catch (err) {
    alert("Không thể kết nối server!");
  }
};

/* ===============================
   6. XÓA HỘ KHẨU
================================ */
async function xoaHoKhau(id) {
  if (!confirm(`Xóa hộ khẩu ${id}?`)) return;

  const res = await fetch(`${API_HOKHAU}/${id}`, { method: "DELETE" });
  const result = await res.json();

  if (!res.ok) {
    alert(result.message);
    return;
  }

  alert("Đã xóa!");
  fetchHoKhau();
}

/* ===============================
   7. XEM CHI TIẾT
================================ */
function xemChiTiet(id) {
  window.location.href = `./info_family/info_table.html?IDHoKhau=${id}`;
}

/* ===============================
   8. TÌM KIẾM
================================ */
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
================================ */
fetchHoKhau();
