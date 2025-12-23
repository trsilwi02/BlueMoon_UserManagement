// File này dành cho xử lý dữ liệu backend
// Ví dụ demo render dữ liệu:

const data = []; // Bạn sẽ thay bằng API backend

const tbody = document.getElementById("data-body");
const count = document.getElementById("count");

// Hàm render
function renderTable() {
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.owner}</td>
                <td>${item.plate}</td>
                <td>${item.type}</td>
                <td>${item.note}</td>
                <td><button>Xóa</button></td>
            </tr>
        `;
  });

  count.textContent = data.length;
}

renderTable();
