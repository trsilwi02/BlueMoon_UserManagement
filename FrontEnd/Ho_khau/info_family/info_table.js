// ===============================
//  INFO FAMILY – FRONTEND CHUẨN BACKEND NHÂN KHẨU
// ===============================

// Lấy ID hộ khẩu từ URL
const urlParams = new URLSearchParams(window.location.search);
const currentIDHoKhau = urlParams.get("IDHoKhau");

// Cập nhật tiêu đề trang
if (currentIDHoKhau) {
  document.querySelector("h2").innerText = `Thành viên hộ: ${currentIDHoKhau}`;
}

// API nhân khẩu
const API_NHANKHAU = "http://localhost:3000/api/nhankhau";

// HTML Elements
const mem_tableBody = document.getElementById("mem_tableBody");
const add_mem = document.getElementById("add_mem");
const save2 = document.getElementById("save2");
const close2 = document.getElementById("close2");
const overlay2 = document.getElementById("modalOverlay2");

let danhSachThanhVien = [];
let editingID = null;

// ===============================
// 1. Tải danh sách thành viên theo ID hộ
// ===============================
async function fetchThanhVien() {
  try {
    const res = await fetch(`${API_NHANKHAU}/hokhau/${currentIDHoKhau}`);
    const data = await res.json();

    danhSachThanhVien = data;
    renderTable(data);
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  }
}

// ===============================
// 2. Vẽ bảng
// ===============================
function renderTable(data) {
  mem_tableBody.innerHTML = "";

  if (data.length === 0) {
    mem_tableBody.innerHTML = `
      <tr><td colspan="8" style="text-align:center;color:#888;padding:20px">
      Chưa có thành viên nào</td></tr>`;
    return;
  }

  data.forEach((nk, index) => {
    const deleteBtn =
      nk.QuanHeVoiChuHo.trim().toLowerCase() !== "chủ hộ"
        ? `<button class="action-btn delete-btn" onclick="xoaThanhVien('${nk._id}', '${nk.HoVaTen}')">Xóa</button>`
        : "";

    const row = document.createElement("tr");

    // Chuyển ngày yyyy-mm-dd thành dd/mm/yyyy
    let displayDate = nk.NgaySinh;
    if (nk.NgaySinh?.includes("-")) {
      const [y, m, d] = nk.NgaySinh.split("-");
      displayDate = `${d}/${m}/${y}`;
    }

    row.innerHTML = `
      <td style="text-align:center">${index + 1}</td>
      <td>${nk.HoVaTen}</td>
      <td style="text-align:center">${displayDate}</td>
      <td style="text-align:center">${nk.GioiTinh}</td>
      <td style="text-align:center">${nk.cccd}</td>
      <td style="text-align:center">${nk.sdt}</td>
      <td style="text-align:center">${nk.QuanHeVoiChuHo}</td>
      <td style="text-align:center">
        <button class="action-btn btn-edit" onclick="suaThanhVien('${nk._id}')">Sửa</button>
        ${deleteBtn}
      </td>
    `;
    mem_tableBody.appendChild(row);
  });
}

// ===============================
// 3. Mở popup thêm mới
// ===============================
add_mem.onclick = () => {
  editingID = null;

  document.getElementById("HoVaTen").value = "";
  document.getElementById("NgaySinh").value = "";
  document.getElementById("cccd").value = "";
  document.getElementById("sdt").value = "";
  document.getElementById("GioiTinh").value = "Nam";
  document.getElementById("QuanHeVoiChuHo").value = "Con";

  document.getElementById("cccd").disabled = false;
  document.getElementById("QuanHeVoiChuHo").disabled = false;

  save2.innerText = "Thêm";
  overlay2.style.display = "flex";
};

// ===============================
// 4. Sửa thành viên
// ===============================
window.suaThanhVien = (id) => {
  const member = danhSachThanhVien.find((m) => m._id === id);
  if (!member) return;

  editingID = id;

  document.getElementById("HoVaTen").value = member.HoVaTen;
  document.getElementById("NgaySinh").value = member.NgaySinh;
  document.getElementById("cccd").value = member.cccd;
  document.getElementById("sdt").value = member.sdt;
  document.getElementById("GioiTinh").value = member.GioiTinh;
  document.getElementById("QuanHeVoiChuHo").value = member.QuanHeVoiChuHo;

  document.getElementById("cccd").disabled = true;

  if (member.QuanHeVoiChuHo.toLowerCase() === "chủ hộ") {
    document.getElementById("QuanHeVoiChuHo").disabled = true;
  } else {
    document.getElementById("QuanHeVoiChuHo").disabled = false;
  }

  save2.innerText = "Lưu";
  overlay2.style.display = "flex";
};

// ===============================
// 5. Lưu: thêm mới hoặc cập nhật
// ===============================
save2.onclick = async () => {
  const HoVaTen = document.getElementById("HoVaTen").value;
  const NgaySinh = document.getElementById("NgaySinh").value;
  const GioiTinh = document.getElementById("GioiTinh").value;
  const cccd = document.getElementById("cccd").value;
  const sdt = document.getElementById("sdt").value;
  const QuanHeVoiChuHo = document.getElementById("QuanHeVoiChuHo").value;

  if (!HoVaTen || !NgaySinh || !cccd || !sdt || !QuanHeVoiChuHo) {
    return alert("Vui lòng nhập đầy đủ thông tin!");
  }

  if (cccd.length !== 12 || isNaN(cccd)) {
    return alert("CCCD phải gồm 12 chữ số!");
  }

  if (sdt.length !== 10 || isNaN(sdt)) {
    return alert("SĐT phải gồm 10 chữ số!");
  }

  const payload = {
    IDHoKhau: currentIDHoKhau,
    HoVaTen,
    NgaySinh,
    GioiTinh,
    cccd,
    sdt,
    QuanHeVoiChuHo,
  };

  try {
    let response;

    // cập nhật
    if (editingID) {
      response = await fetch(`${API_NHANKHAU}/${editingID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // thêm mới
      response = await fetch(API_NHANKHAU, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (response.ok) {
      alert(editingID ? "Cập nhật thành viên thành công!" : "Đã thêm thành viên!");
      overlay2.style.display = "none";
      fetchThanhVien();
    }
  } catch (e) {
    console.error(e);
    alert("Lỗi server");
  }
};

// ===============================
// 6. Xóa thành viên
// ===============================
window.xoaThanhVien = async (id, name) => {
  if (!confirm(`Xóa ${name}?`)) return;

  try {
    const res = await fetch(`${API_NHANKHAU}/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("Đã xóa thành viên!");
      fetchThanhVien();
    }
  } catch (e) {
    console.error(e);
    alert("Không thể xóa!");
  }
};

close2.onclick = () => (overlay2.style.display = "none");

fetchThanhVien();
