const tableBody = document.getElementById("tableBody");
const totalCountEl = document.getElementById("totalCount");
const searchInput = document.getElementById("searchInput");

//API: url của BACKEND (server node.js)
const API_NHANKHAU = "http://localhost:3000/api/nhankhau";

let danhSachNhanKhau = []; //mảng để lưu dữ liệu nhân khẩu từ server gửi về

//gọi api để lấy dữ liệu từ database: Quy trình: Frontend gọi API -> Backend nhận lệnh -> Backend lấy từ MongoDB -> Trả về Frontend -> Frontend hiển thị lên bảng
async function fetchNhanKhau() {
  try {
    const response = await fetch(API_NHANKHAU); //goi server
    const data = await response.json(); //nhan du lieu va doi sang kieu json
    danhSachNhanKhau = data; //luu vao mang bien toan cuc
    renderTable(danhSachNhanKhau); //ve du lieu len bang
  } catch (error) {
    console.error("Lỗi kết nối Server:", error);
    alert("Không kết nối được với Server!");
  }
}

//ham ve bang (render)
function renderTable(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #64748b;">Không tìm thấy kết quả nào</td></tr>`;
    totalCountEl.innerText = 0; //hien thi text count la bang 0
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    let displayDate = item.NgaySinh;
    if (item.NgaySinh && item.NgaySinh.includes("-")) {
      const parts = item.NgaySinh.split("-"); // Tách 2023-11-27
      if (parts.length === 3)
        displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    row.innerHTML = `
                  <td style="text-align: center">${index + 1}</td>
                  <td style="font-weight: 500">${item.HoVaTen}</td>
                  <td style="text-align: center">${displayDate}</td>
                  <td style="text-align: center">${item.GioiTinh || "Khác"}</td>
                  <td style="text-align: center"><span class="tag-cccd">${
                    item.cccd
                  }</span></td>
                  <td style="text-align: center">${item.sdt}</td>
                  <td style="text-align:center; font-weight: 500;">${
                    item.IDHoKhau
                  }</td>
                  <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${
                    item.DiaChi
                  }">${item.DiaChi}</td>
              `;
    tableBody.appendChild(row);
  });

  totalCountEl.innerText = data.length; //dem so nguoi hien thi
}

//Tim kiem
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filteredData = danhSachNhanKhau.filter(
    (item) =>
      item.HoVaTen.toLowerCase().includes(keyword) ||
      item.cccd.includes(keyword) ||
      item.sdt.includes(keyword)
  );
  renderTable(filteredData);
});

fetchNhanKhau();
