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
  dark ? body.classList.add('dark') : body.classList.remove('dark');
  themeToggle.textContent = dark ? '☀️' : '🌙';
};
setTheme(localStorage.getItem('theme') === 'dark');

themeToggle.addEventListener('click', () => {
  const dark = !body.classList.contains('dark');
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
