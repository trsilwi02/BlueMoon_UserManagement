const add_mem = document.getElementById("add_mem");
const save2 = document.getElementById("save2");
const close2 = document.getElementById("close2");
const delete_info2 = document.getElementById("delete_info2");
const overlay2 = document.getElementById("modalOverlay2");

add_mem.onclick = () => {
  overlay2.style.display = "flex";
};

save2.onclick = () => {
  alert("Đã thêm thành viên!");
  overlay2.style.display = "none";
};

close2.onclick = () => {
  overlay2.style.display = "none";
};

delete_info2.onclick = () => {
  alert("Đã xoá thành công!");
  overlay2.style.display = "none";
};
