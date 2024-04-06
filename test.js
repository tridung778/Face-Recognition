// Lấy đối tượng input file bằng cách sử dụng id
var fileInput = document.getElementById("myFileInput");

// Lắng nghe sự kiện khi người dùng chọn tệp
fileInput.addEventListener("change", function () {
  // Kiểm tra số lượng tệp đã được chọn
  if (fileInput.files.length !== 4) {
    alert("Vui lòng chọn đúng 4 tệp ảnh.");
    // Xoá các tệp đã chọn nếu không đúng số lượng
    fileInput.value = "";
  }
});
