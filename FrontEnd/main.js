// =======================
// KIỂM TRA ĐĂNG NHẬP
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

  const usernameEl = document.getElementById("sidebar-username");
  const logoutBtn = document.getElementById("logout-btn");

  // ===== CHƯA ĐĂNG NHẬP =====
  if (!user) {
    if (usernameEl) usernameEl.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    return;
  }

  // ===== ĐÃ ĐĂNG NHẬP =====
  let displayName = user.username;

  if (
    registeredUser &&
    registeredUser.username === user.username &&
    registeredUser.fullname
  ) {
    displayName = registeredUser.fullname;
  }

  if (usernameEl) {
    usernameEl.innerHTML = `<b>Xin chào:</b> ${displayName}`;
    usernameEl.style.display = "block";
  }

  if (logoutBtn) logoutBtn.style.display = "block";
});


// =======================
// XỬ LÝ ĐĂNG XUẤT
// =======================
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "logout-btn") {
    e.preventDefault();

    const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmLogout) return;

    // Xóa thông tin đăng nhập
    localStorage.removeItem("user");

    // Chuyển về trang login
    window.location.href = "./login/login.html";
  }
});
