// Lấy các input
const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const registerBtn = document.getElementById("signup-btn");

// Hàm kiểm tra mật khẩu mạnh
function isValidPassword(password) {
  const hasUpperCase = /[A-Z]/.test(password); // chữ hoa
  const hasLowerCase = /[a-z]/.test(password); // chữ thường
  const hasNumber = /[0-9]/.test(password);    // chữ số
  const isLongEnough = password.length >= 8;   // >= 8 ký tự

  return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
}

registerBtn.addEventListener("click", async function () {
  const fullname = fullnameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // 1️⃣ Kiểm tra nhập đủ thông tin
  if (!fullname || !username || !password || !confirmPassword) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // 2️⃣ Kiểm tra mật khẩu nhập lại
  if (password !== confirmPassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  // 3️⃣ Kiểm tra độ mạnh mật khẩu
  if (!isValidPassword(password)) {
    alert(
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số!"
    );
    return;
  }

  // 4️⃣ Gửi dữ liệu lên backend (chỉ username + password)
  try {
    const response = await fetch("http://localhost:3000/api/user/register", {
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
      // 5️⃣ Lưu fullname để dùng sau khi login
      localStorage.setItem(
        "registeredUser",
        JSON.stringify({
          username,
          fullname,
        })
      );

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "../login/login.html";
    } else {
      alert(data.message || "Đăng ký thất bại!");
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    alert("Không thể kết nối đến máy chủ.");
  }
});
