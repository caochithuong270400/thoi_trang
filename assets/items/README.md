# Ảnh đồ cho nhân vật

**Bỏ ảnh vào đúng thư mục là đồ tự hiện trong game.** Không cần sửa code.
Game đang mở cũng tự cập nhật sau khoảng 2 giây.

| Thư mục   | Loại      |
|-----------|-----------|
| `hair/`   | Tóc       |
| `top/`    | Áo, đầm   |
| `bottom/` | Váy, quần |
| `shoes/`  | Giày      |
| `hat/`    | Mũ        |
| `acc/`    | Phụ kiện  |

## Mở game

Bấm đúp **`start.bat`** ở thư mục gốc. Trình duyệt sẽ mở `http://localhost:5173`.

> Nếu mở thẳng `index.html` thì trình duyệt không cho đọc thư mục, nên ảnh
> mới sẽ không tự hiện. Khi đó phải khai báo ảnh trong `items.js`.

## Đặt tên file

- Tên file là tên hiện trong game: `Áo khoác xanh.png` hiện là **Áo khoác xanh**.
  Dấu `-` và `_` được đổi thành khoảng trắng.
- File tên `<tên>_sau.png` là **lớp nằm sau lưng** nhân vật của `<tên>.png`.
  Ví dụ `Tóc dài.png` đi cùng `Tóc dài_sau.png`.
- File tên `<tên>_dang2.png` là **bản vẽ riêng cho Dáng 2** (vẽ trên dáng bên phải của
  `assets/character_2.png`). Không có file này thì quần/giày vẽ cho dáng 1 sẽ được tự dịch
  ống chân cho gần khớp dáng 2.
- Danh sách xếp theo tên file.

## Cỡ ảnh: game tự căn

| Cỡ ảnh        | Vẽ trên                           | Game làm gì                                    |
|---------------|-----------------------------------|------------------------------------------------|
| 1047 × 1501   | `assets/character.png`            | Đặt chồng thẳng lên nhân vật                   |
| 1072 × 1228   | template của `top/chara.png`      | Phóng và căn đúng lưới ô; chỉ giữ phần của loại đó (ví dụ ảnh áo thì bỏ quần, giày) |
| Cỡ khác       | -                                 | Co lại cho vừa (có thể lệch, nên dùng 2 cỡ trên) |

Cách vẽ: mở template, vẽ đồ trên **layer mới**, ẩn layer nhân vật, rồi xuất
**PNG nền trong suốt, giữ nguyên cỡ ảnh, không cắt**.

## `items.js`: không bắt buộc

Chỉ dùng khi muốn đổi tên, số tim, hoặc tự đặt vị trí cho một ảnh:

```js
top: [
  { file: 'chara.png', name: 'Áo khoác xanh', stars: 4 },
],
```

Tuỳ chọn:
- `under: true`: dùng cho phụ kiện, để nó nằm dưới tóc.
- `box: [x, y, rộng, cao]`: khung ảnh xem trước.
- `crop` + `to`: tự đặt vị trí cho ảnh có cỡ lạ. 1 ô của nhân vật = 22.2px;
  ô ở cột c, hàng r nằm tại x = 2 + 22.2·c, y = 153 + 22.2·r.
