// Fake DATA (tạm để test giao diện)
let data = [
  { id: 1, name: "Quỹ xây dựng", money: 15000000, note: "Dùng sửa phòng họp" },
  { id: 2, name: "Quỹ văn nghệ", money: 3500000, note: "Tổ chức sự kiện" },
  { id: 3, name: "Quỹ khẩn cấp", money: 5000000, note: "Dự phòng nội bộ" },
];

// DOM
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("searchInput");
const countElement = document.getElementById("count");

// Render bảng
function renderTable(list) {
  tableBody.innerHTML = "";

  list.forEach((item) => {
    let row = `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.money.toLocaleString()} đ</td>
        <td>${item.note}</td>
        <td class="actions">
          <button class="edit" onclick="editFund(${item.id})">Sửa</button>
          <button class="delete" onclick="deleteFund(${item.id})">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  countElement.innerText = list.length;
}

renderTable(data);

// ---------------- SEARCH ----------------
searchInput.addEventListener("input", function () {
  let keyword = this.value.toLowerCase();

  let filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.note.toLowerCase().includes(keyword)
  );

  renderTable(filtered);
});

// --------------- ACTIONS ----------------

// Sửa
function editFund(id) {
  alert("Sửa quỹ có ID = " + id);
  // Bạn có thể mở popup / chuyển form
}

// Xóa
function deleteFund(id) {
  if (confirm("Bạn có chắc muốn xóa quỹ ID = " + id + " ?")) {
    data = data.filter((item) => item.id !== id);
    renderTable(data);
  }
}
