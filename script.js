const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const menuLinks = mobileMenu.querySelectorAll('a');

function setMenu(open) {
  menuButton.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
  observer.observe(item);
});

document.getElementById('year').textContent = new Date().getFullYear();
