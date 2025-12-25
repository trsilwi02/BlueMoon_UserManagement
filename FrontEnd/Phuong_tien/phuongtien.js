/* ===============================
   API
   =============================== */
const API_PHUONGTIEN = "http://localhost:3000/api/phuongtien";

/* ===============================
   DOM
   =============================== */
const tableBody = document.getElementById("tableBody");

const modalOverlay = document.getElementById("modalOverlay");
const btnAdd = document.getElementById("newadd");
const btnClose = document.getElementById("close");
const btnSave = document.getElementById("save");
const searchInput = document.getElementById("searchInput");

const modalIDHoKhau = document.getElementById("modalIDHoKhau");
const modalOwner = document.getElementById("modalOwner");
const modalPlate = document.getElementById("modalPlate");
const modalType = document.getElementById("modalType");
const modalNote = document.getElementById("modalNote");

/* ===============================
   DATA
   =============================== */
let danhSachPhuongTien = [];

/* ===============================
   1. LOAD DANH SÁCH PHƯƠNG TIỆN
   =============================== */
async function fetchPhuongTien() {
  try {
    const res = await fetch(API_PHUONGTIEN);
    danhSachPhuongTien = await res.json();
    renderTable(danhSachPhuongTien);
  } catch (error) {
    console.error("Lỗi tải phương tiện:", error);
  }
}

/* ===============================
   2. RENDER TABLE
   =============================== */
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach((pt, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:center">${index + 1}</td>
      <td style="text-align:center;font-weight:600">${pt.IDHoKhau}</td>
      <td>${pt.owner}</td>
      <td>${pt.plate}</td>
      <td>${pt.type}</td>
      <td>${pt.note || ""}</td>
      <td class="task-btn">
        <button class="action-btn delete-btn"
          onclick="xoaPhuongTien('${pt._id}')">
          Xóa
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/* ===============================
   3. MODAL THÊM PHƯƠNG TIỆN
   =============================== */
btnAdd.onclick = () => {
  modalOverlay.style.display = "flex";
  clearForm();
};

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  modalIDHoKhau.value = "";
  modalOwner.value = "";
  modalPlate.value = "";
  modalType.value = "";
  modalNote.value = "";
}

/* ===============================
   4. LƯU PHƯƠNG TIỆN
   =============================== */
btnSave.onclick = async () => {
  const IDHoKhau = modalIDHoKhau.value.trim();
  const owner = modalOwner.value.trim();
  const plate = modalPlate.value.trim();
  const type = modalType.value.trim();
  const note = modalNote.value.trim();

  if (!IDHoKhau || !owner || !plate || !type) {
    alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    return;
  }

  const payload = {
    IDHoKhau,
    owner,
    plate,
    type,
    note
  };

  try {
    const res = await fetch(API_PHUONGTIEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Lỗi: " + result.message);
      return;
    }

    alert("Thêm phương tiện thành công!");
    modalOverlay.style.display = "none";
    fetchPhuongTien();

  } catch (error) {
    alert("Không thể kết nối tới server!");
  }
};

/* ===============================
   5. XÓA PHƯƠNG TIỆN
   =============================== */
window.xoaPhuongTien = async (id) => {
  if (!confirm("Xác nhận xóa phương tiện này?")) return;

  try {
    const res = await fetch(`${API_PHUONGTIEN}/${id}`, {
      method: "DELETE"
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Lỗi: " + result.message);
      return;
    }

    alert("Đã xóa phương tiện!");
    fetchPhuongTien();

  } catch (error) {
    alert("Lỗi kết nối server!");
  }
};

/* ===============================
   6. TÌM KIẾM
   =============================== */
searchInput.oninput = () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = danhSachPhuongTien.filter(pt =>
    pt.IDHoKhau.toLowerCase().includes(keyword) ||
    pt.owner.toLowerCase().includes(keyword) ||
    pt.plate.toLowerCase().includes(keyword) ||
    pt.type.toLowerCase().includes(keyword)
  );

  renderTable(filtered);
};

/* ===============================
   INIT
   =============================== */
fetchPhuongTien();
