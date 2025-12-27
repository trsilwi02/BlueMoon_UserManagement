/* ===============================
   DOM
   =============================== */
const tableBody = document.getElementById("tableBody");
const totalCountEl = document.getElementById("totalCount");
const searchInput = document.getElementById("searchInput");

/* ===============================
   API
   =============================== */
const API_NHANKHAU = "http://localhost:3000/api/nhankhau";

/* ===============================
   STATE
   =============================== */
let danhSachNhanKhau = [];

/* ===============================
   FETCH DATA
   =============================== */
async function fetchNhanKhau() {
  try {
    const res = await fetch(API_NHANKHAU);
    if (!res.ok) throw new Error("Không lấy được dữ liệu");

    const data = await res.json();
    danhSachNhanKhau = Array.isArray(data) ? data : [];
    renderTable(danhSachNhanKhau);
  } catch (error) {
    console.error("Lỗi kết nối Server:", error);
    alert("Không kết nối được với Server!");
  }
}

/* ===============================
   FORMAT DATE
   =============================== */
function formatDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

/* ===============================
   LẤY ĐỊA CHỈ (AN TOÀN)
   =============================== */
function getDiaChi(item) {
  return item.DiaChi || item.hoKhau?.DiaChi || "";
}

/* ===============================
   RENDER TABLE
   =============================== */
function renderTable(data) {
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:20px;color:#64748b;">
          Không tìm thấy kết quả nào
        </td>
      </tr>
    `;
    totalCountEl.innerText = 0;
    return;
  }

  data.forEach((item, index) => {
    const diaChi = getDiaChi(item);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:center">${index + 1}</td>

      <td style="font-weight:500">
        ${item.HoVaTen || ""}
      </td>

      <td style="text-align:center">
        ${formatDate(item.NgaySinh)}
      </td>

      <td style="text-align:center">
        ${item.GioiTinh || "Khác"}
      </td>

      <td style="text-align:center">
        <span class="tag-cccd">${item.cccd || ""}</span>
      </td>

      <td style="text-align:center">
        ${item.sdt || ""}
      </td>

      <td style="text-align:center;font-weight:600">
        ${item.IDHoKhau || ""}
      </td>

      <td
        style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
        title="${diaChi}"
      >
        ${diaChi}
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalCountEl.innerText = data.length;
}

/* ===============================
   SEARCH
   =============================== */
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.trim().toLowerCase();

  if (!keyword) {
    renderTable(danhSachNhanKhau);
    return;
  }

  const filtered = danhSachNhanKhau.filter(
    (item) =>
      (item.HoVaTen || "").toLowerCase().includes(keyword) ||
      (item.cccd || "").includes(keyword) ||
      (item.sdt || "").includes(keyword)
  );

  renderTable(filtered);
});

fetchNhanKhau();
