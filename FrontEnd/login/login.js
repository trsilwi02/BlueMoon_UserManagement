const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ username và password!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Lưu user đăng nhập
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Đăng nhập thành công!");
      window.location.href =
        "/BlueMoon_UserManagement/FrontEnd/index.html";
    } else {
      alert(data.message || "Sai tên đăng nhập hoặc mật khẩu!");
    }
  } catch (error) {
    console.error("Lỗi login:", error);
    alert("Không thể kết nối tới server!");
  }
});
