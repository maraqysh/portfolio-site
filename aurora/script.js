const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  menuToggle.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
});
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 28));

document.querySelectorAll('[data-compare]').forEach((compare) => {
  const range = compare.querySelector('.compare-range');
  const update = () => compare.style.setProperty('--position', `${range.value}%`);
  range.addEventListener('input', update);
  update();
});

const area = document.getElementById('area');
const property = document.getElementById('property');
const supervision = document.getElementById('supervision');
const supply = document.getElementById('supply');
const price = document.getElementById('price');
const duration = document.getElementById('duration');

function calculate() {
  const square = Math.max(20, Math.min(500, Number(area.value) || 20));
  const packageRate = Number(document.querySelector('input[name="package"]:checked').value);
  let total = square * packageRate * Number(property.value);
  if (supervision.checked) total *= 1.08;
  if (supply.checked) total += square * 1500;
  price.textContent = `${Math.round(total / 1000) * 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  const baseWeeks = packageRate >= 9500 ? 12 : packageRate >= 6500 ? 8 : 5;
  const extraWeeks = square > 150 ? 4 : square > 90 ? 2 : 0;
  duration.textContent = `${baseWeeks + extraWeeks}–${baseWeeks + extraWeeks + 2} недель`;
}

document.getElementById('calc-form').addEventListener('input', calculate);
area.addEventListener('change', () => {
  area.value = Math.max(20, Math.min(500, Number(area.value) || 20));
  calculate();
});
calculate();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
document.getElementById('year').textContent = new Date().getFullYear();
