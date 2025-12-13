const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("signup-btn");

registerBtn.addEventListener("click", async function () {
  const fullname = fullnameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!fullname || !username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  //Gửi dữ liệu về Server (Backend)
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: fullname,
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    // 4. Xử lý kết quả trả về từ Server
    if (response.ok) {
      // Nếu thành công (status 200/201)
      alert("Đăng ký thành công! Đang chuyển hướng...");
      window.location.href = "../login/index.html";
    } else {
      // Nếu thất bại (ví dụ trùng tên đăng nhập)
      alert(data.message || "Đăng ký thất bại, vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối đến máy chủ.");
  }
});
