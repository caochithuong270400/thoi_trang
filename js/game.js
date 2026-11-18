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
  const OUTLINE = '#5b1a4e';

  // part: { c: màu, r: [[x,y,w,h], ...], flat: true = không viền }
  // item: { name, back: [parts] (vẽ sau lưng nhân vật), front: [parts] }
  const torso = [[17,32,14,1],[16,33,16,2],[15,35,18,3],[16,38,16,4]];

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
  const load = () => {
    try { return JSON.parse(localStorage.getItem('thoitrang.outfit') || '{}'); } catch { return {}; }
  };
  const save = () => {
    try { localStorage.setItem('thoitrang.outfit', JSON.stringify(state)); } catch {}
  };

  const item = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat.items[state[catId] || 0];
  };

  const doll = document.getElementById('doll');
  function renderDoll() {
    let back = '', front = '';
    for (const cat of CATEGORIES) {
      const it = item(cat.id);
      if (it?.back) back += rectsSvg(it.back);
    }
    for (const id of drawOrder(item('acc'))) {
      const it = item(id);
      if (it?.front) front += rectsSvg(it.front);
    }
    doll.innerHTML =
      grid(back) +
      `<image href="assets/character.png" x="0" y="0" width="1047" height="1501" style="image-rendering:pixelated"/>` +
      grid(front);
  }

  function previewSvg(it) {
    if (!it) return '<span class="none">✕</span>';
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

  function buildWardrobe() {
    catbar.innerHTML = CATEGORIES.map(cat => `
        <button class="px-btn cat-btn" data-tab="${cat.id}" title="${cat.label}">
          <span class="ico">${previewSvg(cat.items.find(Boolean))}</span>
          <span class="lbl">${SHORT[cat.id] || cat.label}</span>
        </button>`).join('');

    const actions = document.getElementById('stage-actions');
    actions.innerHTML = `
        <button class="px-btn cat-btn" id="btn-random" title="Ngẫu nhiên">
          <span class="ico">${ICON_RANDOM}</span><span class="lbl">Ngẫu<br>nhiên</span>
        </button>
        <button class="px-btn cat-btn" id="btn-reset" title="Xóa đồ">
          <span class="ico">${ICON_RESET}</span><span class="lbl">Xóa</span>
        </button>`;
    actions.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      for (const c of CATEGORIES)
        state[c.id] = btn.id === 'btn-random' ? Math.floor(Math.random() * c.items.length) : 0;
      update();
    });

    wardrobe.innerHTML = `
      <div class="cat-title"></div>
      <div class="items" role="listbox"></div>`;

    catbar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      activeCat = btn.dataset.tab;
      renderWardrobe(true);
    });
    wardrobe.querySelector('.items').addEventListener('click', (e) => {
      const card = e.target.closest('[data-i]');
      if (!card) return;
      state[activeCat] = Number(card.dataset.i);
      update();
    });
  }

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

  function update() { renderDoll(); renderWardrobe(); save(); }

  // ---------- điều hướng ----------
  const titleScreen = document.getElementById('title-screen');
  const gameScreen = document.getElementById('game-screen');
  const show = (game) => { titleScreen.hidden = game; gameScreen.hidden = !game; };

  document.getElementById('btn-start').onclick = () => show(true);
  document.getElementById('btn-home').onclick = () => show(false);

  Object.assign(state, load());
  for (const c of CATEGORIES) {
    if (!(state[c.id] >= 0 && state[c.id] < c.items.length)) state[c.id] = 0;
  }
  buildWardrobe();
  update();
  if (location.hash === '#game') show(true);
})();
