const newadd = document.getElementById("newadd");
const close = document.getElementById("close");
const overlay = document.getElementById("modalOverlay");
const family = document.getElementById("family");
// const delete_info = document.getElementById("delete_info");
// const show_info = document.getElementById("show_info");

//API: URL của Backend (Server Node.js)
const API_URL = "http://localhost:5000/api/hokhau";

//Các buttons
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

// --- HÀM LẤY DỮ LIỆU TỪ MONGODB (QUA API) ---
async function fetchHoKhau() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error("Lỗi kết nối server:", error);
  }
}

function renderTable(listHoKhau) {
  family.innerHTML = "";
  listHoKhau.forEach((hoKhau) => {
    const tr = document.createElement("tr");
    // Đếm số thành viên
    const soThanhVien = hoKhau.members ? hoKhau.members.length : 0;

    tr.innerHTML = `
            <td>${hoKhau.maHoKhau}</td>
            <td>${hoKhau.chuHo}</td>
            <td>${hoKhau.diaChi}</td>
            <td>${soThanhVien}</td>
            <td>
                <button class="action-btn view-btn" data-id="${hoKhau.maHoKhau}">Xem</button>
                <button class="action-btn delete-btn" data-id="${hoKhau.maHoKhau}">Xóa</button>
            </td>
        `;
    family.appendChild(tr);
  });
  addEvents(); //gọi hàm để gán chức năng cho 2 nút Xem và Xoá
}

function addEvents() {
  //hàm cho nút Xem và Xoá
  // Nút Xem
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.onclick = function () {
      const id = this.getAttribute("data-id");
      window.location.href = `./info_family/info_table.html?maHo=${id}`;
    };
  });

  // Nút Xóa
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = async function () {
      const id = this.getAttribute("data-id");
      if (confirm(`Xóa hộ khẩu ${id}?`)) {
        // Gọi API Xóa
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        alert("Đã xóa!");
        fetchHoKhau(); // Tải lại bảng
      }
    };
  });
}

// --- NÚT LƯU (GỌI API POST) ---
const saveBtn = document.getElementById("save");
if (saveBtn) {
  saveBtn.onclick = async () => {
    alert("đã thêm thành công");
    const payload = {
      maHoKhau: document.getElementById("maHoKhau").value,
      diaChi: document.getElementById("diaChi").value,
      chuHo: document.getElementById("chuHo").value,
      ngaySinhChuHo: document.getElementById("ngaySinh").value,
      cccdChuHo: document.getElementById("cccd").value,
      sdtChuHo: document.getElementById("sdt").value,
      members: [], // Ban đầu mảng rỗng
    };

    // Thêm chủ hộ vào danh sách thành viên luôn
    payload.members.push({
      hoTen: payload.chuHo,
      ngaySinh: payload.ngaySinhChuHo,
      cccd: payload.cccdChuHo,
      sdt: payload.sdtChuHo,
      quanHe: "Chủ hộ",
    });

    // Gửi lên Server
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Thêm thành công!");
        overlay.style.display = "none";
        fetchHoKhau(); // Tải lại dữ liệu mới
      } else {
        alert("Lỗi! Có thể mã hộ đã tồn tại.");
      }
    } catch (err) {
      console.error(err);
    }
  };
}

// Chạy khi load trang
fetchHoKhau();

// delete_info.onclick = () => {
//   alert("Đã xoá thành công!");
// };

// show_info.onclick = () => {
//   window.location.href = "./info_family/info_table.html";
// };

// document.getElementById("save").onclick = () => {
//   const data = {
//     maHoKhau: document.getElementById("maHoKhau").value,
//     diaChi: document.getElementById("diaChi").value,
//     chuHo: document.getElementById("chuHo").value,
//     ngaySinh: document.getElementById("ngaySinh").value,
//     cccd: document.getElementById("cccd").value,
//     sdt: document.getElementById("sdt").value,
//   };

//   console.log("Dữ liệu thêm mới:", data);

//   // Sau này bạn gửi data lên server bằng fetch()

//   alert("Đã thêm! (demo)");

//   overlay.style.display = "none";
// };
