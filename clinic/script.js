const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMenu(open) {
  menuButton.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu(false);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

document.querySelectorAll('.direction-more').forEach((button) => {
  button.addEventListener('click', () => {
    const details = document.getElementById(button.getAttribute('aria-controls'));
    const card = button.closest('.direction-card');
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    button.setAttribute('aria-expanded', String(willOpen));
    button.querySelector('span').textContent = willOpen ? '−' : '+';
    details.hidden = !willOpen;
    card.classList.toggle('is-open', willOpen);
  });
});

document.querySelector('.appointment-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Спасибо! Администратор свяжется с вами в ближайшее время.';
  event.currentTarget.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
