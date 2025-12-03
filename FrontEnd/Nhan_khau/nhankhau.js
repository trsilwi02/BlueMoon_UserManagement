const tableBody = document.getElementById("tableBody");
const totalCountEl = document.getElementById("totalCount");
const searchInput = document.getElementById("searchInput");

//API: url của BACKEND (server node.js)
const API_NHANKHAU = "http://localhost:5000/api/nhankhau";

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
                    item.diaChi
                  }">${item.diaChi}</td>
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

// Dữ liệu giả lập (Đã nhân bản lên để test scroll)
// const baseData = [
//   {
//     id: 1,
//     name: "Nguyễn Văn An",
//     dob: "15/05/1985",
//     cccd: "001085000123",
//     phone: "0912345678",
//     houseCode: "HK001",
//     address: "Số 12, Ngõ 5, Đường Láng, Hà Nội",
//   },
//   {
//     id: 2,
//     name: "Trần Thị Bích",
//     dob: "20/10/1990",
//     cccd: "001090000456",
//     phone: "0987654321",
//     houseCode: "HK002",
//     address: "P504, Chung cư A1, Cầu Giấy",
//   },
//   {
//     id: 3,
//     name: "Lê Văn Cường",
//     dob: "02/09/1978",
//     cccd: "001078000789",
//     phone: "0909090909",
//     houseCode: "HK001",
//     address: "Số 12, Ngõ 5, Đường Láng, Hà Nội",
//   },
//   {
//     id: 4,
//     name: "Phạm Minh Đức",
//     dob: "12/12/2000",
//     cccd: "001200000321",
//     phone: "0911223344",
//     houseCode: "HK003",
//     address: "Số 88, Phố Huế, Hai Bà Trưng",
//   },
//   {
//     id: 5,
//     name: "Hoàng Thu Trang",
//     dob: "08/03/1995",
//     cccd: "001095000654",
//     phone: "0966778899",
//     houseCode: "HK004",
//     address: "Biệt thự số 5, KĐT Ciputra",
//   },
//   {
//     id: 6,
//     name: "Đặng Văn Hùng",
//     dob: "25/07/1982",
//     cccd: "001082000987",
//     phone: "0321654987",
//     houseCode: "HK002",
//     address: "P504, Chung cư A1, Cầu Giấy",
//   },
//   {
//     id: 7,
//     name: "Vũ Thị Mai",
//     dob: "01/01/1999",
//     cccd: "001099000147",
//     phone: "0944556677",
//     houseCode: "HK005",
//     address: "Ngách 22/5, Kim Mã, Ba Đình",
//   },
//   {
//     id: 8,
//     name: "Ngô Quang Hải",
//     dob: "30/04/1988",
//     cccd: "001088000258",
//     phone: "0933445566",
//     houseCode: "HK006",
//     address: "Số 102, Trần Phú, Hà Đông",
//   },
// ];

// // Nhân bản dữ liệu lên 3 lần (24 bản ghi) để test scroll
// let demographicsData = [];
// for (let i = 0; i < 3; i++) {
//   demographicsData = demographicsData.concat(baseData);
// }

// renderTable(demographicsData);
