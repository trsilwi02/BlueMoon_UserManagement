const API_SUMMARY = "http://localhost:3000/api/congno/summary";
const API_CONGNO  = "http://localhost:3000/api/congno";

/* ===============================
   ELEMENTS
=============================== */
const tableBody = document.getElementById("tableBody");
const modalOverlay = document.getElementById("modalOverlay");
const detailOverlay = document.getElementById("detailOverlay");

const btnClose = document.getElementById("close");
const btnSave  = document.getElementById("save");

const searchInput = document.getElementById("searchInput");
const totalDebtEl = document.getElementById("totalDebt");

/* ===============================
   STATE
=============================== */
let danhSachCongNo = [];
let selectedHoKhau = null;

/* ===============================
   UTIL
=============================== */
const formatMoney = (num = 0) =>
  Number(num).toLocaleString("vi-VN") + " đ";

/* ===============================
   LOAD DATA
=============================== */
async function fetchCongNo() {
  const res = await fetch(API_SUMMARY);
  danhSachCongNo = await res.json();
  renderTable(danhSachCongNo);
}

/* ===============================
   RENDER TABLE
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
          onclick='xemChiTiet(${JSON.stringify(item)})'>Xem</button>

        <button class="action-btn"
          onclick='moThemCongNo("${item.maHo}")'>
          Thêm công nợ
        </button>

        ${
          item.conNo > 0
          ? `<button class="action-btn delete-btn"
               onclick='xacNhanThanhToan("${item.maHo}")'>
               Thanh toán
             </button>`
          : ""
        }
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalDebtEl.textContent = formatMoney(tongNo);
}

/* ===============================
   THÊM CÔNG NỢ
=============================== */
function moThemCongNo(maHo) {
  selectedHoKhau = maHo;
  modalOverlay.style.display = "flex";
  clearForm();
}

btnClose.onclick = () => {
  modalOverlay.style.display = "none";
};

function clearForm() {
  ["phiDien","phiNuoc","phiRac","phiQL"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("HanThanhToan").value = "";
  document.getElementById("TongTien").value = "0 đ";
}

/* ===============================
   TÍNH TỔNG
=============================== */
function tinhTongTien() {
  const dien = +phiDien.value || 0;
  const nuoc = +phiNuoc.value || 0;
  const rac  = +phiRac.value  || 0;
  const ql   = +phiQL.value   || 0;

  const total = dien + nuoc + rac + ql;
  TongTien.value = formatMoney(total);
  return { dien, nuoc, rac, ql };
}

["phiDien","phiNuoc","phiRac","phiQL"]
  .forEach(id => document.getElementById(id)
  .addEventListener("input", tinhTongTien));

btnSave.onclick = async () => {
  const hanThanhToan = HanThanhToan.value;
  if (!selectedHoKhau || !hanThanhToan) {
    alert("Thiếu thông tin!");
    return;
  }

  const phi = tinhTongTien();

  for (const [loaiPhi, soTien] of Object.entries(phi)) {
    if (soTien > 0) {
      await fetch(API_CONGNO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoKhauId: selectedHoKhau,
          loaiPhi,
          soTien,
          hanThanhToan
        })
      });
    }
  }

  alert("Đã thêm công nợ!");
  modalOverlay.style.display = "none";
  fetchCongNo();
};

/* ===============================
   THANH TOÁN
=============================== */
async function xacNhanThanhToan(maHo) {
  if (!confirm("Xác nhận đã thanh toán toàn bộ công nợ?")) return;

  await fetch(`${API_CONGNO}/pay/${maHo}`, { method: "PUT" });
  alert("Đã thanh toán!");
  fetchCongNo();
}

/* ===============================
   XEM CHI TIẾT
=============================== */
window.xemChiTiet = (item) => {
  detailOverlay.style.display = "flex";
  dMaHo.value = item.maHo;
  dChuHo.value = item.tenChuHo;
  dKy.value = item.ky;
  dDien.value = formatMoney(item.chiTiet?.dien || 0);
  dNuoc.value = formatMoney(item.chiTiet?.nuoc || 0);
  dRac.value = formatMoney(item.chiTiet?.rac || 0);
  dQL.value = formatMoney(item.chiTiet?.ql || 0);
  dTong.value = formatMoney(item.tongTien);
};

window.closeDetail = () => {
  detailOverlay.style.display = "none";
};

/* ===============================
   SEARCH
=============================== */
searchInput.oninput = () => {
  const kw = searchInput.value.toLowerCase();
  renderTable(
    danhSachCongNo.filter(x =>
      x.maHo.toLowerCase().includes(kw) ||
      x.tenChuHo.toLowerCase().includes(kw)
    )
  );
};

/* ===============================
   INIT
=============================== */
fetchCongNo();
