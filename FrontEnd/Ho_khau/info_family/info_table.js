/* ===============================
   LẤY ID HỘ KHẨU TỪ URL
   =============================== */
const urlParams = new URLSearchParams(window.location.search);
const currentIDHoKhau = urlParams.get("IDHoKhau");

const API_NHANKHAU = "http://localhost:3000/api/nhankhau";
const API_HOKHAU  = "http://localhost:3000/api/hokhau";

/* ===============================
   KHAI BÁO DOM
   =============================== */
const mem_tableBody = document.getElementById("mem_tableBody");
const btnAddMem = document.getElementById("add_mem");
const btnSave = document.getElementById("save2");
const btnClose = document.getElementById("close2");
const overlay = document.getElementById("modalOverlay2");

const inputHoTen = document.getElementById("HoVaTen");
const inputNgaySinh = document.getElementById("NgaySinh");
const inputGioiTinh = document.getElementById("GioiTinh");
const inputCCCD = document.getElementById("cccd");
const inputSDT = document.getElementById("sdt");
const selectQuanHe = document.getElementById("QuanHeVoiChuHo");

let danhSachThanhVien = [];
let editingID = null;
let tenChuHo = "";   // ⭐ QUAN TRỌNG

/* ===============================
   LOAD DỮ LIỆU BAN ĐẦU
   =============================== */
if (currentIDHoKhau) {
  document.querySelector("h2").innerText = `Thành viên hộ: ${currentIDHoKhau}`;
  init();
}

async function init() {
  await fetchTenChuHo();
  await fetchThanhVien();
}

/* ===============================
   LẤY TÊN CHỦ HỘ (NGUỒN CHÂN LÝ)
   =============================== */
async function fetchTenChuHo() {
  try {
    const res = await fetch(`${API_HOKHAU}/${currentIDHoKhau}`);
    const hk = await res.json();
    tenChuHo = hk.TenChuHo;
  } catch (err) {
    console.error("Không lấy được tên chủ hộ:", err);
  }
}

/* ===============================
   LOAD DANH SÁCH THÀNH VIÊN
   =============================== */
async function fetchThanhVien() {
  try {
    const res = await fetch(`${API_NHANKHAU}/hokhau/${currentIDHoKhau}`);
    danhSachThanhVien = await res.json();
    renderTable(danhSachThanhVien);
  } catch (err) {
    console.error("Lỗi tải nhân khẩu:", err);
  }
}

/* ===============================
   RENDER TABLE
   =============================== */
function renderTable(data) {
  mem_tableBody.innerHTML = "";

  data.forEach((nk, index) => {
    const isChuHo = nk.HoVaTen === tenChuHo; // ⭐ ĐÚNG NGHIỆP VỤ

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:center">${index + 1}</td>
      <td>${nk.HoVaTen}</td>
      <td style="text-align:center">${nk.NgaySinh}</td>
      <td style="text-align:center">${nk.GioiTinh}</td>
      <td style="text-align:center">${nk.cccd}</td>
      <td style="text-align:center">${nk.sdt}</td>
      <td style="text-align:center">
        ${isChuHo ? "<b>Chủ hộ</b>" : nk.QuanHeVoiChuHo}
      </td>
      <td style="text-align:center">
        <button class="action-btn" onclick="suaThanhVien('${nk._id}')">Sửa</button>
        ${
          isChuHo
            ? `<span style="color:#999">Xóa</span>`
            : `<button class="action-btn" onclick="xoaThanhVien('${nk._id}')">Xóa</button>`
        }
      </td>
    `;
    mem_tableBody.appendChild(row);
  });
}

/* ===============================
   MỞ MODAL THÊM
   =============================== */
btnAddMem.onclick = () => {
  editingID = null;
  overlay.style.display = "flex";

  inputHoTen.value = "";
  inputNgaySinh.value = "";
  inputGioiTinh.value = "";
  inputCCCD.value = "";
  inputSDT.value = "";
  selectQuanHe.value = "";
  selectQuanHe.disabled = false;

  btnSave.innerText = "Thêm";
};

btnClose.onclick = () => {
  overlay.style.display = "none";
};

/* ===============================
   THÊM / SỬA THÀNH VIÊN
   =============================== */
btnSave.onclick = async () => {
  const payload = {
    IDHoKhau: currentIDHoKhau,
    HoVaTen: inputHoTen.value.trim(),
    NgaySinh: inputNgaySinh.value,
    GioiTinh: inputGioiTinh.value,
    cccd: inputCCCD.value.trim(),
    sdt: inputSDT.value.trim(),
    QuanHeVoiChuHo: selectQuanHe.value
  };

  if (!payload.HoVaTen || !payload.cccd || !payload.sdt || !payload.GioiTinh) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // ❌ KHÔNG BAO GIỜ THÊM CHỦ HỘ
  if (!editingID && payload.HoVaTen === tenChuHo) {
    alert("Chủ hộ đã tồn tại!");
    return;
  }

  try {
    const res = await fetch(
      editingID ? `${API_NHANKHAU}/${editingID}` : API_NHANKHAU,
      {
        method: editingID ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      const err = await res.json();
      alert("Lỗi: " + err.message);
      return;
    }

    alert(editingID ? "Cập nhật thành công!" : "Thêm thành viên thành công!");
    overlay.style.display = "none";
    fetchThanhVien();

  } catch (err) {
    alert("Không thể kết nối server!");
  }
};

/* ===============================
   XÓA THÀNH VIÊN
   =============================== */
window.xoaThanhVien = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return;
  await fetch(`${API_NHANKHAU}/${id}`, { method: "DELETE" });
  fetchThanhVien();
};

/* ===============================
   SỬA THÀNH VIÊN
   =============================== */
window.suaThanhVien = (id) => {
  editingID = id;
  const nk = danhSachThanhVien.find(tv => tv._id === id);
  if (!nk) return;

  const isChuHo = nk.HoVaTen === tenChuHo;

  inputHoTen.value = nk.HoVaTen;
  inputNgaySinh.value = nk.NgaySinh;
  inputGioiTinh.value = nk.GioiTinh || "";
  inputCCCD.value = nk.cccd;
  inputSDT.value = nk.sdt;
  selectQuanHe.value = nk.QuanHeVoiChuHo;

  // 🔒 CHỦ HỘ: KHÓA QUAN HỆ
  selectQuanHe.disabled = isChuHo;

  btnSave.innerText = "Lưu lại";
  overlay.style.display = "flex";
};
