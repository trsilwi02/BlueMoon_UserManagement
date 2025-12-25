const API_SUMMARY = "http://localhost:3000/api/congno/summary";
const API_CONGNO  = "http://localhost:3000/api/congno";

/* ===============================
   ELEMENTS
   =============================== */
const tableBody    = document.getElementById("tableBody");
const modalOverlay = document.getElementById("modalOverlay");
const detailOverlay = document.getElementById("detailOverlay");

const btnAdd   = document.getElementById("newadd");
const btnClose = document.getElementById("close");
const btnSave  = document.getElementById("save");

const searchInput = document.getElementById("searchInput");
const totalDebtEl = document.getElementById("totalDebt");

/* ===============================
   STATE
   =============================== */
let danhSachCongNo = [];

/* ===============================
   UTIL
   =============================== */
const formatMoney = (num = 0) =>
  Number(num).toLocaleString("vi-VN") + " đ";

/* ===============================
   1. LOAD DANH SÁCH CÔNG NỢ
   =============================== */
async function fetchCongNo() {
  try {
    const res = await fetch(API_SUMMARY);
    danhSachCongNo = await res.json();
    renderTable(danhSachCongNo);
  } catch (err) {
    console.error("Lỗi tải công nợ:", err);
  }
}

/* ===============================
   2. RENDER TABLE
   =============================== */
function renderTable(data) {
  tableBody.innerHTML = "";
  let tongNo = 0;

  data.forEach(item => {
    tongNo += item.conNo || 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:center;font-weight:bold">${item.maHo}</td>
      <td>${item.tenChuHo}</td>
      <td style="text-align:center">${item.ky || "-"}</td>
      <td class="total-money">${formatMoney(item.tongTien)}</td>
      <td class="debt-money">${formatMoney(item.conNo)}</td>
      <td class="task-btn">
        <button class="action-btn view-btn"
          onclick='xemChiTiet(${JSON.stringify(item)})'>
          Xem
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalDebtEl.textContent = formatMoney(tongNo);
}

/* ===============================
   3. MODAL THÊM CÔNG NỢ
   =============================== */
btnAdd.onclick = () => {
  modalOverlay.style.display = "flex";
  clearForm();
};

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  document.getElementById("MaHo").value = "";
  document.getElementById("HanThanhToan").value = "";
  document.getElementById("phiDien").value = "";
  document.getElementById("phiNuoc").value = "";
  document.getElementById("phiRac").value  = "";
  document.getElementById("phiQL").value   = "";
  document.getElementById("TongTien").value = "0 đ";
}

/* ===============================
   4. TÍNH TỔNG TIỀN
   =============================== */
function tinhTongTien() {
  const dien = Number(document.getElementById("phiDien").value || 0);
  const nuoc = Number(document.getElementById("phiNuoc").value || 0);
  const rac  = Number(document.getElementById("phiRac").value  || 0);
  const ql   = Number(document.getElementById("phiQL").value   || 0);

  const total = dien + nuoc + rac + ql;
  document.getElementById("TongTien").value = formatMoney(total);

  return { dien, nuoc, rac, ql, total };
}

["phiDien","phiNuoc","phiRac","phiQL"].forEach(id => {
  document.getElementById(id).addEventListener("input", tinhTongTien);
});

/* ===============================
   5. LƯU CÔNG NỢ
   =============================== */
btnSave.onclick = async () => {
  const maHo = document.getElementById("MaHo").value.trim();
  const hanThanhToan = document.getElementById("HanThanhToan").value;

  if (!maHo || !hanThanhToan) {
    alert("Vui lòng nhập mã hộ và hạn thanh toán!");
    return;
  }

  const { dien, nuoc, rac, ql, total } = tinhTongTien();

  if (total <= 0) {
    alert("Vui lòng nhập ít nhất một khoản phí!");
    return;
  }

  const danhSachPhi = [
    { loaiPhi: "dien", soTien: dien },
    { loaiPhi: "nuoc", soTien: nuoc },
    { loaiPhi: "rac",  soTien: rac  },
    { loaiPhi: "ql",   soTien: ql   }
  ].filter(p => p.soTien > 0);

  try {
    for (const phi of danhSachPhi) {
      const res = await fetch(API_CONGNO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoKhauId: maHo,
          loaiPhi: phi.loaiPhi,
          soTien: phi.soTien,
          hanThanhToan
        })
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Lỗi: " + result.message);
        return;
      }
    }

    alert("Thêm công nợ thành công!");
    modalOverlay.style.display = "none";
    fetchCongNo();

  } catch (error) {
    alert("Không thể kết nối tới server!");
  }
};

/* ===============================
   6. XEM CHI TIẾT CÔNG NỢ
   =============================== */
window.xemChiTiet = (item) => {
  detailOverlay.style.display = "flex";

  document.getElementById("dMaHo").value  = item.maHo;
  document.getElementById("dChuHo").value = item.tenChuHo;
  document.getElementById("dKy").value    = item.ky;

  document.getElementById("dDien").value =
    formatMoney(item.chiTiet?.dien || 0);
  document.getElementById("dNuoc").value =
    formatMoney(item.chiTiet?.nuoc || 0);
  document.getElementById("dRac").value =
    formatMoney(item.chiTiet?.rac || 0);
  document.getElementById("dQL").value =
    formatMoney(item.chiTiet?.ql || 0);

  document.getElementById("dTong").value =
    formatMoney(item.tongTien);
};

window.closeDetail = () => {
  detailOverlay.style.display = "none";
};

/* ===============================
   7. TÌM KIẾM
   =============================== */
searchInput.oninput = () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = danhSachCongNo.filter(item =>
    item.maHo.toLowerCase().includes(keyword) ||
    item.tenChuHo.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
};

/* ===============================
   INIT
   =============================== */
fetchCongNo();
