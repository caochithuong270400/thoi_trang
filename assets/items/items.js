/*
  KHÔNG BẮT BUỘC. Chỉ cần bỏ ảnh vào thư mục là đồ tự hiện trong game
  (mở game bằng start.bat). Tên hiển thị = tên file, vd "Áo khoác xanh.png".

  File này chỉ dùng khi muốn ghi đè thông tin cho một ảnh:
    { file: 'ten-anh.png', name: 'Tên khác', stars: 1..5 }
  Tuỳ chọn:
    under: true                (Phụ kiện) nằm dưới tóc, vd khăn, vòng cổ
    box:   [x, y, rộng, cao]   khung ảnh xem trước (pixel trên ảnh nhân vật 1047x1501)
    crop / to                  tự đặt vị trí nếu ảnh có cỡ lạ (xem README.md)
*/
window.ITEM_IMAGES = {
  top: [
    { file: 'chara.png', name: 'Áo khoác xanh', stars: 4 },
  ],
};
