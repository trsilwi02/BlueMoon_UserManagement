function checkAuth() {
  const user = localStorage.getItem("user");

if (!localStorage.getItem("user")) {
  window.location.href = "/BlueMoon_UserManagement/FrontEnd/login/login.html";
}

  if (!user) {
    window.location.href = "/BlueMoon_UserManagement/FrontEnd/login/login.html";
  }
}
