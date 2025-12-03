// // Lấy các element cần thiết
// const modal = document.getElementById("invoiceModal");

// // Hàm mở Modal
// function openModal(btn) {
//   // 1. Tìm thẻ <tr> cha của nút vừa bấm
//   const tr = btn.closest("tr");

//   // 2. Lấy dữ liệu cơ bản từ các cột (td)
//   // [0]=Mã, [1]=Tên, [2]=Kỳ, [3]=Tổng, [4]=Còn nợ
//   const tds = tr.querySelectorAll("td");
//   const maHo = tds[0].innerText;
//   const tenChuHo = tds[1].innerText;
//   const tongTien = tds[3].innerText;

//   // 3. Lấy dữ liệu chi tiết ẩn trong data-attributes
//   // dataset.dien sẽ lấy giá trị của data-dien=""
//   const dien = tr.dataset.dien;
//   const nuoc = tr.dataset.nuoc;
//   const rac = tr.dataset.rac;
//   const ql = tr.dataset.ql;

//   // 4. Đổ dữ liệu vào các ô input trong Modal
//   document.getElementById("modalMaHo").value = maHo;
//   document.getElementById("modalChuHo").value = tenChuHo;

//   // Thêm ' đ' vào sau số tiền cho đẹp nếu chưa có
//   document.getElementById("modalDien").value = formatMoney(dien);
//   document.getElementById("modalNuoc").value = formatMoney(nuoc);
//   document.getElementById("modalRac").value = formatMoney(rac);
//   document.getElementById("modalQuanLy").value = formatMoney(ql);

//   document.getElementById("modalTong").value = tongTien;

//   // 5. Hiển thị Modal
//   modal.classList.add("show");
// }

// // Hàm đóng Modal
// function closeModal() {
//   modal.classList.remove("show");
// }

// // Hàm phụ trợ: Nếu trong data chưa có chữ 'đ' thì thêm vào
// function formatMoney(value) {
//   if (!value) return "0 đ";
//   if (value.includes("đ")) return value;
//   return value + " đ";
// }

// // Đóng modal khi click ra vùng đen bên ngoài
// window.onclick = function (event) {
//   if (event.target == modal) {
//     closeModal();
//   }
// };

/**
 * Dữ liệu công nợ giả lập
 * Các thuộc tính 'data-...' trong HTML sẽ được dùng để populate modal
 */
const mockCongNoData = [
  {
    maHo: 'A101',
    tenChuHo: 'Nguyễn Thành Lương',
    ky: '11/2025',
    tongTien: 1250000,
    conNo: 0,
    chiTiet: {
      dien: 850000,
      nuoc: 150000,
      rac: 50000,
      ql: 200000
    }
  },
  {
    maHo: 'B205',
    tenChuHo: 'Trần Thị B',
    ky: '11/2025',
    tongTien: 2100000,
    conNo: 2100000,
    chiTiet: {
      dien: 1500000,
      nuoc: 300000,
      rac: 50000,
      ql: 250000
    }
  },
  {
    maHo: 'C309',
    tenChuHo: 'Lê Văn C',
    ky: '11/2025',
    tongTien: 1350000,
    conNo: 500000,
    chiTiet: {
      dien: 900000,
      nuoc: 200000,
      rac: 50000,
      ql: 200000
    }
  },
  // Thêm dữ liệu giả lập khác nếu cần...
];

/**
 * Hàm định dạng số thành chuỗi tiền tệ Việt Nam (ví dụ: 1.250.000)
 * @param {number} number - Số tiền cần định dạng
 * @returns {string} Chuỗi tiền tệ
 */
const formatCurrency = (number) => {
  return number.toLocaleString('vi-VN');
};

/**
 * 1. fetchCongNo: Giả lập việc gọi API lấy dữ liệu công nợ
 * @returns {Promise<Array<Object>>} Danh sách công nợ
 */
const fetchCongNo = async () => {
  // Giả lập độ trễ của API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Trả về dữ liệu giả lập
  return mockCongNoData;
};

/**
 * 2. renderTable: Render dữ liệu công nợ ra bảng HTML
 * @param {Array<Object>} data - Dữ liệu công nợ để hiển thị
 */
const renderTable = (data) => {
  const tableBody = document.querySelector('.table-section tbody');
  if (!tableBody) return;

  // Cập nhật tổng nợ cần thu
  const totalDebtElement = document.querySelector('.stats-number');
  const totalDebt = data.reduce((sum, item) => sum + item.conNo, 0);
  if (totalDebtElement) {
    totalDebtElement.textContent = `${formatCurrency(totalDebt)} đ`;
  }

  // Tạo hàng (row) cho bảng
  const rowsHtml = data.map(item => {
    // Xác định màu cho cột 'Còn nợ'
    const debtColor = item.conNo > 0 ? '#d32f2f' : 'green';

    return `
      <tr 
        data-maho="${item.maHo}" 
        data-chuho="${item.tenChuHo}"
        data-ky="${item.ky}"
        data-dien="${formatCurrency(item.chiTiet.dien)}" 
        data-nuoc="${formatCurrency(item.chiTiet.nuoc)}" 
        data-rac="${formatCurrency(item.chiTiet.rac)}" 
        data-ql="${formatCurrency(item.chiTiet.ql)}"
        data-tong="${formatCurrency(item.tongTien)}"
      >
        <td><strong>${item.maHo}</strong></td>
        <td>${item.tenChuHo}</td>
        <td>${item.ky}</td>
        <td style="text-align: right">${formatCurrency(item.tongTien)}</td>
        <td style="text-align: right; color: ${debtColor}; font-weight: bold">${formatCurrency(item.conNo)}</td>
        <td class="action-cell">
          <button class="btn btn-detail" onclick="openModal(this)">Chi tiết</button>
        </td>
      </tr>
    `;
  }).join('');

  tableBody.innerHTML = rowsHtml;
};

/**
 * 3. Xử lý sự kiện tìm kiếm và lọc dữ liệu
 */
const searchInput = document.querySelector('.search-box input[type="text"]');
if (searchInput) {
  searchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    let currentData = await fetchCongNo(); // Lấy lại dữ liệu gốc

    const filteredData = currentData.filter(item => {
      // Tìm kiếm theo Mã hộ hoặc Tên chủ hộ
      return item.maHo.toLowerCase().includes(searchTerm) || 
             item.tenChuHo.toLowerCase().includes(searchTerm);
    });

    renderTable(filteredData);
  });
}

/**
 * 4. openModal: Xử lý mở modal Chi tiết và đổ dữ liệu
 * @param {HTMLButtonElement} button - Nút 'Chi tiết' được click
 */
const openModal = (button) => {
  const row = button.closest('tr'); // Lấy hàng (tr) chứa nút
  const modal = document.getElementById('invoiceModal');

  if (row && modal) {
    // Lấy dữ liệu từ các thuộc tính data- của thẻ <tr>
    const maHo = row.dataset.maho;
    const chuHo = row.dataset.chuho;
    const ky = row.dataset.ky;
    const dien = row.dataset.dien;
    const nuoc = row.dataset.nuoc;
    const rac = row.dataset.rac;
    const ql = row.dataset.ql;
    const tong = row.dataset.tong;

    // Đổ dữ liệu vào các input trong modal
    document.getElementById('modalMaHo').value = `${maHo} - Kỳ ${ky}`;
    document.getElementById('modalChuHo').value = chuHo;
    document.getElementById('modalDien').value = dien;
    document.getElementById('modalNuoc').value = nuoc;
    document.getElementById('modalRac').value = rac;
    document.getElementById('modalQuanLy').value = ql;
    document.getElementById('modalTong').value = `${tong} đ`;

    // Hiển thị modal
    modal.style.display = 'flex';
  }
};

/**
 * 5. closeModal: Đóng modal Chi tiết
 */
const closeModal = () => {
  const modal = document.getElementById('invoiceModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Đảm bảo hàm này có thể được gọi từ HTML (trong nút Chi tiết)
window.openModal = openModal;
window.closeModal = closeModal;

/**
 * Khởi tạo ứng dụng: Lấy dữ liệu và render bảng khi trang load
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchCongNo();
    renderTable(data);
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu công nợ:", error);
    // Có thể thêm thông báo lỗi cho người dùng ở đây
  }
});

//BackendGia lập