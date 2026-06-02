const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^().,;:-_+=[]{}|<>?~`";

const canvas = document.getElementById("bgCanvas");

const CHAR_W = 22;
const CHAR_H = 36;

let rows = [];
let last = null;
let resizeTimer = null;

function rndChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function rndOpacity() {
  return (0.02 + Math.random() * 0.11).toFixed(3);
}

function buildRows() {
  canvas.innerHTML = "";
  rows = [];

  const cw = canvas.offsetWidth;
  const ch = canvas.offsetHeight;

  // controlled density scaling
  const density =
    window.innerWidth > 1800 ? 1.4 : window.innerWidth > 1400 ? 1.2 : 1;

  // overscan fixes rotated corner gaps
  const colCount = Math.ceil(cw / (CHAR_W * density)) + 12;

  const rowCount = Math.ceil(ch / (CHAR_H * density)) + 12;

  for (let r = 0; r < rowCount; r++) {
    const el = document.createElement("div");
    el.className = "bg-row";

    const spans = [];

    for (let c = 0; c < colCount; c++) {
      const span = document.createElement("span");
      span.textContent = rndChar();
      span.style.opacity = rndOpacity();

      el.appendChild(span);
      spans.push(span);
    }

    const y = r * CHAR_H;
    el.style.top = y + "px";

    const speed = 15 + (r % 7) * 8 + Math.random() * 12;

    canvas.appendChild(el);

    rows.push({
      el,
      spans,
      x: 0,
      speed,
    });
  }
}

function animate(ts) {
  if (!last) last = ts;

  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;

  for (const row of rows) {
    row.x += row.speed * dt;

    if (row.x >= CHAR_W) {
      row.x -= CHAR_W;

      for (let i = 0; i < row.spans.length; i++) {
        row.spans[i].textContent = rndChar();
        row.spans[i].style.opacity = rndOpacity();
      }
    }

    row.el.style.transform = `translate3d(${row.x}px,0,0)`;
  }

  requestAnimationFrame(animate);
}

function mutate() {
  if (!rows.length) return;

  const row = rows[Math.floor(Math.random() * rows.length)];

  const idx = Math.floor(Math.random() * row.spans.length);

  const span = row.spans[idx];

  if (span) {
    span.textContent = rndChar();
    span.style.opacity = rndOpacity();
  }
}

buildRows();
requestAnimationFrame(animate);

// lower mutation cost
setInterval(mutate, 1200);

// debounced resize
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    last = null;
    buildRows();
  }, 150);
});
