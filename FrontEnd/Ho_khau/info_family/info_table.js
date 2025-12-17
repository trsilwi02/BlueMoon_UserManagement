// 1. Lấy mã hộ khẩu từ URL (Quan trọng: Phải là IDHoKhau)
const urlParams = new URLSearchParams(window.location.search);
const currentIDHoKhau = urlParams.get("IDHoKhau");

const API_NHANKHAU = "http://localhost:3000/api/nhankhau";

// 2. Khai báo đúng các ID từ HTML của bạn
const mem_tableBody = document.getElementById("mem_tableBody");
const btnAddMem = document.getElementById("add_mem");
const btnSave = document.getElementById("save2");   // Nút Thêm trong popup
const btnClose = document.getElementById("close2"); // Nút Đóng trong popup
const overlay = document.getElementById("modalOverlay2");

let danhSachThanhVien = [];
let editingID = null;

// Tải danh sách khi mở trang
if (currentIDHoKhau) {
    document.querySelector("h2").innerText = `Thành viên hộ: ${currentIDHoKhau}`;
    fetchThanhVien();
}

async function fetchThanhVien() {
    try {
        const res = await fetch(`${API_NHANKHAU}/hokhau/${currentIDHoKhau}`);
        danhSachThanhVien = await res.json();
        renderTable(danhSachThanhVien);
    } catch (e) { console.error("Lỗi tải dữ liệu", e); }
}

function renderTable(data) {
    mem_tableBody.innerHTML = "";
    data.forEach((nk, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align:center">${index + 1}</td>
            <td>${nk.HoVaTen}</td>
            <td style="text-align:center">${nk.NgaySinh}</td>
            <td style="text-align:center">${nk.GioiTinh}</td>
            <td style="text-align:center">${nk.cccd}</td>
            <td style="text-align:center">${nk.sdt}</td>
            <td style="text-align:center">${nk.QuanHeVoiChuHo}</td>
            <td style="text-align:center">
                <button class="action-btn" onclick="suaThanhVien('${nk._id}')">Sửa</button>
                <button class="action-btn" onclick="xoaThanhVien('${nk._id}')">Xóa</button>
            </td>
        `;
        mem_tableBody.appendChild(row);
    });
}

// 3. Xử lý sự kiện nút "Thêm thành viên" (Mở popup)
btnAddMem.onclick = () => {
    editingID = null;
    overlay.style.display = "flex";
    // Xóa trắng form trước khi nhập
    document.getElementById("HoVaTen").value = "";
    document.getElementById("cccd").value = "";
    document.getElementById("sdt").value = "";
    btnSave.innerText = "Thêm";
};

btnClose.onclick = () => overlay.style.display = "none";

// 4. Xử lý nút "Thêm" (Nút Save2 trong popup)
btnSave.onclick = async () => {
    // Lấy dữ liệu từ các ô input
    const payload = {
        IDHoKhau: currentIDHoKhau,
        HoVaTen: document.getElementById("HoVaTen").value.trim(),
        NgaySinh: document.getElementById("NgaySinh").value,
        GioiTinh: document.getElementById("GioiTinh").value,
        cccd: document.getElementById("cccd").value.trim(),
        sdt: document.getElementById("sdt").value.trim(),
        QuanHeVoiChuHo: document.getElementById("QuanHeVoiChuHo").value
    };

    // Kiểm tra nhanh dữ liệu
    if (!payload.HoVaTen || !payload.cccd || !payload.sdt) {
        alert("Vui lòng điền đủ thông tin!");
        return;
    }

    try {
        const method = editingID ? "PUT" : "POST";
        const url = editingID ? `${API_NHANKHAU}/${editingID}` : API_NHANKHAU;

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(editingID ? "Cập nhật thành công!" : "Thêm thành viên thành công!");
            overlay.style.display = "none";
            fetchThanhVien(); // Tải lại bảng
        } else {
            const errData = await response.json();
            alert("Lỗi: " + errData.message);
        }
    } catch (e) {
        alert("Không thể kết nối đến Server!");
    }
};

window.xoaThanhVien = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
    await fetch(`${API_NHANKHAU}/${id}`, { method: "DELETE" });
    fetchThanhVien();
};

window.suaThanhVien = (id) => {
    editingID = id;
    const nk = danhSachThanhVien.find(m => m._id === id);
    if (nk) {
        document.getElementById("HoVaTen").value = nk.HoVaTen;
        document.getElementById("NgaySinh").value = nk.NgaySinh;
        document.getElementById("cccd").value = nk.cccd;
        document.getElementById("sdt").value = nk.sdt;
        document.getElementById("GioiTinh").value = nk.GioiTinh;
        document.getElementById("QuanHeVoiChuHo").value = nk.QuanHeVoiChuHo;
        btnSave.innerText = "Lưu lại";
        overlay.style.display = "flex";
    }
};