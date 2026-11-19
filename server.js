// Server tĩnh nhỏ cho game (không cần cài gì thêm, chỉ cần Node).
// Chạy:  node server.js   rồi mở http://localhost:5173
// Thêm /api/items: trả danh sách ảnh trong assets/items/<loại>/ để game tự hiện đồ mới.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5173;
const ITEMS_DIR = path.join(ROOT, 'assets', 'items');
const IMG_EXT = /\.(png|webp|gif|jpe?g)$/i;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8',
};

function listItems() {
  const out = {};
  for (const d of fs.readdirSync(ITEMS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    out[d.name] = fs.readdirSync(path.join(ITEMS_DIR, d.name)).filter(f => IMG_EXT.test(f));
  }
  return out;
}

// Ghi assets/items/list.js để cả khi mở thẳng index.html (file://) game vẫn biết có ảnh gì
const LIST_FILE = path.join(ITEMS_DIR, 'list.js');
function writeList() {
  const body = '// TỰ ĐỘNG TẠO bởi server.js — đừng sửa tay.\n' +
    'window.ITEM_FILES = ' + JSON.stringify(listItems(), null, 2) + ';\n';
  try {
    if (!fs.existsSync(LIST_FILE) || fs.readFileSync(LIST_FILE, 'utf8') !== body) fs.writeFileSync(LIST_FILE, body);
  } catch (e) { console.error('Không ghi được list.js:', e.message); }
}
writeList();

// Ghi assets/character.js (ảnh nhân vật các dáng dạng base64) để đổi màu da/mắt chạy được cả khi mở file://
// (trình duyệt chặn đọc điểm ảnh của file PNG mở thẳng, nhưng không chặn data URL).
const CHAR_PNGS = ['assets/character.png', 'assets/character_pose2.png'];
const CHAR_JS = path.join(ROOT, 'assets', 'character.js');
function writeCharacter() {
  try {
    const data = {};
    for (const f of CHAR_PNGS) {
      const file = path.join(ROOT, f);
      if (fs.existsSync(file)) data[f] = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    }
    const body = '// TỰ ĐỘNG TẠO bởi server.js từ ảnh nhân vật — đừng sửa tay.\n' +
      'window.CHARACTER_DATA = ' + JSON.stringify(data) + ';\n';
    if (!fs.existsSync(CHAR_JS) || fs.readFileSync(CHAR_JS, 'utf8') !== body) fs.writeFileSync(CHAR_JS, body);
  } catch (e) { console.error('Không ghi được character.js:', e.message); }
}
writeCharacter();
for (const f of CHAR_PNGS) {
  try { fs.watchFile(path.join(ROOT, f), { interval: 2000 }, writeCharacter); } catch {}
}
let timer;
try {
  fs.watch(ITEMS_DIR, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(writeList, 300); });
} catch { setInterval(writeList, 2000); }

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  if (url === '/api/items') {
    res.writeHead(200, { 'Content-Type': TYPES['.json'], 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(listItems()));
  }

  let file = path.normalize(path.join(ROOT, url === '/' ? 'index.html' : url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }   // chặn ../
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err2, data) => {
      if (err2) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Game đang chạy: http://localhost:${PORT}`);
  console.log('Bỏ ảnh vào assets/items/<loại>/ là tự hiện trong game. Nhấn Ctrl+C để tắt.');
});
