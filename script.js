const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const header = document.querySelector('.header-shell');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const progress = document.querySelector('.scroll-progress');

window.addEventListener('load', () => document.body.classList.add('loaded'), { once: true });
setTimeout(() => document.body.classList.add('loaded'), 900);
document.getElementById('year').textContent = new Date().getFullYear();

function setMenu(open) {
  menuButton.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal-mask').forEach((element) => revealObserver.observe(element));

let scrollTicking = false;
function updateScrollEffects() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--progress', `${max > 0 ? (y / max) * 100 : 0}%`);
  header.classList.toggle('scrolled', y > 30);
  if (!reduceMotion) {
    document.querySelectorAll('.title-row').forEach((row, index) => {
      row.style.transform = `translate3d(${(index % 2 ? 1 : -1) * Math.min(y * (0.025 + index * 0.008), 38)}px, ${Math.min(y * 0.018 * index, 26)}px, 0)`;
    });
  }
  scrollTicking = false;
}
window.addEventListener('scroll', () => { if (!scrollTicking) { requestAnimationFrame(updateScrollEffects); scrollTicking = true; } }, { passive: true });
updateScrollEffects();

if (finePointer && !reduceMotion) {
  document.body.classList.add('has-pointer');
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2, cursorX = mouseX, cursorY = mouseY;
  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
  }, { passive: true });
  function moveCursor() {
    cursorX += (mouseX - cursorX) * 0.14; cursorY += (mouseY - cursorY) * 0.14;
    cursor.style.left = `${cursorX}px`; cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(moveCursor);
  }
  moveCursor();
  document.querySelectorAll('a, button, [data-cursor]').forEach((element) => {
    element.addEventListener('pointerenter', () => { document.body.classList.add('cursor-active'); cursor.querySelector('span').textContent = element.dataset.cursor || 'GO'; });
    element.addEventListener('pointerleave', () => { document.body.classList.remove('cursor-active'); cursor.querySelector('span').textContent = 'OPEN'; });
  });

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .14}px, ${(event.clientY - rect.top - rect.height / 2) * .14}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - .5) * -5}deg`);
      card.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - .5) * 5}deg`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });

  const floatCards = document.querySelectorAll('.float-card');
  window.addEventListener('pointermove', (event) => {
    const px = event.clientX / innerWidth - .5, py = event.clientY / innerHeight - .5;
    floatCards.forEach((card, index) => {
      const depth = 14 + index * 8;
      const rotate = card.classList.contains('float-clinic') ? 6 : card.classList.contains('float-aurora') ? -7 : -4;
      card.style.transform = `translate3d(${px * depth}px,${py * depth}px,0) rotate(${rotate + px * 2}deg)`;
    });
  }, { passive: true });
}

const canvas = document.getElementById('living-field');
const ctx = canvas.getContext('2d');
let blobs = [];
let canvasPointer = { x: .5, y: .5 };

function resizeCanvas() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * ratio);
  canvas.height = Math.floor(canvas.clientHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  blobs = Array.from({ length: innerWidth < 600 ? 4 : 7 }, (_, index) => ({
    x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight,
    radius: 85 + Math.random() * 150, phase: Math.random() * Math.PI * 2,
    speed: .00025 + Math.random() * .0003, color: ['#2947ff','#ff4f2d','#ffb7d5','#d8ff70'][index % 4]
  }));
}
window.addEventListener('resize', resizeCanvas, { passive: true });
window.addEventListener('pointermove', (event) => { canvasPointer = { x: event.clientX / innerWidth, y: event.clientY / innerHeight }; }, { passive: true });
resizeCanvas();

function drawField(time = 0) {
  const width = canvas.clientWidth, height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'multiply';
  blobs.forEach((blob, index) => {
    const drift = reduceMotion ? 0 : Math.sin(time * blob.speed + blob.phase);
    const x = blob.x + drift * 45 + (canvasPointer.x - .5) * (index % 2 ? 35 : -35);
    const y = blob.y + Math.cos(time * blob.speed + blob.phase) * (reduceMotion ? 0 : 38) + (canvasPointer.y - .5) * 25;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.radius);
    gradient.addColorStop(0, `${blob.color}88`); gradient.addColorStop(1, `${blob.color}00`);
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, blob.radius, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';
  if (!reduceMotion) requestAnimationFrame(drawField);
}
drawField();
