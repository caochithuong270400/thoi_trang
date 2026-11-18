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
  const layerSvg = (it, side) => it.img
    ? imgSvg(side === 'back' ? it.backImg : it.img, it.place)
    : (it[side] ? grid(rectsSvg(it[side])) : '');

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
    doll.innerHTML = back + imgSvg('assets/character.png') + front;
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
        </button>`).join('');

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
    const card = e.target.closest('[data-i]');
    if (!card) return;
    state[activeCat] = Number(card.dataset.i);
    update();
  });

  function renderWardrobe(resetScroll) {
    const cat = CATEGORIES.find(c => c.id === activeCat);
    catbar.querySelectorAll('[data-tab]').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === activeCat));
    wardrobe.querySelector('.cat-title').textContent = cat.label;

    const list = wardrobe.querySelector('.items');
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
  function autoPlace(catId, w, h) {
    let t = TEMPLATES.find(t => t.w === w && t.h === h);
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

  // Lấy danh sách file trong từng thư mục loại đồ
  async function listItemFiles() {
    if (IS_FILE) return window.ITEM_FILES || {};
    // 1) server.js của dự án: /api/items
    try {
      const r = await fetch('api/items', { cache: 'no-store' });
      if (r.ok) return await r.json();
    } catch {}
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
    // 3) không đọc được thư mục -> dùng list.js
    return Object.keys(out).length ? out : (window.ITEM_FILES || {});
  }

  const BUILTIN = Object.fromEntries(CATEGORIES.map(c => [c.id, c.items.slice()]));
  let lastListing = '';

  async function loadUserItems() {
    const listing = await listItemFiles();
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

      const fronts = files.filter(f => !BACK_SUFFIX.test(f.replace(IMG_EXT, '')));
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
    restoreKeys(savedKeys);
    buildWardrobe();
    update();
    if (location.hash === '#game') show(true);

    if (IS_FILE) { showFileHint(); return; }

    // Tự cập nhật khi thêm/xoá ảnh trong thư mục (chỉ khi chạy qua server)
    setInterval(async () => {
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
