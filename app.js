// dynamic hero text rotation
const slogans = [
  'Feel the bass',
  'Join the underground',
  'Where rhythms collide'
];
let sloganIndex = 0;
const heroText = document.getElementById('hero-text');
setInterval(() => {
  sloganIndex = (sloganIndex + 1) % slogans.length;
  heroText.textContent = slogans[sloganIndex];
}, 3000);

// event loading
fetch('events.json')
  .then((res) => res.json())
  .then((events) => {
    const list = document.getElementById('event-list');
    list.textContent = '';
    events.forEach((event) => {
      const div = document.createElement('div');
      div.className = 'event';
      div.innerHTML = `<strong>${event.title}</strong> - ${event.date} @ ${event.location}`;
      list.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById('event-list').textContent = 'No events found.';
  });

// theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const setTheme = (dark) => {
  if (dark) {
    body.classList.remove('light');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.add('light');
    themeToggle.textContent = '🌙';
  }
};
setTheme(localStorage.getItem('theme') !== 'light');

themeToggle.addEventListener('click', () => {
  const dark = body.classList.contains('light');
  setTheme(dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// subscribe form
const form = document.getElementById('subscribe-form');
const msg = document.getElementById('form-msg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  msg.textContent = 'Thanks for joining the movement!';
  form.reset();
});

// set current year
document.getElementById('year').textContent = new Date().getFullYear();

// scroll reveal
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
