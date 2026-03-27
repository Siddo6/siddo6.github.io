// --- Hamburger menu ---
const hamburger = document.querySelector(".hamburger");
const navLinks  = document.querySelector(".nav-links");
const links     = document.querySelectorAll(".nav-links li");

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle("open");
  links.forEach(link => link.classList.toggle("fade"));
  hamburger.classList.toggle("toggle");
});

// Close hamburger when a nav link is clicked (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove("open");
    links.forEach(l => l.classList.remove("fade"));
    hamburger.classList.remove("toggle");
  });
});

// --- Active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop();
  if (currentPage === linkPage) link.classList.add('nav-active');
});

// --- Scroll fade-in (about, portfolio) ---
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));

// --- Typewriter ---
function startTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'I turn ideas into digital solutions.',
    'Math background. Developer mindset.',
    'Python · Django · JavaScript · React.',
    'Clean code, elegant solutions.'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 35 : 65);
  }
  type();
}

// --- Name scramble (home page only) ---
function scrambleName() {
  const el = document.querySelector('.home-name');
  if (!el) return;

  const target = el.textContent.trim();
  const pool   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&?';
  const scrambleCount = target.split('').filter(c => c !== '.' && c !== ' ').length;
  const totalFrames   = scrambleCount * 4;
  let frame = 0;

  const id = setInterval(() => {
    const settled = Math.floor(frame / 4);
    let nonSpecial = 0;
    el.textContent = target
      .split('')
      .map(char => {
        if (char === '.' || char === ' ') return char;
        const done = nonSpecial < settled;
        nonSpecial++;
        return done ? char : pool[Math.floor(Math.random() * pool.length)];
      })
      .join('');

    frame++;
    if (frame > totalFrames) {
      clearInterval(id);
      el.textContent = target;
    }
  }, 40);
}

const homeNameEl = document.querySelector('.home-name');
if (homeNameEl) {
  setTimeout(scrambleName, 450);
  homeNameEl.addEventListener('mouseenter', scrambleName);
}

// --- Start typewriter if present and no cinematic sequence ---
const cinematicHero = document.querySelector('.cinematic-hero');
if (!cinematicHero) {
  setTimeout(startTypewriter, 350);
}

if (cinematicHero) {
  const PLAYED_KEY = 'cinematicPlayed';

  // Timed sequence: [delay ms, CSS selector]
  const sequence = [
    [ 500,  '.reveal-nav'      ],
    [ 850,  '.reveal-role'     ],
    [1500,  '.reveal-rule'     ],
    [2000,  '.reveal-tagline'  ],
    [2700,  '.reveal-buttons'  ],
    [3400,  '.reveal-signature'],
    [3800,  '.reveal-footer'   ],
  ];

  function hideCursor() {
    const cursor = document.getElementById('init-cursor');
    if (cursor) cursor.classList.add('hide');
  }

  function revealAll() {
    document.querySelectorAll(
      '.reveal-nav, .reveal-role, .reveal-rule, .reveal-tagline, ' +
      '.reveal-buttons, .reveal-signature, .reveal-footer'
    ).forEach(el => { el.style.opacity = '1'; });
    hideCursor();
  }

  if (sessionStorage.getItem(PLAYED_KEY)) {
    // Repeat visit — skip the sequence
    revealAll();
    setTimeout(startTypewriter, 80);
  } else {
    // First visit — play the cinematic sequence
    sessionStorage.setItem(PLAYED_KEY, 'true');

    sequence.forEach(([delay, selector]) => {
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.classList.add('revealed');
      }, delay);
    });

    setTimeout(hideCursor,        850);   // hide cursor as role appears
    setTimeout(startTypewriter,  2200);   // start typing after tagline reveals
  }
}
