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

// event loading with search support (local JSON)
const list = document.getElementById('event-list');
let eventsCache = [];

const renderEvents = (events) => {
  list.textContent = '';
  if (events.length === 0) {
    list.textContent = 'No events found.';
    return;
  }
  events.forEach((event) => {
    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `<strong>${event.title}</strong> - ${event.date} @ ${event.location}`;
    list.appendChild(div);
  });
};

const loadEvents = () => {
  list.textContent = 'Loading events...';
  fetch('events.json')
    .then((res) => res.json())
    .then((events) => {
      eventsCache = events;
      renderEvents(eventsCache);
    })
    .catch(() => {
      list.textContent = 'Error loading events.';
    });
};

const search = document.getElementById('event-search');
if (search) {
  search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = eventsCache.filter((event) =>
      event.title.toLowerCase().includes(term)
    );
    renderEvents(filtered);
  });
}

loadEvents();

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

// subscribe form (local storage)
const form = document.getElementById('subscribe-form');
const msg = document.getElementById('form-msg');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    try {
      const subs = JSON.parse(localStorage.getItem('tk-subscribers') || '[]');
      subs.push(email);
      localStorage.setItem('tk-subscribers', JSON.stringify(subs));
      msg.textContent = 'Thanks for joining the movement!';
      form.reset();
    } catch {
      msg.textContent = 'Subscription failed.';
    }
  });
}

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
