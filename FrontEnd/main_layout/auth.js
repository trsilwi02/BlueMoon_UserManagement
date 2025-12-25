function checkAuth() {
  const user = localStorage.getItem("user");

  if (!user) {

    window.location.href = "/BlueMoon_UserManagement/FrontEnd/login/index.html";
  }
}
