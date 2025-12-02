const add_mem = document.getElementById("add_mem");
const save2 = document.getElementById("save2");
const close2 = document.getElementById("close2");
const overlay2 = document.getElementById("modalOverlay2");
const mem_tableBody = document.getElementById("mem_tableBody");

//lấy mã hộ từ url
const urlParams = new URLSearchParams(window.location.search);
const currentIDHoKhau = urlParams.get("IDHoKhau");

//Cập nhật tiêu đề trang
if (currentIDHoKhau) {
  document.querySelector(
    "h2"
  ).innerText = `Thành viên hộ gia đình: ${currentIDHoKhau}`;
}

//API nhân khẩu
const API_NHANKHAU = "http://localhost:5000/api/nhankhau";

//mảng để lưu dữ liệu gửi về từ server
let danhSachThanhVien = [];

////gọi api để lấy dữ liệu từ database: Quy trình: Frontend gọi API -> Backend nhận lệnh -> Backend lấy từ MongoDB -> Trả về Frontend -> Frontend hiển thị lên bảng
async function fetchThanhVien() {
  try {
    const res = await fetch(`${API_NHANKHAU}/${currentIDHoKhau}`); //gọi API theo IDHoKhau
    const data = await res.json(); //nhận dữ liệu và chuyển sang kiểu json

    danhSachThanhVien = data;
    renderTable(danhSachThanhVien); //vẽ lên bảng
  } catch (error) {
    console.error("Lỗi kết nối server:", error);
  }
}

//hàm vẽ bảng (render) - chạy mỗi khi dữ liệu thay đổi
function renderTable(data) {
  mem_tableBody.innerHTML = ""; //bảng id = mem_tableBody, xoá trắng bảng trước khi vẽ lại

  data.forEach((nk, index) => {
    const row = document.createElement("tr");
    //không xoá được chủ hộ
    let deleteButton = "";
    if (nk.QuanHeVoiChuHo.trim().toLowerCase() !== "chủ hộ") {
      deleteButton = `<button class="action-btn delete-btn" title="Xóa" onclick="xoaThanhVien('${nk.cccd}', '${nk.HoVaTen}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>`;
    }

    //đổi format YYYY-MM-DD sang DD/MM/YYYY
    let displayDate = nk.NgaySinh;
    if (nk.NgaySinh && nk.NgaySinh.includes("-")) {
      const parts = nk.NgaySinh.split("-"); // Tách 2023-11-27
      if (parts.length === 3)
        displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    row.innerHTML = `
      <td style="text-align: center">${index + 1}</td>
      <td>${nk.HoVaTen}</td>
      <td style="text-align: center">${displayDate}</td>
      <td style="text-align: center">${nk.GioiTinh}</td>
      <td style="text-align: center">${nk.cccd}</td>
      <td style="text-align: center">${nk.sdt}</td>
      <td style="text-align: center">${nk.QuanHeVoiChuHo}</td>
      <td class="task-btn" style="text-align: center;">
        <button class="action-btn btn-edit" title="Sửa" onclick="suaThanhVien('${
          nk.cccd
        }')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
        </button>
        ${deleteButton}
      </td>
    `;
    mem_tableBody.appendChild(row);
  });
}

//Thêm mới thành viên
add_mem.onclick = () => {
  editingID = null; // Reset trạng thái về Thêm mới
  document.getElementById("HoVaTen").value = "";
  document.getElementById("NgaySinh").value = "";
  document.getElementById("cccd").value = "";
  document.getElementById("cccd").disabled = false; //cho phép nhập cccd mới
  document.getElementById("sdt").value = "";
  document.getElementById("QuanHeVoiChuHo").value = "";
  //Luôn mở khoá ô quan hệ khi thêm mới
  document.getElementById("QuanHeVoiChuHo").disabled = false;
  save2.innerText = "Thêm"; // Đổi tên nút thành Thêm
  overlay2.style.display = "flex";
};

//Sửa thông tin của thành viên
window.suaThanhVien = (id) => {
  // Tìm thông tin người cần sửa trong danh sách đã tải về
  const member = danhSachThanhVien.find((m) => m.cccd === id);
  if (!member) return;

  // Điền dữ liệu cũ vào Form
  document.getElementById("HoVaTen").value = member.HoVaTen;
  document.getElementById("NgaySinh").value = member.NgaySinh; // Input type date cần format yyyy-MM-dd
  document.getElementById("cccd").value = member.cccd;
  document.getElementById("cccd").disabled = true; //không cho sửa cccd, muốn sửa phải xoá đi thêm mới
  document.getElementById("sdt").value = member.sdt;
  document.getElementById("GioiTinh").value = member.GioiTinh;

  const quanHeInput = document.getElementById("QuanHeVoiChuHo");

  if (member.QuanHeVoiChuHo.trim().toLowerCase() === "chủ hộ") {
    quanHeInput.disabled = true; // Khóa không cho sửa nếu là chủ hộ
  } else {
    document.getElementById("QuanHeVoiChuHo").value = member.QuanHeVoiChuHo;
    quanHeInput.disabled = false; // Cho phép sửa nếu là thành viên khác
  }

  // Cập nhật trạng thái
  editingID = id;
  save2.innerText = "Lưu"; // Đổi tên nút để người dùng biết
  overlay2.style.display = "flex"; // Mở modal
};

save2.onclick = async () => {
  const HoVaTen = document.getElementById("HoVaTen").value;
  const NgaySinh = document.getElementById("NgaySinh").value;
  const GioiTinh = document.getElementById("GioiTinh").value;
  const cccd = document.getElementById("cccd").value;
  const sdt = document.getElementById("sdt").value;
  const QuanHeVoiChuHo = document.getElementById("QuanHeVoiChuHo").value;

  if (!HoVaTen || !NgaySinh || !cccd || !sdt || !QuanHeVoiChuHo || !GioiTinh) {
    alert("Vui lòng nhập đủ các thông tin!");
    return;
  }

  if (cccd.length != 12 || isNaN(cccd)) {
    //isNaN kiểm tra có phải không là số không
    alert("CCCD phải là các chữ số. Hãy kiểm tra lại!");
    return;
  }

  if (sdt.length() != 10 || isNaN(sdt)) {
    alert("SĐT phải là 10 chữ số. Hãy kiểm tra lại!");
    return;
  }

  const newMem = {
    IDHoKhau: currentIDHoKhau,
    HoVaTen: HoVaTen,
    NgaySinh: NgaySinh,
    GioiTinh: GioiTinh,
    cccd: cccd,
    sdt: sdt,
    QuanHeVoiChuHo: QuanHeVoiChuHo,
  };

  try {
    let response;
    if (editingID != null) {
      //Sửa thông tin thành viên
      response = await fetch(`${API_NHANKHAU}/${editingID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMem),
      });
    } else {
      //Thêm mới thành viên
      response = await fetch(API_NHANKHAU, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMem),
      });
    }
    if (response.ok) {
      alert(
        editingID == null
          ? "Đã thêm thành viên!"
          : "Cập nhật thông tin thành công!"
      );
      overlay2.style.display = "none";
      // Reset form
      document.getElementById("HoVaTen").value = "";
      document.getElementById("cccd").value = "";
      document.getElementById("NgaySinh").value = "";
      document.getElementById("sdt").value = "";
      document.getElementById("QuanHeVoiChuHo").value = "";

      fetchThanhVien(); // Tải lại bảng ngay lập tức
    }
  } catch (error) {
    console.error(error);
    alert("Lỗi server");
  }
};

close2.onclick = () => {
  overlay2.style.display = "none";
};

//Xoá thành viên
// Hàm nhận hai tham số: id (MongoDB ID) và ten (HoVaTen)
window.xoaThanhVien = async (cccd, HoVaTen) => {
  if (confirm(`Xoá thành viên ${HoVaTen}?`)) {
    try {
      await fetch(`${API_NHANKHAU}/${cccd}`, { method: "DELETE" });
      alert("Đã xóa!");
      fetchThanhVien();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  }
};

fetchThanhVien();
