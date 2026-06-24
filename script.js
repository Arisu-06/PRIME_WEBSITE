// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ===== UNIFIED CANVAS BACKGROUND =====
const netCanvas = document.getElementById('networkCanvas');
const netCtx = netCanvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

let netNodes = [];
let netPackets = [];
let floaters = [];

const NODE_COUNT = 55;
const FLOATER_COUNT = 35;
const CONNECT_DIST = 150;

function resizeNetCanvas() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  netCanvas.width = w * dpr;
  netCanvas.height = h * dpr;
  netCanvas.style.width = w + 'px';
  netCanvas.style.height = h + 'px';
  netCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initNodes() {
  netNodes = [];
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < NODE_COUNT; i++) {
    netNodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.5 + 0.6,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function initFloaters() {
  floaters = [];
  const w = window.innerWidth;
  const h = window.innerHeight;
  const palette = [
    [108, 92, 231],
    [0, 206, 201],
    [253, 121, 168]
  ];
  for (let i = 0; i < FLOATER_COUNT; i++) {
    const c = palette[Math.floor(Math.random() * palette.length)];
    floaters.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      r: Math.random() * 2 + 0.8,
      color: c,
      alpha: Math.random() * 0.25 + 0.08,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function spawnPacket(x1, y1, x2, y2) {
  netPackets.push({
    sx: x1, sy: y1, ex: x2, ey: y2,
    t: 0,
    speed: 0.002 + Math.random() * 0.003,
    color: Math.random() > 0.5 ? [108, 92, 231] : [0, 206, 201]
  });
}

function animate() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  netCtx.clearRect(0, 0, w, h);

  netNodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    n.phase += 0.008;
    if (n.x < 0) { n.x = 0; n.vx *= -1; }
    if (n.x > w) { n.x = w; n.vx *= -1; }
    if (n.y < 0) { n.y = 0; n.vy *= -1; }
    if (n.y > h) { n.y = h; n.vy *= -1; }
  });

  floaters.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    f.phase += 0.006;
    if (f.x < -30) f.x = w + 30;
    if (f.x > w + 30) f.x = -30;
    if (f.y < -30) f.y = h + 30;
    if (f.y > h + 30) f.y = -30;
  });

  for (let i = 0; i < netNodes.length; i++) {
    for (let j = i + 1; j < netNodes.length; j++) {
      const dx = netNodes[i].x - netNodes[j].x;
      const dy = netNodes[i].y - netNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.08;
        netCtx.beginPath();
        netCtx.moveTo(netNodes[i].x, netNodes[i].y);
        netCtx.lineTo(netNodes[j].x, netNodes[j].y);
        netCtx.strokeStyle = `rgba(108,92,231,${alpha})`;
        netCtx.lineWidth = 0.5;
        netCtx.stroke();
        if (Math.random() < 0.0003) {
          spawnPacket(netNodes[i].x, netNodes[i].y, netNodes[j].x, netNodes[j].y);
        }
      }
    }
  }

  netNodes.forEach(n => {
    const pulse = Math.sin(n.phase) * 0.5 + 0.5;
    const glow = netCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
    glow.addColorStop(0, `rgba(108,92,231,${0.18 * pulse})`);
    glow.addColorStop(1, 'rgba(108,92,231,0)');
    netCtx.beginPath();
    netCtx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
    netCtx.fillStyle = glow;
    netCtx.fill();

    netCtx.beginPath();
    netCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    netCtx.fillStyle = `rgba(108,92,231,${0.35 + pulse * 0.25})`;
    netCtx.fill();
  });

  floaters.forEach(f => {
    const pulse = Math.sin(f.phase) * 0.5 + 0.5;
    const a = f.alpha * (0.6 + pulse * 0.4);

    const glow = netCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4);
    glow.addColorStop(0, `rgba(${f.color[0]},${f.color[1]},${f.color[2]},${a * 0.4})`);
    glow.addColorStop(1, `rgba(${f.color[0]},${f.color[1]},${f.color[2]},0)`);
    netCtx.beginPath();
    netCtx.arc(f.x, f.y, f.r * 4, 0, Math.PI * 2);
    netCtx.fillStyle = glow;
    netCtx.fill();

    netCtx.beginPath();
    netCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    netCtx.fillStyle = `rgba(${f.color[0]},${f.color[1]},${f.color[2]},${a})`;
    netCtx.fill();
  });

  netPackets = netPackets.filter(p => {
    p.t += p.speed;
    if (p.t >= 1) return false;
    const cx = p.sx + (p.ex - p.sx) * p.t;
    const cy = p.sy + (p.ey - p.sy) * p.t;

    const trail = netCtx.createRadialGradient(cx, cy, 0, cx, cy, 5);
    trail.addColorStop(0, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0.7)`);
    trail.addColorStop(0.5, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0.25)`);
    trail.addColorStop(1, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0)`);
    netCtx.beginPath();
    netCtx.arc(cx, cy, 5, 0, Math.PI * 2);
    netCtx.fillStyle = trail;
    netCtx.fill();

    netCtx.beginPath();
    netCtx.arc(cx, cy, 1.2, 0, Math.PI * 2);
    netCtx.fillStyle = 'rgba(255,255,255,0.85)';
    netCtx.fill();
    return true;
  });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeNetCanvas();
  initNodes();
  initFloaters();
});
resizeNetCanvas();
initNodes();
initFloaters();
animate();

// ===== HERO SPARKLES =====
const heroSparkles = document.getElementById('heroSparkles');
const sparkleColors = [
  'rgba(108,92,231,0.7)',
  'rgba(0,206,201,0.6)',
  'rgba(253,121,168,0.5)',
  'rgba(255,255,255,0.4)'
];

for (let i = 0; i < 25; i++) {
  const s = document.createElement('div');
  s.className = 'hero-sparkle';
  const size = Math.random() * 3 + 1.5;
  s.style.cssText = `
    width:${size}px;height:${size}px;
    left:${Math.random() * 100}%;
    top:${Math.random() * 100}%;
    background:${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};
    box-shadow:0 0 ${size * 3}px ${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};
    animation-duration:${Math.random() * 3 + 2}s;
    animation-delay:${Math.random() * 4}s;
  `;
  heroSparkles.appendChild(s);
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Animate skill bars
      if (entry.target.classList.contains('skills-column')) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animated');
        });
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Also observe skill columns specifically
document.querySelectorAll('.skills-column').forEach(el => observer.observe(el));

// ===== QUIZ =====
const quizData = [
  {
    q: 'У тебя пропал интернет. Что ты сделаешь первым?',
    options: [
      'Вызову провайдера и буду ждать',
      'Проверю кабели, роутер и попробую диагностику',
      'Начну читать форумы в поисках решения',
      'Попрошу помочь друга'
    ],
    correct: 1
  },
  {
    q: 'Готов ли ты оперативно реагировать на аварии ночью и в выходные?',
    options: [
      'Ужас, это невозможно',
      'Нормально, если это оплачивается',
      'Готов, если нужно — сеть работает 24/7',
      'Предпочитаю только дневную смену'
    ],
    correct: 2
  },
  {
    q: 'Что такое IP-адрес?',
    options: [
      'Название сайта в интернете',
      'Уникальный адрес устройства в сети',
      'Пароль от Wi-Fi',
      'Тип кабеля для подключения'
    ],
    correct: 1
  },
  {
    q: 'Ты заметил, что часть сети работает медленно. Твои действия?',
    options: [
      'Подожду, может само пройдёт',
      'Начну с мониторинга трафика и найду узкое место',
      'Перезагружу всё подряд',
      'Напишу жалобу руководству'
    ],
    correct: 1
  },
  {
    q: 'Какой навык для инженера сети наиболее важен?',
    options: [
      'Умение красиво говорить',
      'Стрессоустойчивость и внимание к деталям',
      'Физическая сила',
      'Знание дизайна'
    ],
    correct: 1
  },
  {
    q: 'Тебе нужно настроить новый маршрутизатор. Ты...',
    options: [
      'Попрошу коллегу сделать это за меня',
      'Найду мануал и настрою по документации',
      'Подключу и надеюсь, что заработает',
      'Скажу, что у меня нет доступа'
    ],
    correct: 1
  },
  {
    q: 'Как ты относишься к учёбе и сертификациям?',
    options: [
      'Это лишнее, опыт важнее',
      'Готов учиться, если компания оплатит',
      'Активно учащимся — сертификации открывают двери',
      'Только если обязательно'
    ],
    correct: 2
  },
  {
    q: 'Что для тебя важнее в работе?',
    options: [
      'Высокая зарплата',
      'Стабильность и интересные задачи',
      'Минимум ответственности',
      'Всё удаленно и без звонков'
    ],
    correct: 1
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizProgress = document.getElementById('quizProgress');
const quizProgressText = document.getElementById('quizProgressText');
const quizResult = document.getElementById('quizResult');
const quizContainer = document.getElementById('quizContainer');

function renderQuiz() {
  if (currentQ >= quizData.length) {
    showResult();
    return;
  }

  answered = false;
  const data = quizData[currentQ];
  quizProgress.style.width = ((currentQ + 1) / quizData.length * 100) + '%';
  quizProgressText.textContent = `${currentQ + 1} / ${quizData.length}`;
  quizQuestion.textContent = data.q;
  quizOptions.innerHTML = '';

  data.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    quizOptions.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const data = quizData[currentQ];
  const buttons = quizOptions.querySelectorAll('.quiz-option');

  buttons.forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    if (i === data.correct) btn.classList.add('selected');
    if (i === index && i !== data.correct) {
      btn.style.background = 'rgba(253,121,168,0.2)';
      btn.style.borderColor = '#fd79a8';
    }
  });

  if (index === data.correct) score++;

  setTimeout(() => {
    currentQ++;
    renderQuiz();
  }, 1200);
}

function showResult() {
  quizProgress.style.width = '100%';
  quizProgressText.textContent = 'Готово!';
  quizQuestion.style.display = 'none';
  quizOptions.style.display = 'none';
  quizResult.style.display = 'block';

  const pct = Math.round((score / quizData.length) * 100);
  let verdict = '';
  let emoji = '';

  if (pct >= 88) {
    verdict = 'Ты идеально подходишь для этой профессии! У тебя аналитический склад ума, стрессоустойчивость и готовность учиться.';
    emoji = '🚀';
  } else if (pct >= 63) {
    verdict = 'У тебя хороший потенциал! Стоит подтянуть технические знания и практиковаться в диагностике сетей.';
    emoji = '💪';
  } else if (pct >= 38) {
    verdict = 'Профессия может подойти, но стоит начать с основ сетевого администрирования и протоколов.';
    emoji = '📚';
  } else {
    verdict = 'Стоит присмотреться к другим IT-профессиям, но если интерес есть — начни с курсов по сетевым технологиям.';
    emoji = '🌱';
  }

  quizResult.innerHTML = `
    <span style="font-size:3rem">${emoji}</span>
    <span class="score">${score} / ${quizData.length}</span>
    <h3>Результат: ${pct}%</h3>
    <p>${verdict}</p>
    <button class="btn btn-primary btn-restart" onclick="restartQuiz()">Пройти ещё раз</button>
  `;
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  quizResult.style.display = 'none';
  quizQuestion.style.display = 'block';
  quizOptions.style.display = 'flex';
  renderQuiz();
}

renderQuiz();

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
