/*
  DANH SÁCH ẢNH ĐỒ — thêm 1 dòng cho mỗi ảnh bạn bỏ vào thư mục tương ứng.

  Thư mục:
    hair/    Tóc        top/   Áo (cả đầm)     bottom/  Váy / Quần
    shoes/   Giày       hat/   Mũ              acc/     Phụ kiện

  Mỗi dòng:
    { file: 'ten-anh.png', name: 'Tên hiện trong game', stars: 1..5 }

  Tuỳ chọn thêm:
    back:  'ten-anh-sau.png'   lớp nằm SAU nhân vật (vd: phần tóc dài sau lưng)
    under: true                (chỉ cho Phụ kiện) nằm dưới tóc, vd: khăn, vòng cổ
    box:   [x, y, rộng, cao]   khung cắt ảnh xem trước, tính theo pixel trên ảnh 1047x1501

  Ảnh KHÔNG cùng cỡ 1047x1501 (vd. vẽ trên template khác):
    size:  [rộng, cao]         cỡ ảnh gốc
    crop:  [x, y, rộng, cao]   vùng cần lấy trong ảnh gốc
    to:    [x, y, rộng, cao]   vị trí đặt lên ảnh nhân vật (pixel trên 1047x1501)
    Mẹo: 1 ô nhân vật = 22.2px, ô (cột c, hàng r) ở x = 2 + 22.2*c, y = 153 + 22.2*r

  Ví dụ (bỏ // ở đầu dòng để dùng):
    hair: [
      { file: 'toc-dai.png', back: 'toc-dai-sau.png', name: 'Tóc dài', stars: 4 },
    ],
*/
window.ITEM_IMAGES = {
  hair: [
    // { file: 'toc-dai.png', name: 'Tóc dài', stars: 4 },
  ],
  top: [
    // chara.png: 1072x1228, ô pixel ~16.12px. Lấy 21x16 ô áo khoác
    // (bỏ quần + giày bên dưới), đặt vào ô cột 13, hàng 28 của nhân vật.
    { file: 'chara.png', name: 'Áo khoác xanh', stars: 4,
      size: [1072, 1228],
      crop: [357, 673, 338.5, 258],
      to:   [290.6, 774.6, 466.2, 355.2] },
  ],
  bottom: [
    // { file: 'vay-xoe.png', name: 'Váy xòe', stars: 3 },
  ],
  shoes: [
    // { file: 'giay-bup-be.png', name: 'Giày búp bê', stars: 2 },
  ],
  hat: [
    // { file: 'mu-len.png', name: 'Mũ len', stars: 2 },
  ],
  acc: [
    // { file: 'kinh.png', name: 'Kính', stars: 3 },
  ],
};
