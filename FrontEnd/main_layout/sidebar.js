// ================= LOAD SIDEBAR =================
async function loadSidebar() {
  try {
    const response = await fetch("../main_layout/sidebar.html");
    if (!response.ok) {
      throw new Error("Không tìm thấy sidebar.html");
    }

    const html = await response.text();
    document.getElementById("sidebar").innerHTML = html;

    // Sau khi load xong sidebar → xử lý giao diện theo trạng thái đăng nhập
    handleAuthUI();
  } catch (error) {
    console.error("Lỗi load sidebar:", error);
  }
}

loadSidebar();

// ================= XỬ LÝ HIỂN THỊ USER / LOGIN / LOGOUT =================
function handleAuthUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

  const usernameEl = document.getElementById("sidebar-username");
  const loginLink = document.querySelector('a[href*="login"]');
  const registerLink = document.querySelector('a[href*="dangky"]');
  const logoutBtn = document.getElementById("logout-btn");

  if (user) {
    // ===== ĐÃ ĐĂNG NHẬP =====

    // Lấy fullname ưu tiên
    let displayName = "";

    if (user.fullname) {
      displayName = user.fullname;
    } else if (
      registeredUser &&
      registeredUser.username === user.username
    ) {
      displayName = registeredUser.fullname;
    } else {
      displayName = user.username;
    }

    if (usernameEl) {
      usernameEl.innerHTML = `<b>Xin chào:</b> ${displayName}`;
      usernameEl.style.display = "block";
    }

    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    // ===== CHƯA ĐĂNG NHẬP =====
    if (usernameEl) {
      usernameEl.style.display = "none";
    }

    if (loginLink) loginLink.style.display = "block";
    if (registerLink) registerLink.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ================= XỬ LÝ ĐĂNG XUẤT =================
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "logout-btn") {
    e.preventDefault();

    const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmLogout) return;

    // Xóa thông tin đăng nhập
    localStorage.removeItem("user");

    // Quay về trang đăng nhập
    window.location.href =
      "/BlueMoon_UserManagement/FrontEnd/login/login.html";
  }
});
