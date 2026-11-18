# Ảnh đồ cho nhân vật

## Thư mục

| Thư mục   | Loại        |
|-----------|-------------|
| `hair/`   | Tóc         |
| `top/`    | Áo, đầm     |
| `bottom/` | Váy, quần   |
| `shoes/`  | Giày        |
| `hat/`    | Mũ          |
| `acc/`    | Phụ kiện    |

## Cách vẽ ảnh để mặc khít

1. Mở `assets/character.png` (1047 × 1501 px) trong Aseprite / Photoshop / Piskel.
2. Vẽ món đồ trên **một layer mới** đè lên nhân vật.
3. Ẩn layer nhân vật, xuất **PNG nền trong suốt, giữ nguyên cỡ 1047 × 1501**.
   Không cắt ảnh. Game đặt ảnh chồng thẳng lên nhân vật, nên chỉ khớp khi
   ảnh cùng cỡ.
4. Lưới pixel của nhân vật: mỗi ô khoảng **22.2 px**, bắt đầu ở (2, 153).
   Vẽ theo lưới này thì đồ trông cùng kiểu với nhân vật.

Phần nằm sau lưng nhân vật (ví dụ tóc dài) thì xuất thành ảnh riêng
và khai báo bằng `back`.

## Khai báo

Mở `items.js` và thêm một dòng vào đúng loại:

```js
hair: [
  { file: 'toc-dai.png', back: 'toc-dai-sau.png', name: 'Tóc dài', stars: 4 },
],
```

Lưu file rồi tải lại trang. Mẫu mới hiện ở cuối danh sách của loại đó.
