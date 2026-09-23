const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Loader hide
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('#loader');
    if (loader) loader.classList.add('hide');
  }, 1200);
});

// Image fallback handler (prevents default broken-image icon)
$$('img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('img-failed');
  });
});

// Interactive sparkles following cursor
const cursor = $('.cursor');
let mx = 0, my = 0;
window.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  }
  if (Math.random() > 0.72) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = Math.random() > 0.5 ? '♡' : '✦';
    s.style.left = mx + 'px';
    s.style.top = my + 'px';
    document.body.append(s);
    setTimeout(() => s.remove(), 700);
  }
});

// Background floating elements (subtle and themed)
setInterval(() => {
  const floaters = $('#floaters');
  if (!floaters) return;
  const f = document.createElement('span');
  f.textContent = ['♡', '★', '🎀'][Math.floor(Math.random() * 3)];
  f.style.left = Math.random() * 100 + 'vw';
  f.style.fontSize = 12 + Math.random() * 20 + 'px';
  f.style.animationDuration = 6 + Math.random() * 6 + 's';
  floaters.append(f);
  setTimeout(() => f.remove(), 12000);
}, 1100);

// Toast notification
function toast(t) {
  const x = $('#toast');
  if (!x) return;
  x.textContent = t;
  x.classList.add('show');
  clearTimeout(x._timer);
  x._timer = setTimeout(() => x.classList.remove('show'), 2400);
}

/* ========================================================
   GAME 1: KITTY QAÇIR (Runner Game)
   ======================================================== */
let score = 0, active = false, timer = null;

function setInitialRunnerPos() {
  const a = $('#arena'), r = $('#runner');
  if (!a || !r) return;
  const rw = r.offsetWidth || 82;
  const rh = r.offsetHeight || 90;
  r.style.left = Math.max(10, Math.floor((a.clientWidth - rw) / 2)) + 'px';
  r.style.top = Math.max(10, Math.floor((a.clientHeight - rh) / 2)) + 'px';
}

window.addEventListener('load', setInitialRunnerPos);
window.addEventListener('resize', () => {
  if (!active) setInitialRunnerPos();
});

function moveKitty(squash = true) {
  const a = $('#arena'), r = $('#runner');
  if (!a || !r) return;
  const rw = r.offsetWidth || 82;
  const rh = r.offsetHeight || 90;
  const pad = 16;
  const maxW = Math.max(0, a.clientWidth - rw - pad * 2);
  const maxH = Math.max(0, a.clientHeight - rh - pad * 2);
  const targetLeft = pad + Math.floor(Math.random() * maxW);
  const targetTop = pad + Math.floor(Math.random() * maxH);
  
  r.style.left = targetLeft + 'px';
  r.style.top = targetTop + 'px';
  
  if (squash) {
    r.classList.remove('squash');
    void r.offsetWidth;
    r.classList.add('squash');
  }
}

function spawnHitSpark(x, y) {
  const arena = $('#arena');
  if (!arena) return;
  const rect = arena.getBoundingClientRect();
  const spark = document.createElement('span');
  spark.className = 'hit-spark';
  spark.textContent = '+1 🐾';
  spark.style.left = (x - rect.left) + 'px';
  spark.style.top = (y - rect.top) + 'px';
  arena.append(spark);
  setTimeout(() => spark.remove(), 650);
}

const startCatchBtn = $('#startCatch');
if (startCatchBtn) {
  startCatchBtn.onclick = () => {
    score = 0;
    active = true;
    $('#score').textContent = 0;
    toast('20 saniyə başladı! Kitty-ni tut! 🐾');
    clearTimeout(timer);
    timer = setTimeout(() => {
      active = false;
      toast('Vaxt bitdi — ' + score + ' dəfə tutdun! 🎀');
      setInitialRunnerPos();
    }, 20000);
    moveKitty(true);
  };
}

const runner = $('#runner');
if (runner) {
  const catchHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!active) {
      toast('Əvvəlcə "Oyuna başla" düyməsinə bas! 🐾');
      return;
    }
    score++;
    $('#score').textContent = score;
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    spawnHitSpark(clientX, clientY);
    moveKitty(true);
  };

  runner.addEventListener('pointerdown', catchHandler);
}

/* ========================================================
   GAME 2: KITTY KAPSULU (Gacha Game)
   ======================================================== */
const prizes = [
  'Bir kofe məndən ☕',
  'Bir mahnı seçmək haqqı 🎧',
  'Bir kompliment qazandın 🎀',
  'İstədiyin bir sualı verə bilərsən 👀',
  'Bu dəfə planı sən seçirsən ✨',
  'Bir dondurma qazandın 🍦',
  'Heç nə çıxmadı :D Yenə fırlat!'
];

function spawnCapsuleSparkles(container) {
  if (!container) return;
  const count = 8;
  const symbols = ['✦', '★', '✧', '🎀', '♡'];
  for (let i = 0; i < count; i++) {
    const sp = document.createElement('span');
    sp.className = 'capsule-sparkle';
    sp.textContent = symbols[i % symbols.length];
    const angle = (i / count) * 2 * Math.PI;
    const dist = 45 + Math.random() * 35;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    sp.style.setProperty('--tx', tx + 'px');
    sp.style.setProperty('--ty', ty + 'px');
    sp.style.left = '50%';
    sp.style.top = '40%';
    container.append(sp);
    setTimeout(() => sp.remove(), 750);
  }
}

let gachaSpinning = false;
const gachaBtn = $('#gacha');
if (gachaBtn) {
  gachaBtn.onclick = () => {
    if (gachaSpinning) return;
    gachaSpinning = true;
    gachaBtn.disabled = true;

    const machine = $('#capsuleMachine');
    const gachaImg = $('#gachaKitty');
    const knob = $('#gachaKnob');
    const prizeEl = $('#prize');

    prizeEl.classList.remove('revealed');
    prizeEl.textContent = 'Fırlanır... ✨';

    // 1. Shake capsule machine
    if (machine) {
      machine.classList.remove('shake-machine');
      void machine.offsetWidth;
      machine.classList.add('shake-machine');
      spawnCapsuleSparkles(machine);
    }

    // 2. Rotate knob
    if (knob) {
      knob.classList.add('turn');
    }

    // 3. Spin Kitty inside glass
    if (gachaImg) {
      gachaImg.classList.remove('spin-bounce');
      void gachaImg.offsetWidth;
      gachaImg.classList.add('spin-bounce');
    }

    // 4. Reveal Prize after animation
    setTimeout(() => {
      if (knob) knob.classList.remove('turn');
      const won = prizes[Math.floor(Math.random() * prizes.length)];
      prizeEl.textContent = won;
      prizeEl.classList.add('revealed');
      gachaSpinning = false;
      gachaBtn.disabled = false;
    }, 850);
  };
}

/* ========================================================
   SECTION 3: TANIŞ OLAQ (Quiz)
   ======================================================== */
const qs = [
  { q: 'Boş bir axşamın var. Hansını seçərdin?', a: ['Gecə gəzintisi 🌙', 'Evdə film 🎬', 'Kofe və söhbət ☕', 'Plansız çıxaq, görək nə olur'] },
  { q: 'Mesajlaşmaq, yoxsa zəng?', a: ['Mesaj 💬', 'Zəng 📞', 'Səsli mesaj', 'Əhvaldan asılıdır :D'] },
  { q: 'Hansı daha vacibdir?', a: ['Yumor', 'Səmimiyyət', 'Enerji', 'Hamısı, niyə seçim edirəm?'] },
  { q: 'Pişik görsən nə edərsən?', a: ['Dərhal sığallayaram', 'Şəkil çəkərəm', 'Yanımdan keçərəm', 'Evə aparmaq istəyərəm 😭'] },
  { q: 'Sonuncu: spontan plan?', a: ['Həmişə hazıram', 'Əvvəlcədən deyin :D', 'Yerindən asılıdır', 'Məni razı salmaq lazımdır'] }
];
let qi = 0, chosen = [];

function renderQ() {
  if (qi >= qs.length) {
    $('#question').textContent = 'Bitdi 🎀';
    $('#answers').innerHTML = '';
    $('#prog').style.width = '100%';
    $('#result').textContent = 'Yaxşı, indi səni əvvəlkindən təxminən 5% daha yaxşı tanıyıram :D';
    return;
  }
  const x = qs[qi];
  $('#question').textContent = x.q;
  $('#answers').innerHTML = x.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('');
  $('#prog').style.width = (qi / qs.length * 100) + '%';
  $$('#answers button').forEach(b => b.onclick = () => {
    chosen.push(b.textContent);
    qi++;
    renderQ();
  });
}
renderQ();

/* ========================================================
   SECTION 4: BALACA SÜRPRİZ (Gift Box)
   ======================================================== */
const gift = $('#gift');
if (gift) {
  gift.onclick = () => {
    if (gift.classList.contains('open')) return;
    gift.classList.add('open');
    setTimeout(() => {
      $('#giftMsg').classList.add('show');
      gift.style.display = 'none';
      confetti();
    }, 700);
  };
}

function confetti() {
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = ['🎀', '♡', '★'][i % 3];
    s.style.left = (35 + Math.random() * 30) + 'vw';
    s.style.top = (25 + Math.random() * 35) + 'vh';
    s.style.fontSize = (15 + Math.random() * 25) + 'px';
    document.body.append(s);
    setTimeout(() => s.remove(), 1000);
  }
}

/* ========================================================
   SOCIAL & HEADER BUTTONS
   ======================================================== */
$('#instagram').onclick = e => {
  if (e.currentTarget.getAttribute('href') === '#') {
    e.preventDefault();
    toast('script.js-də Instagram linkini dəyiş 🎀');
  }
};

$('#tiktok').onclick = e => {
  if (e.currentTarget.getAttribute('href') === '#') {
    e.preventDefault();
    toast('script.js-də TikTok linkini dəyiş 🎀');
  }
};

$('#sound').onclick = () => {
  toast('Musiqi faylı əlavə edəndə bu düyməyə bağlaya bilərsən ♫');
};

document.addEventListener('click', e => {
  if (e.target.closest('button,a') && cursor) {
    cursor.style.width = '34px';
    cursor.style.height = '34px';
    setTimeout(() => {
      cursor.style.width = '18px';
      cursor.style.height = '18px';
    }, 160);
  }
});