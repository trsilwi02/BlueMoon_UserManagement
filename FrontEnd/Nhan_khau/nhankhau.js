// Dữ liệu giả lập (Đã nhân bản lên để test scroll)
const baseData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    dob: "15/05/1985",
    cccd: "001085000123",
    phone: "0912345678",
    houseCode: "HK001",
    address: "Số 12, Ngõ 5, Đường Láng, Hà Nội",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    dob: "20/10/1990",
    cccd: "001090000456",
    phone: "0987654321",
    houseCode: "HK002",
    address: "P504, Chung cư A1, Cầu Giấy",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    dob: "02/09/1978",
    cccd: "001078000789",
    phone: "0909090909",
    houseCode: "HK001",
    address: "Số 12, Ngõ 5, Đường Láng, Hà Nội",
  },
  {
    id: 4,
    name: "Phạm Minh Đức",
    dob: "12/12/2000",
    cccd: "001200000321",
    phone: "0911223344",
    houseCode: "HK003",
    address: "Số 88, Phố Huế, Hai Bà Trưng",
  },
  {
    id: 5,
    name: "Hoàng Thu Trang",
    dob: "08/03/1995",
    cccd: "001095000654",
    phone: "0966778899",
    houseCode: "HK004",
    address: "Biệt thự số 5, KĐT Ciputra",
  },
  {
    id: 6,
    name: "Đặng Văn Hùng",
    dob: "25/07/1982",
    cccd: "001082000987",
    phone: "0321654987",
    houseCode: "HK002",
    address: "P504, Chung cư A1, Cầu Giấy",
  },
  {
    id: 7,
    name: "Vũ Thị Mai",
    dob: "01/01/1999",
    cccd: "001099000147",
    phone: "0944556677",
    houseCode: "HK005",
    address: "Ngách 22/5, Kim Mã, Ba Đình",
  },
  {
    id: 8,
    name: "Ngô Quang Hải",
    dob: "30/04/1988",
    cccd: "001088000258",
    phone: "0933445566",
    houseCode: "HK006",
    address: "Số 102, Trần Phú, Hà Đông",
  },
];

// Nhân bản dữ liệu lên 3 lần (24 bản ghi) để test scroll
let demographicsData = [];
for (let i = 0; i < 3; i++) {
  demographicsData = demographicsData.concat(baseData);
}

const tableBody = document.getElementById("tableBody");
const totalCountEl = document.getElementById("totalCount");
const searchInput = document.getElementById("searchInput");

function renderTable(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #64748b;">Không tìm thấy kết quả nào</td></tr>`;
    totalCountEl.innerText = 0;
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                  <td style="text-align: center; color: #64748b;">${
                    index + 1
                  }</td>
                  <td style="font-weight: 500">${item.name}</td>
                  <td>${item.dob}</td>
                  <td><span class="tag-cccd">${item.cccd}</span></td>
                  <td>${item.phone}</td>
                  <td style="color: var(--primary-color); font-weight: 500;">${
                    item.houseCode
                  }</td>
                  <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${
                    item.address
                  }">${item.address}</td>
                  <td style="text-align: center;">
                      <button class="action-btn btn-edit" title="Sửa">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button class="action-btn btn-delete" title="Xóa">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                  </td>
              `;
    tableBody.appendChild(row);
  });

  totalCountEl.innerText = data.length;
}

renderTable(demographicsData);

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filteredData = demographicsData.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.cccd.includes(keyword) ||
      item.houseCode.toLowerCase().includes(keyword) ||
      item.phone.includes(keyword)
  );
  renderTable(filteredData);
});
