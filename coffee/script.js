const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const bookingModal = document.querySelector('.booking-modal');
const bookingForm = document.querySelector('.booking-form');
const bookingSuccess = document.querySelector('.booking-success');

function setMobileMenu(open) {
  menuToggle.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuToggle.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));

document.querySelectorAll('.menu-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const menuName = tab.dataset.menu;
    document.querySelectorAll('.menu-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.menu-list').forEach((panel) => {
      const active = panel.dataset.panel === menuName;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      if (active) {
        panel.classList.remove('switching');
        void panel.offsetWidth;
        panel.classList.add('switching');
      }
    });
  });
});

function openBooking() {
  setMobileMenu(false);
  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  bookingModal.showModal();
  document.body.classList.add('modal-open');
}

function closeBooking() {
  bookingModal.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.booking-button').forEach((button) => button.addEventListener('click', openBooking));
document.querySelector('.modal-close').addEventListener('click', closeBooking);
bookingModal.addEventListener('click', (event) => {
  if (event.target === bookingModal) closeBooking();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  bookingForm.hidden = true;
  bookingSuccess.hidden = false;
  bookingForm.reset();
});

const dateInput = document.querySelector('input[type="date"]');
dateInput.min = new Date().toISOString().split('T')[0];

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
