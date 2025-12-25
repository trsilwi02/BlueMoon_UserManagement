/* ===============================
   API
   =============================== */
const API_QUY = "http://localhost:3000/api/quy";

/* ===============================
   DOM
   =============================== */
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("searchInput");

const btnAdd = document.getElementById("btnAdd");
const modalOverlay = document.getElementById("modalOverlay");
const btnClose = document.getElementById("close");
const btnSave = document.getElementById("save");

const tenQuyInput = document.getElementById("tenQuy");
const tongSoTienInput = document.getElementById("tongSoTien");
const ghiChuInput = document.getElementById("ghiChu");

/* ===============================
   STATE
   =============================== */
let danhSachQuy = [];
let editingId = null;

/* ===============================
   1. LOAD DANH SÁCH QUỸ
   =============================== */
async function fetchQuy() {
  try {
    const res = await fetch(API_QUY);
    if (!res.ok) return;

    danhSachQuy = await res.json();
    renderTable(danhSachQuy);
  } catch (err) {
    // ❌ Không alert – tránh popup khó chịu
    console.warn("API quỹ chưa sẵn sàng");
  }
}

/* ===============================
   2. RENDER TABLE (CÓ STT)
   =============================== */
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach((quy, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td style="text-align:center;font-weight:600">${index + 1}</td>
      <td>${quy.tenQuy}</td>
      <td style="font-weight:600;color:#2563eb">
        ${Number(quy.tongSoTien).toLocaleString("vi-VN")} đ
      </td>
      <td>${quy.ghiChu || ""}</td>
      <td class="actions">
        <button class="edit" onclick="suaQuy('${quy._id}')">Sửa</button>
        <button class="delete" onclick="xoaQuy('${quy._id}')">Xóa</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/* ===============================
   3. TÌM KIẾM
   =============================== */
searchInput.oninput = () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = danhSachQuy.filter(
    (q) =>
      q.tenQuy.toLowerCase().includes(keyword) ||
      (q.ghiChu && q.ghiChu.toLowerCase().includes(keyword))
  );

  renderTable(filtered);
};

/* ===============================
   4. MỞ / ĐÓNG MODAL
   =============================== */
btnAdd.onclick = () => {
  editingId = null;
  clearForm();
  modalOverlay.style.display = "flex";
};

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  tenQuyInput.value = "";
  tongSoTienInput.value = "";
  ghiChuInput.value = "";
}

/* ===============================
   5. LƯU QUỸ (THÊM + SỬA)
   =============================== */
btnSave.onclick = async () => {
  const tenQuy = tenQuyInput.value.trim();
  const tongSoTien = Number(tongSoTienInput.value);
  const ghiChu = ghiChuInput.value.trim();

  if (!tenQuy) {
    alert("Vui lòng nhập tên quỹ!");
    return;
  }

  const payload = {
    tenQuy,
    tongSoTien: isNaN(tongSoTien) ? 0 : tongSoTien,
    ghiChu
  };

  try {
    let res;

    // ===== THÊM =====
    if (!editingId) {
      res = await fetch(API_QUY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    // ===== SỬA =====
    else {
      res = await fetch(`${API_QUY}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
      alert("Có lỗi xảy ra!");
      return;
    }

    modalOverlay.style.display = "none";
    fetchQuy();

  } catch (err) {
    alert("Không thể kết nối server!");
  }
};

/* ===============================
   6. SỬA QUỸ
   =============================== */
window.suaQuy = (id) => {
  const quy = danhSachQuy.find((q) => q._id === id);
  if (!quy) return;

  editingId = id;

  tenQuyInput.value = quy.tenQuy;
  tongSoTienInput.value = quy.tongSoTien;
  ghiChuInput.value = quy.ghiChu || "";

  modalOverlay.style.display = "flex";
};

/* ===============================
   7. XÓA QUỸ
   =============================== */
window.xoaQuy = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa quỹ này?")) return;

  try {
    const res = await fetch(`${API_QUY}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Xóa thất bại!");
      return;
    }

    fetchQuy();
  } catch (err) {
    alert("Lỗi kết nối server!");
  }
};

/* ===============================
   INIT
   =============================== */
fetchQuy();
