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

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
const colors = ['rgba(108,92,231,0.4)', 'rgba(0,206,201,0.3)', 'rgba(253,121,168,0.3)'];

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const dur = Math.random() * 10 + 8;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const drift = (Math.random() - 0.5) * 200;
  p.style.cssText = `
    width:${size}px;height:${size}px;
    left:${x}%;top:${y}%;
    background:${color};
    animation-name: particleDrift;
    animation-duration:${dur}s;
    animation-delay:${Math.random()*3}s;
    --drift:${drift}px;
  `;
  particlesContainer.appendChild(p);
  setTimeout(() => p.remove(), (dur + 4) * 1000);
}

setInterval(createParticle, 400);
for (let i = 0; i < 30; i++) createParticle();

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
      'Активно учащуся — сертификации открывают двери',
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
      'Всё remote и без звонков'
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
