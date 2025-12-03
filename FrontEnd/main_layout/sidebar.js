async function loadSidebar() {
  try {
    // 1. Gửi request đọc file sidebar.html
    const response = await fetch("../main_layout/sidebar.html"); //await giúp dừng hàm tại đây cho đến khi fetch xong
    // const response = await fetch("FrontEnd/main_layout/sidebar.html"); //await giúp dừng hàm tại đây cho đến khi fetch xong

    // 2. Kiểm tra nếu file không tồn tại
    if (!response.ok) {
      throw new Error("Không tìm thấy sidebar.html");
    }

    // 3. Lấy nội dung file dưới dạng text
    const html = await response.text();

    // 4. Chèn nội dung vào thẻ <div id="sidebar">
    document.getElementById("sidebar").innerHTML = html;
  } catch (error) {
    console.error("Lỗi load sidebar:", error);
  }
}

loadSidebar(); // Gọi hàm
