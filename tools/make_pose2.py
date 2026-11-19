"""
Tạo assets/character_pose2.png (dáng 2) từ:
  - assets/character.png    : nhân vật gốc (dáng 1, có mặt)
  - assets/character_2.png  : template 2 dáng (trái = dáng 1, phải = dáng 2)

Đầu + thân hai dáng giống nhau, nên chỉ vẽ lại phần từ hàng 41 (hông)
trở xuống theo dáng phải, tô theo bảng màu của character.png.

Chạy lại khi sửa character_2.png:   python tools/make_pose2.py
"""
from pathlib import Path
from statistics import median
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
A = Image.open(ROOT / 'assets/character.png').convert('RGBA')
T = Image.open(ROOT / 'assets/character_2.png').convert('RGBA')
a, t = A.load(), T.load()

CELL, OX, OY = 22.2, 2, 153            # lưới ô của character.png (giống js/game.js)
S = CELL / 16.12                       # 1 ô template = 16.12px
OX_L, OY_L = 138.98, -140.24           # template (dáng trái) -> character.png
RIGHT_DX, RIGHT_DY = 504, 2            # dáng phải lệch so với dáng trái (px template)
FIRST_ROW, LAST_ROW = 41, 56


def tclass(p):                          # loại ô trên template (viền đỏ)
    if p[3] < 128: return '.'
    r, g, b = p[:3]
    if r < 170: return 'D'              # viền đậm
    if g < 120: return 'O'              # viền
    if g < 210: return 's'              # bóng
    return '-'                          # da


def aclass(p):                          # loại ô trên character.png
    if p[3] < 128: return '.'
    l = p[0] * .299 + p[1] * .587 + p[2] * .114
    return 'D' if l < 60 else 'O' if l < 150 else 's' if l < 215 else '-'


def tsample(c, r, dx=0, dy=0):
    X, Y = OX + CELL * (c + .5), OY + CELL * (r + .5)
    tx, ty = int((X - OX_L) / S) + dx, int((Y - OY_L) / S) + dy
    return t[tx, ty] if 0 <= tx < T.width and 0 <= ty < T.height else (0, 0, 0, 0)


def cell_box(c, r):
    return (round(OX + c * CELL), round(OY + r * CELL),
            round(OX + (c + 1) * CELL), round(OY + (r + 1) * CELL))


# Bảng màu lấy từ chính character.png (trung vị màu tâm ô từng loại)
samples = {}
for r in range(28, 53):
    for c in range(47):
        X, Y = int(OX + CELL * (c + .5)), int(OY + CELL * (r + .5))
        samples.setdefault(aclass(a[X, Y]), []).append(a[X, Y])
PAL = {k: tuple(int(median(p[i] for p in v)) for i in range(3)) + (255,) for k, v in samples.items() if k != '.'}
PAL['.'] = (0, 0, 0, 0)

out = A.copy()
o = out.load()
changed = 0
for r in range(FIRST_ROW, LAST_ROW):
    for c in range(6, 42):              # chỉ vùng nhân vật (tránh lấy nhầm dáng trái)
        left = tclass(tsample(c, r))
        right = tclass(tsample(c, r, RIGHT_DX, RIGHT_DY))
        # tô lại cả ô giống nhau để xoá vệt mờ của viền chân cũ
        x0, y0, x1, y1 = cell_box(c, r)
        for y in range(y0, min(y1, A.height)):
            for x in range(x0, min(x1, A.width)):
                o[x, y] = PAL[right]
        changed += left != right

out.save(ROOT / 'assets/character_pose2.png')
print('Đã tạo assets/character_pose2.png, đổi', changed, 'ô')
