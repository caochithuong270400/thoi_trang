/*
  Game thời trang pixel.
  Quần áo được vẽ bằng SVG trên lưới pixel của ảnh nhân vật mẫu
  (assets/character.png, 1047x1501): 1 ô = 22.2px, gốc (2, 153).
  Toạ độ ô: c = (x - 2) / 22.2 , r = (y - 153) / 22.2
  Mốc cơ thể (ô): đầu r0..28, cổ r28..31, thân r32..41 (tay c13..15 / c32..34),
  háng r42, chân r43..53 (trái c16..22, phải c25..31).
*/
(() => {
  const CELL = 22.2, OX = 2, OY = 153;
  const IMG_W = 1047, IMG_H = 1501;   // cỡ ảnh nhân vật mẫu
  const OUTLINE = '#5b1a4e';

  // part: { c: màu, r: [[x,y,w,h], ...], flat: true = không viền }
  // item: { name, back: [parts] (vẽ sau lưng nhân vật), front: [parts] }
  const torso = [[17,32,14,1],[16,33,16,2],[15,35,18,3],[16,38,16,4]];

  // Vẽ đồ bằng bản đồ pixel: mỗi ký tự = 1 ô, '.' = trong suốt.
  // (x0, y0) = toạ độ ô của ký tự đầu tiên.
  const fromMap = (x0, y0, rows, pal) => {
    const byColor = {};
    rows.forEach((row, dy) => {
      let run = null;
      [...row, '.'].forEach((ch, dx) => {
        if (run && ch !== run.ch) {
          (byColor[run.ch] ||= []).push([x0 + run.x, y0 + dy, dx - run.x, 1]);
          run = null;
        }
        if (!run && ch !== '.') run = { ch, x: dx };
      });
    });
    return Object.entries(byColor).map(([ch, r]) => ({ c: pal[ch], flat: true, r }));
  };

  // Đầm công chúa — vẽ bám theo đúng viền thân nhân vật (cột 12..34, hàng 31..47)
  const DRESS = fromMap(12, 31, [
  //  cột: 12 ......... 34
    '.......OO.....OO.......', // 31  dây vai
    '......CAAO...OAAB......', // 32
    '...OOOCAAAOOOAAABOOO...', // 33  cổ tim + đỉnh tay phồng
    '..OCCOCAAAAAAAAABOBBO..', // 34
    '..OCAOCAAAAAAAAABOABO..', // 35
    '..OBBBOOCAAAAABOOBBBO..', // 36
    '...OOO.OCAAAAABO.OOO...', // 37  bó eo theo đường tay
    '......OCAAAAAAABO......', // 38
    '......ORRRRYRRRRO......', // 39  đai nơ
    '.....OCAAARARAAABO.....', // 40
    '...OCAABAAABAAABAABO...', // 41  chân váy xòe, xếp ly
    '..OCAABAAAABAAAABAABO..', // 42
    '.OCAAABAAAABAAAABAAABO.', // 43
    '.OCAAABAAAABAAAABAAABO.', // 44
    'OCAAAABAAAABAAAABAAAABO', // 45
    'OWWCWWCWWCWWCWWCWWCWWWO', // 46  ren trắng
    '.OOOOOOOOOOOOOOOOOOOOO.', // 47
  ], {
    O: OUTLINE, A: '#f7a1c4', B: '#e0779f', C: '#ffd0e3',
    W: '#ffffff', R: '#c2185b', Y: '#ffd54f',
  });

  const CATEGORIES = [
    { id: 'hair', label: 'Tóc', items: [
      null,
      { name: 'Tóc ngắn', front: [
        { c: '#7a4632', r: [[10,-1,28,2],[8,1,32,3],[7,4,34,4],[7,8,4,11],[37,8,4,11]] },
        { c: '#a0613f', flat: true, r: [[12,0,8,1],[10,2,6,1]] } ] },
      { name: 'Tóc dài hồng',
        back: [{ c: '#f48fb1', r: [[6,6,36,28]] }],
        front: [
          { c: '#f48fb1', r: [[10,-1,28,2],[8,1,32,3],[7,4,34,4],[6,8,5,26],[37,8,5,26]] },
          { c: '#fbc4d9', flat: true, r: [[12,0,8,1],[10,2,6,1],[7,12,1,14]] } ] },
      { name: 'Hai búi', front: [
        { c: '#2e2236', r: [[6,-5,7,6],[35,-5,7,6]] },
        { c: '#2e2236', r: [[10,-1,28,2],[8,1,32,3],[7,4,34,4],[7,8,3,10],[38,8,3,10]] },
        { c: '#ef5350', flat: true, r: [[8,1,3,1],[37,1,3,1]] },
        { c: '#5a4466', flat: true, r: [[12,0,8,1],[8,-4,2,1],[37,-4,2,1]] } ] },
      { name: 'Tóc xoăn vàng', front: [
        { c: '#ffcf4a', r: [[9,-2,30,3],[7,1,34,4],[6,5,36,3],[6,8,6,13],[36,8,6,13],[5,20,6,4],[37,20,6,4]] },
        { c: '#ffe79a', flat: true, r: [[11,-1,6,1],[9,2,4,1],[7,10,2,3],[39,10,2,3]] },
        { c: '#e0a020', flat: true, r: [[14,6,1,2],[20,6,1,2],[26,6,1,2],[32,6,1,2]] } ] },
    ]},
    { id: 'top', label: 'Áo', items: [
      null,
      { name: 'Đầm công chúa', stars: 5, front: DRESS },
      { name: 'Áo thun hồng', front: [
        { c: '#ff8fb8', r: torso },
        { c: '#ffc2d9', flat: true, r: [[17,33,3,1],[16,35,2,2]] },
        { c: '#ffffff', flat: true, r: [[22,36,4,3]] },
        { c: '#e0558f', flat: true, r: [[23,37,2,1]] } ] },
      { name: 'Áo len xanh', front: [
        { c: '#7ec8e3', r: [...torso, [14,35,2,4],[32,35,2,4]] },
        { c: '#b5e3f3', flat: true, r: [[17,33,3,1],[19,36,1,5],[23,36,1,5],[27,36,1,5]] },
        { c: '#4f9fbf', flat: true, r: [[16,41,16,1],[14,38,2,1],[32,38,2,1]] } ] },
      { name: 'Hoodie tím', back: [{ c: '#b39ddb', r: [[17,29,14,3]] }], front: [
        { c: '#b39ddb', r: [...torso, [14,35,2,4],[32,35,2,4]] },
        { c: '#8a6fc0', flat: true, r: [[19,38,10,3],[22,32,1,3],[25,32,1,3]] },
        { c: '#d8ccf0', flat: true, r: [[17,33,3,1]] } ] },
      { name: 'Sơ mi', front: [
        { c: '#fff8e7', r: torso },
        { c: '#f06292', r: [[19,31,3,2],[26,31,3,2]] },
        { c: '#f06292', flat: true, r: [[24,34,1,1],[24,36,1,1],[24,38,1,1],[24,40,1,1]] },
        { c: '#e8dcc4', flat: true, r: [[24,33,1,9]] } ] },
    ]},
    { id: 'bottom', label: 'Váy/Quần', items: [
      null,
      { name: 'Váy xếp ly', front: [
        { c: '#f06292', r: [[16,40,16,3],[15,43,18,2],[14,45,20,1]] },
        { c: '#c2185b', flat: true, r: [[18,43,1,3],[22,43,1,3],[26,43,1,3],[30,43,1,2]] },
        { c: '#f8a5c2', flat: true, r: [[16,40,16,1]] } ] },
      { name: 'Quần jean', front: [
        { c: '#5c7cfa', r: [[16,40,16,3],[17,43,6,6],[25,43,6,6]] },
        { c: '#3b5bdb', flat: true, r: [[16,40,16,1],[24,41,1,2],[17,48,6,1],[25,48,6,1]] },
        { c: '#91a7ff', flat: true, r: [[18,43,1,4],[26,43,1,4]] } ] },
      { name: 'Váy xòe vàng', front: [
        { c: '#ffe082', r: [[16,40,16,2],[15,42,18,2],[13,44,22,2]] },
        { c: '#ffffff', flat: true, r: [[17,42,1,1],[21,44,1,1],[25,42,1,1],[29,44,1,1],[15,45,1,1],[32,45,1,1]] },
        { c: '#f4b400', flat: true, r: [[16,40,16,1]] } ] },
      { name: 'Quần short', front: [
        { c: '#3d3a4b', r: [[16,40,16,3],[17,43,6,2],[25,43,6,2]] },
        { c: '#5d596e', flat: true, r: [[18,41,1,3],[29,41,1,3]] },
        { c: '#f9a8cb', flat: true, r: [[16,40,16,1]] } ] },
    ]},
    { id: 'shoes', label: 'Giày', items: [
      null,
      { name: 'Giày búp bê', front: [
        { c: '#e53935', r: [[16,51,6,2],[26,51,6,2]] },
        { c: '#ff8a80', flat: true, r: [[17,51,2,1],[27,51,2,1]] } ] },
      { name: 'Bốt trắng', front: [
        { c: '#fafafa', r: [[16,46,6,7],[26,46,6,7]] },
        { c: '#d7cfe0', flat: true, r: [[16,52,6,1],[26,52,6,1],[20,47,1,4],[30,47,1,4]] } ] },
      { name: 'Sneaker', front: [
        { c: '#4dd0e1', r: [[16,50,6,3],[26,50,6,3]] },
        { c: '#ffffff', flat: true, r: [[16,52,6,1],[26,52,6,1],[18,50,2,1],[28,50,2,1]] } ] },
      { name: 'Bốt đen', front: [
        { c: '#3e2a35', r: [[16,45,6,8],[26,45,6,8]] },
        { c: '#f48fb1', flat: true, r: [[16,45,6,1],[26,45,6,1]] },
        { c: '#5c4450', flat: true, r: [[17,47,1,4],[27,47,1,4]] } ] },
    ]},
    { id: 'hat', label: 'Mũ', items: [
      null,
      { name: 'Mũ len', front: [
        { c: '#f48fb1', r: [[10,-4,28,3],[8,-1,32,4]] },
        { c: '#ffffff', r: [[21,-7,6,3]] },
        { c: '#d81b60', flat: true, r: [[8,2,32,1],[11,-1,1,3],[16,-1,1,3],[21,-1,1,3],[26,-1,1,3],[31,-1,1,3],[36,-1,1,3]] } ] },
      { name: 'Mũ lưỡi trai', front: [
        { c: '#5c7cfa', r: [[11,-4,26,3],[9,-1,30,3],[30,1,14,2]] },
        { c: '#91a7ff', flat: true, r: [[14,-3,6,1],[23,-5,2,1]] },
        { c: '#3b5bdb', flat: true, r: [[9,1,21,1]] } ] },
      { name: 'Mũ nồi', front: [
        { c: '#c62828', r: [[11,-3,28,2],[8,-1,33,3],[23,-5,2,2]] },
        { c: '#ef5350', flat: true, r: [[13,-2,8,1]] } ] },
      { name: 'Vương miện', front: [
        { c: '#ffd54f', r: [[16,-4,16,3],[16,-6,2,2],[23,-7,2,3],[30,-6,2,2]] },
        { c: '#e91e63', flat: true, r: [[23,-3,2,1]] },
        { c: '#4dd0e1', flat: true, r: [[18,-3,1,1],[29,-3,1,1]] } ] },
      { name: 'Tai mèo', front: [
        { c: '#f8bbd0', r: [[9,-4,6,5],[33,-4,6,5],[10,-6,4,2],[34,-6,4,2]] },
        { c: '#ec6f9c', flat: true, r: [[11,-4,2,4],[35,-4,2,4]] } ] },
    ]},
    { id: 'acc', label: 'Phụ kiện', items: [
      null,
      { name: 'Nơ đỏ', front: [
        { c: '#ef5350', r: [[27,-3,4,4],[34,-3,4,4],[31,-2,3,2]] },
        { c: '#ff8a80', flat: true, r: [[28,-2,1,1],[35,-2,1,1]] } ] },
      { name: 'Kính tròn', front: [
        { c: OUTLINE, flat: true, r: [
          [12,16,10,1],[12,22,10,1],[11,17,1,5],[22,17,1,5],
          [26,16,10,1],[26,22,10,1],[25,17,1,5],[36,17,1,5],[23,18,2,1]] },
        { c: '#ffffff', flat: true, r: [[13,17,2,1],[27,17,2,1]] } ] },
      { name: 'Khăn quàng', under: true, front: [
        { c: '#ef9a9a', r: [[17,30,14,3],[26,33,3,5]] },
        { c: '#e57373', flat: true, r: [[19,31,1,1],[23,31,1,1],[27,31,1,1],[26,36,3,1]] } ] },
      { name: 'Vòng cổ', under: true, front: [
        { c: '#ffd54f', flat: true, r: [[19,31,10,1],[20,32,1,1],[27,32,1,1],[21,33,6,1]] },
        { c: '#e91e63', r: [[23,34,2,2]] } ] },
      { name: 'Túi xách', front: [
        { c: '#8d6e63', flat: true, r: [[11,33,1,5],[16,33,1,5],[12,32,4,1]] },
        { c: '#ff8a65', r: [[9,38,10,6]] },
        { c: '#ffccbc', flat: true, r: [[13,40,2,1]] } ] },
    ]},
  ];

  // Thứ tự lớp vẽ (từ dưới lên). Phụ kiện có `under: true` nằm dưới tóc.
  const drawOrder = (acc) => acc?.under
    ? ['shoes', 'bottom', 'top', 'acc', 'hair', 'hat']
    : ['shoes', 'bottom', 'top', 'hair', 'hat', 'acc'];

  // ---------- render ----------
  const rectsSvg = (parts) => {
    let out = '';
    for (const p of parts) if (!p.flat)
      for (const [x, y, w, h] of p.r)
        out += `<rect x="${x-1}" y="${y-1}" width="${w+2}" height="${h+2}" fill="${OUTLINE}"/>`;
    for (const p of parts)
      for (const [x, y, w, h] of p.r)
        out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p.c}"/>`;
    return out;
  };
  const grid = (inner) =>
    `<g transform="translate(${OX} ${OY}) scale(${CELL})">${inner}</g>`;

  const state = {};

  const item = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat.items[state[catId] || 0];
  };

  const doll = document.getElementById('doll');
  // Mẫu ảnh PNG: ảnh vẽ trên canvas cùng cỡ ảnh nhân vật nên đặt chồng thẳng lên.
  // `place` (tuỳ chọn): ảnh không cùng cỡ nhân vật -> cắt vùng `crop` của ảnh gốc
  // rồi đặt vào vùng `to` trên ảnh nhân vật.
  const imgSvg = (src, place) => {
    if (!src) return '';
    const img = (w, h) =>
      `<image href="${src}" x="0" y="0" width="${w}" height="${h}" style="image-rendering:pixelated"/>`;
    if (!place) return img(IMG_W, IMG_H);
    const [tx, ty, tw, th] = place.to;
    return `<svg x="${tx}" y="${ty}" width="${tw}" height="${th}" viewBox="${place.crop.join(' ')}"
      preserveAspectRatio="none" overflow="hidden">${img(place.size[0], place.size[1])}</svg>`;
  };
  const layerSvg = (it, side) => {
    const p = look.pose;
    if (it.img) {
      const own = it.poseImg?.[p];                     // ảnh riêng cho dáng này (<tên>_dang2.png)
      if (own && side === 'front') return imgSvg(own, it.ownPlace?.[p]);
      const svg = imgSvg(side === 'back' ? it.backImg : it.img, it.place);
      return own ? svg : legFit(it, svg);
    }
    return it[side] ? legFit(it, grid(rectsSvg(it[side]))) : '';
  };

  // Đồ vẽ cho dáng 1 -> tự dịch phần ống chân cho vừa dáng khác.
  // Từ hàng LEG_ROW trở xuống: nửa trái dịch `l` ô, nửa phải dịch `r` ô.
  const LEG_ROW = 43, LEG_MID = 23.5;
  function legFit(it, svg) {
    const shift = POSES[look.pose].legShift;
    if (!shift || !svg || !LEG_CATS.has(it.cat)) return svg;
    const Y = OY + LEG_ROW * CELL, X = OX + LEG_MID * CELL;
    const clip = (id, x, y, w, h) =>
      `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
    return `<defs>${clip('lf-t', -1e4, -1e4, 2e4, Y + 1e4)}${clip('lf-l', -1e4, Y, X + 1e4, 1e4)}${clip('lf-r', X, Y, 1e4, 1e4)}</defs>
      <g clip-path="url(#lf-t)">${svg}</g>
      <g transform="translate(${shift[0] * CELL} 0)"><g clip-path="url(#lf-l)">${svg}</g></g>
      <g transform="translate(${shift[1] * CELL} 0)"><g clip-path="url(#lf-r)">${svg}</g></g>`;
  }
  const LEG_CATS = new Set(['bottom', 'shoes']);

  function renderDoll() {
    let back = '', front = '';
    for (const cat of CATEGORIES) {
      const it = item(cat.id);
      if (it) back += layerSvg(it, 'back');
    }
    for (const id of drawOrder(item('acc'))) {
      const it = item(id);
      if (it) front += layerSvg(it, 'front');
    }
    doll.innerHTML = back + imgSvg(charSrc) + front;
  }

  // ======================================================================
  //  MÀU DA / MÀU MẮT: tô lại ảnh nhân vật bằng canvas.
  //  - Da: điểm ảnh sáng (da) + bóng tím nhạt, giữ độ sáng/tối gốc.
  //  - Mắt: điểm đỏ/cam/vàng trong 2 vùng mắt -> xoay màu (hue).
  //  - Viền da: điểm tím (2 tông đậm/nhạt) bao quanh da -> đổi màu, giữ tông đậm/nhạt.
  //  Má hồng, lông mày, đốm sáng trong mắt giữ nguyên.
  // ======================================================================
  // Giá trị -1 = màu người chơi tự chọn bằng bảng màu (lưu ở look.custom).
  const SKINS = [
    { name: 'Mặc định', c: null, show: '#fdecef' },
    { name: 'Trắng sứ', c: '#fff4ea' },
    { name: 'Bánh mật', c: '#f1c08f' },
    { name: 'Ngăm', c: '#d69a6c' },
    { name: 'Nâu sẫm', c: '#6e4430' },
  ];
  const EYES = [
    { name: 'Đỏ', rot: 0, show: '#f03030' },
    { name: 'Xanh dương', rot: 215, show: '#3a7bf0' },
    { name: 'Xanh lá', rot: 125, show: '#2fbf55' },
    { name: 'Tím', rot: 275, show: '#9b4df0' },
    { name: 'Nâu', rot: 15, spread: 0.4, sat: 0.55, lig: 0.75, show: '#8a5030' },
  ];
  // Viền da. auto: lấy màu da hiện tại làm tối đi.
  const LINES = [
    { name: 'Mặc định', c: null, show: '#761b8c' },
    { name: 'Theo da', auto: true },
    { name: 'Đen', c: '#1c1418' },
    { name: 'Nâu', c: '#5a3020' },
  ];
  const LOOK_LISTS = { skin: SKINS, line: LINES, eye: EYES };
  const CUSTOM_DEF = { skin: '#f1c08f', line: '#1c1418', eye: '#3a7bf0' };
  // Lựa chọn hiện tại của 1 phần (kể cả màu tự chọn)
  function lookOpt(part) {
    if (look[part] !== -1) return LOOK_LISTS[part][look[part]];
    const c = look.custom[part];
    if (part !== 'eye') return { name: 'Tự chọn', c };
    const [h, s, l] = rgb2hsl(...hex2rgb(c));       // mắt: xoay màu theo màu chọn
    return { name: 'Tự chọn', c, rot: h, spread: 0.4, sat: s / 0.9, lig: l / 0.42 };
  }
  const lineColor = (o) => {
    if (!o.auto) return o.c;
    const sk = lookOpt('skin'), [h, s, l] = rgb2hsl(...hex2rgb(sk.c || sk.show));
    const [r, g, b] = hsl2rgb(h, Math.max(0.45, s * 0.8), Math.min(0.3, l * 0.32));
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  };
  // Dáng nhân vật. legShift: [trái, phải] số ô dịch ống chân của đồ vẽ cho dáng 1.
  // Dáng 2 tạo bằng tools/make_pose2.py từ dáng bên phải của assets/character_2.png.
  const POSES = [
    { name: 'Dáng 1', src: 'assets/character.png' },
    { name: 'Dáng 2', src: 'assets/character_pose2.png', legShift: [1, -2] },
  ];
  const look = { pose: 0, skin: 0, eye: 0, line: 0, custom: {} };
  try { Object.assign(look, JSON.parse(localStorage.getItem('thoitrang.look') || '{}')); } catch {}
  if (!POSES[look.pose]) look.pose = 0;
  look.custom = { ...CUSTOM_DEF, ...look.custom };
  for (const part in LOOK_LISTS) {
    const ok = look[part] === -1 ? /^#[0-9a-f]{6}$/i.test(look.custom[part]) : LOOK_LISTS[part][look[part]];
    if (!ok) look[part] = 0;
  }
  const baseSrc = () => POSES[look.pose].src;
  let charSrc = baseSrc();
  const lookBases = {};         // theo từng dáng: dữ liệu ảnh gốc + danh sách điểm da/mắt
  let lookError = false;        // không đọc được điểm ảnh (mở bằng file://)
  const lookCache = {};

  const rgb2hsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  };
  const hsl2rgb = (h, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  };
  const hex2rgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

  function loadLookBase(src) {
    if (lookBases[src] || lookError) return Promise.resolve(lookBases[src] || null);
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        try {
          const cv = document.createElement('canvas');
          cv.width = IMG_W; cv.height = IMG_H;
          const ctx = cv.getContext('2d');
          ctx.drawImage(im, 0, 0);
          const img = ctx.getImageData(0, 0, IMG_W, IMG_H);   // file:// sẽ lỗi ở đây
          const d = img.data, skin = [], skinF = [], eye = [], eyeHSL = [], line = [], lineL = [];
          const LB = 241.4;                                  // độ sáng màu da gốc (253,236,239)
          for (let i = 0; i < d.length; i += 4) {
            if (!d[i + 3]) continue;
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const [h, s, l] = rgb2hsl(r, g, b);
            const p = i >> 2, x = p % IMG_W, y = (p / IMG_W) | 0;
            const inEye = y >= 545 && y <= 700 && ((x >= 285 && x <= 470) || (x >= 575 && x <= 765));
            if (inEye && s > 0.45 && l > 0.08 && l < 0.9 && ((h >= 330 && l < 0.5) || h >= 350 || h < 65)) {
              eye.push(i); eyeHSL.push(h, s, l); continue;
            }
            if (inEye && Math.min(r, g, b) > 245) continue;    // đốm sáng trong mắt
            if (l > 0.82 || (l > 0.44 && h >= 270 && h <= 325)) {
              skin.push(i); skinF.push((0.299 * r + 0.587 * g + 0.114 * b) / LB); continue;
            }
            const inBrow = y >= 470 && y <= 540 && x >= 340 && x <= 710;   // lông mày
            if (!inEye && !inBrow && s > 0.3 && l >= 0.13 && l <= 0.44 && h >= 265 && h <= 320) {
              line.push(i); lineL.push(l);                    // viền tím quanh da
            }
          }
          lookBases[src] = { ctx, cv, img, orig: new Uint8ClampedArray(d), skin, skinF, eye, eyeHSL, line, lineL };
        } catch { lookError = true; }
        res(lookBases[src] || null);
      };
      im.onerror = () => { lookError = true; res(null); };
      // Mở thẳng file:// thì đọc ảnh từ assets/character.js (data URL) để không bị chặn
      const data = location.protocol === 'file:' && window.CHARACTER_DATA;
      im.src = (data && (typeof data === 'string' ? data : data[src])) || src;
    });
  }

  async function applyLook() {
    const src = baseSrc();
    const sk = lookOpt('skin'), ey = lookOpt('eye'), lc = lineColor(lookOpt('line'));
    const key = `${look.pose}|${sk.c}|${look.eye === -1 ? ey.c : look.eye}|${lc}`;
    if (!sk.c && !look.eye && !lc) { charSrc = src; return; }
    if (lookCache[key]) { charSrc = lookCache[key]; return; }
    const B = await loadLookBase(src);
    if (!B) { charSrc = src; return; }
    const d = B.img.data;
    d.set(B.orig);
    if (sk.c) {
      const [tr, tg, tb] = hex2rgb(sk.c), top = 255 / 241.4 - 1;
      B.skin.forEach((i, n) => {
        const f = B.skinF[n];
        if (f <= 1) { d[i] = tr * f; d[i + 1] = tg * f; d[i + 2] = tb * f; }
        else {
          const k = Math.min(1, (f - 1) / top);            // vùng bóng sáng -> pha trắng
          d[i] = tr + (255 - tr) * k; d[i + 1] = tg + (255 - tg) * k; d[i + 2] = tb + (255 - tb) * k;
        }
      });
    }
    if (ey.rot || ey.sat || ey.lig) {
      B.eye.forEach((i, n) => {
        const h = B.eyeHSL[n * 3], s = B.eyeHSL[n * 3 + 1], l = B.eyeHSL[n * 3 + 2];
        const hr = h > 180 ? h - 360 : h;          // đỏ=0, vàng≈52
        const [r, g, b] = hsl2rgb((ey.rot + hr * (ey.spread ?? 1) + 720) % 360, s * (ey.sat ?? 1), l * (ey.lig ?? 1));
        d[i] = r; d[i + 1] = g; d[i + 2] = b;
      });
    }
    if (lc) {
      const [th, ts, tl] = rgb2hsl(...hex2rgb(lc)), LREF = 0.24;   // LREF: độ sáng viền gốc (trung bình 2 tông)
      B.line.forEach((i, n) => {
        const [r, g, b] = hsl2rgb(th, ts, Math.min(0.92, B.lineL[n] / LREF * tl));
        d[i] = r; d[i + 1] = g; d[i + 2] = b;
      });
    }
    B.ctx.putImageData(B.img, 0, 0);
    const blob = await new Promise(r => B.cv.toBlob(r, 'image/png'));
    charSrc = lookCache[key] = URL.createObjectURL(blob);
    // màu tự chọn đổi liên tục -> chỉ giữ ảnh mới nhất, bỏ ảnh cũ
    if (look.skin === -1 || look.eye === -1 || look.line === -1) {
      if (lastCustomKey && lastCustomKey !== key) { URL.revokeObjectURL(lookCache[lastCustomKey]); delete lookCache[lastCustomKey]; }
      lastCustomKey = key;
    } else lastCustomKey = null;
  }
  let lastCustomKey = null;

  async function setLook(part, i) {
    look[part] = i;
    try { localStorage.setItem('thoitrang.look', JSON.stringify(look)); } catch {}
    renderWardrobe();
    await applyLook();
    renderDoll();
    if (lookError) renderWardrobe();
  }

  // Kéo trong bảng màu: cập nhật nhân vật ngay, không vẽ lại danh sách (để bảng màu không bị đóng).
  let pickBusy = false, pickNext = false;
  async function pickColor(part, color) {
    look[part] = -1; look.custom[part] = color;
    const wrap = wardrobe.querySelector(`.swatches[data-part="${part}"]`);
    wrap?.querySelectorAll('.swatch').forEach(b => b.classList.toggle('selected', b.classList.contains('picker')));
    if (pickBusy) { pickNext = true; return; }
    pickBusy = true;
    do { pickNext = false; await applyLook(); renderDoll(); } while (pickNext);
    pickBusy = false;
  }

  function previewSvg(it) {
    if (!it) return '<span class="none">✕</span>';
    if (it.img) {
      return `<svg viewBox="${it.box.join(' ')}" preserveAspectRatio="xMidYMid meet">${imgSvg(it.backImg, it.place)}${imgSvg(it.img, it.place)}</svg>`;
    }
    const parts = [...(it.back || []), ...(it.front || [])];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of parts) for (const [x, y, w, h] of p.r) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h);
    }
    const pad = 2;
    const vb = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2].join(' ');
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${rectsSvg(it.back || [])}${rectsSvg(it.front || [])}</svg>`;
  }

  // ---------- cột nút loại đồ + danh sách mẫu ----------
  const catbar = document.getElementById('catbar');
  const wardrobe = document.getElementById('wardrobe');
  let activeCat = CATEGORIES[0].id;

  const SHORT = { hair: 'Tóc', top: 'Áo', bottom: 'Váy', shoes: 'Giày', hat: 'Mũ', acc: 'P.kiện' };

  // icon pixel 8x8 cho nút hành động
  const ICON_RANDOM = `<svg viewBox="0 0 8 8"><rect x="0" y="0" width="8" height="8" fill="${OUTLINE}"/>
    <rect x="1" y="1" width="6" height="6" fill="#fff"/>
    <rect x="2" y="2" width="1" height="1" fill="${OUTLINE}"/><rect x="5" y="2" width="1" height="1" fill="${OUTLINE}"/>
    <rect x="3.5" y="3.5" width="1" height="1" fill="${OUTLINE}"/>
    <rect x="2" y="5" width="1" height="1" fill="${OUTLINE}"/><rect x="5" y="5" width="1" height="1" fill="${OUTLINE}"/></svg>`;
  const ICON_RESET = `<svg viewBox="0 0 8 8" fill="${OUTLINE}">
    <rect x="1" y="1" width="2" height="1"/><rect x="5" y="1" width="2" height="1"/>
    <rect x="2" y="2" width="2" height="1"/><rect x="4" y="2" width="2" height="1"/>
    <rect x="3" y="3" width="2" height="2"/>
    <rect x="2" y="5" width="2" height="1"/><rect x="4" y="5" width="2" height="1"/>
    <rect x="1" y="6" width="2" height="1"/><rect x="5" y="6" width="2" height="1"/></svg>`;

  // icon khuôn mặt (pixel 8x8) cho nút Da/Mắt
  const ICON_LOOK = `<svg viewBox="0 0 8 8"><rect x="1" y="0" width="6" height="8" fill="${OUTLINE}"/>
    <rect x="0" y="1" width="8" height="6" fill="${OUTLINE}"/>
    <rect x="1" y="1" width="6" height="6" fill="#f1c08f"/>
    <rect x="2" y="3" width="1" height="2" fill="#3a7bf0"/><rect x="5" y="3" width="1" height="2" fill="#3a7bf0"/>
    <rect x="1" y="5" width="1" height="1" fill="#f48fb1"/><rect x="6" y="5" width="1" height="1" fill="#f48fb1"/></svg>`;

  // icon dáng đứng (pixel 8x8)
  const ICON_POSE = `<svg viewBox="0 0 8 8" fill="${OUTLINE}">
    <rect x="3" y="0" width="2" height="2"/><rect x="1" y="2" width="6" height="1"/>
    <rect x="2" y="3" width="4" height="2"/><rect x="2" y="5" width="1" height="3"/>
    <rect x="5" y="5" width="1" height="3"/></svg>`;

  // tim độ hiếm (pixel 7x6)
  const HEART = (on) => `<svg viewBox="0 0 7 6"><path fill="${on ? '#e9447f' : '#f6d3e2'}"
    d="M1 0h2v1h1v-1h2v1h1v2h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-2h1z"/></svg>`;
  const stars = (it, i) => it.stars ?? Math.min(5, 1 + ((i * 3) % 5));

  const actions = document.getElementById('stage-actions');

  // Dựng lại nút + danh sách (gọi lại được khi có ảnh mới)
  function buildWardrobe() {
    catbar.innerHTML = CATEGORIES.map(cat => `
        <button class="px-btn cat-btn" data-tab="${cat.id}" title="${cat.label}">
          <span class="ico">${previewSvg(cat.items.find(Boolean))}</span>
          <span class="lbl">${SHORT[cat.id] || cat.label}</span>
        </button>`).join('') + `
        <button class="px-btn cat-btn" data-tab="pose" title="Dáng">
          <span class="ico">${ICON_POSE}</span>
          <span class="lbl">Dáng</span>
        </button>
        <button class="px-btn cat-btn" data-tab="look" title="Màu da & mắt">
          <span class="ico">${ICON_LOOK}</span>
          <span class="lbl">Da/Mắt</span>
        </button>`;

    actions.innerHTML = `
        <button class="px-btn cat-btn" id="btn-random" title="Ngẫu nhiên">
          <span class="ico">${ICON_RANDOM}</span><span class="lbl">Ngẫu<br>nhiên</span>
        </button>
        <button class="px-btn cat-btn" id="btn-reset" title="Xóa đồ">
          <span class="ico">${ICON_RESET}</span><span class="lbl">Xóa</span>
        </button>`;

    wardrobe.innerHTML = `
      <div class="cat-title"></div>
      <div class="items" role="listbox"></div>`;
  }

  // Sự kiện gắn 1 lần (uỷ quyền), không bị trùng khi dựng lại
  actions.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    for (const c of CATEGORIES)
      state[c.id] = btn.id === 'btn-random' ? Math.floor(Math.random() * c.items.length) : 0;
    update();
  });
  catbar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    activeCat = btn.dataset.tab;
    renderWardrobe(true);
  });
  wardrobe.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-look]');
    if (sw) { setLook(sw.dataset.look, Number(sw.dataset.v)); return; }
    const card = e.target.closest('[data-i]');
    if (!card) return;
    state[activeCat] = Number(card.dataset.i);
    update();
  });

  wardrobe.addEventListener('input', (e) => {
    const inp = e.target.closest('[data-pick]');
    if (inp) pickColor(inp.dataset.pick, inp.value);
  });
  wardrobe.addEventListener('change', (e) => {          // đóng bảng màu -> lưu + vẽ lại
    const inp = e.target.closest('[data-pick]');
    if (inp) setLook(inp.dataset.pick, -1);
  });

  const swatches = (part, list) => `
    <div class="swatches colors" data-part="${part}">${list.map((o, i) => `
      <button class="swatch${look[part] === i ? ' selected' : ''}" data-look="${part}" data-v="${i}" title="${o.name}" aria-label="${o.name}">
        <span class="dot" style="background:${o.auto ? lineColor(o) : o.c || o.show}"></span>
      </button>`).join('')}
      <label class="swatch picker${look[part] === -1 ? ' selected' : ''}" title="Bảng màu: tự chọn màu">
        <span class="dot rainbow"></span>
        <input type="color" data-pick="${part}" value="${look.custom[part]}" aria-label="Bảng màu">
      </label>
    </div>`;

  function renderWardrobe(resetScroll) {
    catbar.querySelectorAll('[data-tab]').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === activeCat));
    const list = wardrobe.querySelector('.items');

    if (activeCat === 'pose') {
      wardrobe.querySelector('.cat-title').textContent = 'Dáng';
      list.innerHTML = `<div class="swatches poses">${POSES.map((o, i) => `
        <button class="swatch${look.pose === i ? ' selected' : ''}" data-look="pose" data-v="${i}" title="${o.name}">
          <span class="pose-thumb"><svg viewBox="180 40 690 1340"><image href="${o.src}" width="${IMG_W}" height="${IMG_H}" style="image-rendering:pixelated"/></svg></span>
          <span class="card-name">${o.name}</span>
        </button>`).join('')}</div>`;
      if (resetScroll) list.scrollTop = 0;
      return;
    }

    if (activeCat === 'look') {
      wardrobe.querySelector('.cat-title').textContent = 'Da & Mắt';
      list.innerHTML = `
        ${lookError ? '<p class="look-note">Cần mở game bằng start.bat để đổi màu.</p>' : ''}
        <div class="look-sec">Màu da</div>${swatches('skin', SKINS)}
        <div class="look-sec">Viền da</div>${swatches('line', LINES)}
        <div class="look-sec">Màu mắt</div>${swatches('eye', EYES)}`;
      if (resetScroll) list.scrollTop = 0;
      return;
    }

    const cat = CATEGORIES.find(c => c.id === activeCat);
    wardrobe.querySelector('.cat-title').textContent = cat.label;

    const sel = state[cat.id] || 0;
    list.innerHTML = cat.items.map((it, i) => `
      <button class="card${i === sel ? ' selected' : ''}${it ? '' : ' none-card'}" data-i="${i}" role="option" aria-selected="${i === sel}">
        ${it ? `<span class="card-no">${i}</span>` : ''}
        <span class="card-thumb">${previewSvg(it)}</span>
        ${it ? `<span class="hearts">${[1,2,3,4,5].map(k => HEART(k <= stars(it, i))).join('')}</span>` : ''}
        <span class="card-name">${it ? it.name : 'Không mặc'}</span>
      </button>`).join('');
    if (resetScroll) list.scrollTop = 0;
  }

  function update() { renderDoll(); renderWardrobe(); saveKeys(); }

  // ---------- điều hướng ----------
  const titleScreen = document.getElementById('title-screen');
  const gameScreen = document.getElementById('game-screen');
  const show = (game) => { titleScreen.hidden = game; gameScreen.hidden = !game; };

  document.getElementById('btn-start').onclick = () => show(true);
  document.getElementById('btn-home').onclick = () => show(false);

  // ======================================================================
  //  TỰ NẠP ẢNH ĐỒ: bỏ ảnh vào assets/items/<loại>/ là tự hiện trong danh sách.
  //  - Tên hiển thị = tên file (bỏ đuôi, '-' '_' thành khoảng trắng).
  //  - File "<tên>_sau.png" = lớp sau lưng của "<tên>.png".
  //  - Ảnh tự căn theo cỡ:
  //      1047x1501 : vẽ trên ảnh nhân vật -> đặt chồng thẳng.
  //      1072x1228 : vẽ trên template của chara.png (ô ~16.12px) -> tự phóng & căn ô.
  //      cỡ khác   : co cho vừa ảnh nhân vật.
  //  - assets/items/items.js vẫn dùng được để ghi đè tên, số tim, vị trí...
  // ======================================================================
  const IMG_EXT = /\.(png|webp|gif|jpe?g)$/i;
  const BACK_SUFFIX = /[_-]sau$/i;
  const POSE_SUFFIX = /[_-]dang(\d+)$/i;           // "<tên>_dang2.png" = bản vẽ riêng cho dáng 2

  // Khung xem trước của từng loại (toạ độ trên ảnh nhân vật 1047x1501)
  const PREVIEW_BOX = {
    hair:   [80, 20, 890, 940],
    top:    [200, 740, 650, 500],
    bottom: [240, 960, 570, 360],
    shoes:  [320, 1060, 410, 310],
    hat:    [150, -40, 750, 520],
    acc:    [120, 0, 810, 1380],
  };
  // Vùng giữ lại khi ảnh vẽ trên template khác (bỏ phần thừa như quần/giày trong ảnh áo)
  const CLIP = {
    top:    [0, 560, IMG_W, 570],    // cổ -> hông
    bottom: [0, 1090, IMG_W, 125],   // hông -> gối
    shoes:  [0, 1200, IMG_W, 200],
  };
  const CLIP_ALL = [0, -200, IMG_W, IMG_H + 200];

  // Template đã biết: ảnh gốc (x,y) -> ảnh nhân vật (x*s + ox, y*s + oy)
  const TEMPLATES = [
    { w: 1047, h: 1501, s: 1, ox: 0, oy: 0, same: true },
    (() => { // chara.png: ô (0,0) của áo ở (357,673), khớp ô cột 13 hàng 28 của nhân vật
      const s = CELL / 16.12;
      return { w: 1072, h: 1228, s, ox: OX + CELL * 13 - 357 * s, oy: OY + CELL * 28 - 673 * s };
    })(),
  ];

  const loadSize = (src) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res([im.naturalWidth, im.naturalHeight]);
    im.onerror = () => res(null);
    im.src = src;
  });

  // Tính cách đặt ảnh lên nhân vật dựa vào cỡ ảnh
  function autoPlace(catId, w, h, tpl) {
    let t = tpl && tpl.w === w && tpl.h === h ? tpl : TEMPLATES.find(t => t.w === w && t.h === h);
    if (t?.same) return null;                       // đặt chồng thẳng
    if (!t) {                                       // cỡ lạ: co cho vừa
      const s = Math.min(IMG_W / w, IMG_H / h);
      t = { s, ox: (IMG_W - w * s) / 2, oy: (IMG_H - h * s) / 2 };
    }
    const [cx, cy, cw, ch] = CLIP[catId] || CLIP_ALL;
    return {
      size: [w, h],
      crop: [(cx - t.ox) / t.s, (cy - t.oy) / t.s, cw / t.s, ch / t.s],
      to: [cx, cy, cw, ch],
    };
  }

  const prettyName = (file) =>
    decodeURIComponent(file).replace(IMG_EXT, '').replace(/[-_]+/g, ' ').trim();

  // Mở thẳng file (file://) thì trình duyệt chặn đọc thư mục -> không quét,
  // chỉ dùng assets/items/list.js (server.js tự ghi) + items.js.
  const IS_FILE = location.protocol === 'file:';
  // Chỉ dò thư mục khi chạy trên máy mình (start.bat, Live Server...).
  // Trang đã đăng lên mạng (Vercel...) là web tĩnh: không có /api/items, không liệt kê thư mục
  // -> dùng thẳng list.js, không gửi request thừa (tránh lỗi 404 trong console).
  const IS_LOCAL = /^(localhost|127\.|\[?::1\]?$|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
  let listMode = IS_FILE || !IS_LOCAL ? 'static' : null;   // 'api' | 'dir' | 'static', dò 1 lần rồi nhớ

  // Lấy danh sách file trong từng thư mục loại đồ
  async function listItemFiles() {
    if (listMode === 'static') return window.ITEM_FILES || {};
    // 1) server.js của dự án: /api/items
    if (listMode !== 'dir') {
      try {
        const r = await fetch('api/items', { cache: 'no-store' });
        if (r.ok) { listMode = 'api'; return await r.json(); }
      } catch {}
      if (listMode === 'api') return null;               // server tạm lỗi: giữ danh sách cũ
    }
    // 2) server khác có trang liệt kê thư mục (Live Server, python -m http.server...)
    const out = {};
    for (const cat of CATEGORIES) {
      try {
        const r = await fetch(`assets/items/${cat.id}/`, { cache: 'no-store' });
        if (!r.ok) continue;
        const html = await r.text();
        out[cat.id] = [...html.matchAll(/href="([^"?#]+)"/g)]
          .map(m => decodeURIComponent(m[1].split('/').filter(Boolean).pop() || ''))
          .filter(f => IMG_EXT.test(f));
      } catch {}
    }
    if (Object.keys(out).length) { listMode = 'dir'; return out; }
    // 3) không đọc được thư mục -> dùng list.js, lần sau không dò nữa
    listMode = 'static';
    return window.ITEM_FILES || {};
  }

  for (const c of CATEGORIES) for (const it of c.items) if (it) it.cat = c.id;
  // Dáng bên phải của assets/character_2.png (1072x1228) -> ảnh nhân vật
  // (khớp với tools/make_pose2.py: dáng trái ở (138.98, -140.24), dáng phải lệch 504px, 2px)
  const POSE2_TEMPLATE = (() => {
    const s = CELL / 16.12;
    return { w: 1072, h: 1228, s, ox: 138.98 - 504 * s, oy: -140.24 - 2 * s };
  })();

  // Ảnh riêng cho từng dáng: "<tên>_dang2.png" -> { poseImg: {1: src}, ownPlace: {1: place} }
  // (số trong tên file tính từ 1, chỉ số dáng trong POSES tính từ 0)
  async function posePlace(catId, dir, files, base) {
    const poseImg = {}, ownPlace = {};
    for (const f of files) {
      const m = f.replace(IMG_EXT, '').match(POSE_SUFFIX);
      if (!m || f.replace(IMG_EXT, '').replace(POSE_SUFFIX, '') !== base) continue;
      const size = await loadSize(dir + f);
      if (!size) continue;
      poseImg[m[1] - 1] = dir + f;
      ownPlace[m[1] - 1] = autoPlace(catId, size[0], size[1], POSE2_TEMPLATE);
    }
    return { poseImg, ownPlace };
  }

  const BUILTIN = Object.fromEntries(CATEGORIES.map(c => [c.id, c.items.slice()]));
  let lastListing = '';

  async function loadUserItems() {
    const listing = await listItemFiles();
    if (!listing) return false;
    const manifest = window.ITEM_IMAGES || {};
    const key = JSON.stringify(listing) + JSON.stringify(manifest);
    if (key === lastListing) return false;
    lastListing = key;

    for (const cat of CATEGORIES) {
      const dir = `assets/items/${cat.id}/`;
      const files = [...new Set(listing[cat.id] || [])].sort((a, b) => a.localeCompare(b, 'vi'));
      const extra = Object.fromEntries((manifest[cat.id] || []).filter(e => e?.file).map(e => [e.file, e]));
      // ảnh chỉ khai báo trong items.js (khi không có server) vẫn được dùng
      for (const f of Object.keys(extra)) if (!files.includes(f)) files.push(f);

      const fronts = files.filter(f => !BACK_SUFFIX.test(f.replace(IMG_EXT, '')) && !POSE_SUFFIX.test(f.replace(IMG_EXT, '')));
      const items = await Promise.all(fronts.map(async (file) => {
        const e = extra[file] || {};
        const base = file.replace(IMG_EXT, '');
        const backFile = e.back || files.find(f => f.replace(IMG_EXT, '').replace(BACK_SUFFIX, '') === base && f !== file);
        const size = e.size || await loadSize(dir + file);
        if (!size) return null;
        const place = e.crop && e.to ? { crop: e.crop, to: e.to, size } : autoPlace(cat.id, size[0], size[1]);
        return {
          key: dir + file,
          name: e.name || prettyName(file),
          stars: e.stars,
          under: e.under,
          img: dir + file,
          backImg: backFile ? dir + backFile : null,
          place,
          cat: cat.id,
          ...await posePlace(cat.id, dir, files, base),
          box: e.box || PREVIEW_BOX[cat.id],
        };
      }));
      cat.items = [...BUILTIN[cat.id], ...items.filter(Boolean)];
    }
    return true;
  }

  // Lưu bộ đồ theo khoá (tên/đường dẫn ảnh) để thêm ảnh mới không làm lệch
  const keyOf = (it) => it ? (it.key || it.name) : null;
  const saveKeys = () => {
    try {
      const o = {};
      for (const c of CATEGORIES) o[c.id] = keyOf(c.items[state[c.id] || 0]);
      localStorage.setItem('thoitrang.outfit2', JSON.stringify(o));
    } catch {}
  };
  const restoreKeys = (o) => {
    for (const c of CATEGORIES) {
      const i = c.items.findIndex(it => keyOf(it) === o[c.id]);
      state[c.id] = i > 0 ? i : 0;
    }
  };
  let savedKeys = {};
  try { savedKeys = JSON.parse(localStorage.getItem('thoitrang.outfit2') || '{}'); } catch {}

  function showFileHint() {
    const el = document.createElement('div');
    el.className = 'file-hint';
    el.innerHTML = 'Đang mở thẳng file: ảnh mới bỏ vào thư mục sẽ không tự hiện.<br>Hãy mở game bằng <b>start.bat</b>.';
    el.onclick = () => el.remove();
    document.querySelector('.laptop').appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  (async () => {
    await loadUserItems();
    await applyLook();
    restoreKeys(savedKeys);
    buildWardrobe();
    update();
    if (location.hash === '#game') show(true);

    if (IS_FILE) { showFileHint(); return; }
    if (listMode === 'static') return;      // web tĩnh: không có gì để theo dõi

    // Tự cập nhật khi thêm/xoá ảnh trong thư mục (chỉ khi chạy qua server)
    const timer = setInterval(async () => {
      if (listMode === 'static') return clearInterval(timer);
      const current = {};
      for (const c of CATEGORIES) current[c.id] = keyOf(c.items[state[c.id] || 0]);
      if (await loadUserItems()) {
        restoreKeys(current);
        buildWardrobe();
        update();
      }
    }, 2000);
  })();
})();
