// Interactive Trivia Quiz for Jejak Nusantara
import { playChime } from './audio.js';

const QUIZ_QUESTIONS = [
  {
    question: "Fosil 'Pithecanthropus erectus' (Homo erectus) pertama kali digali oleh Eugène Dubois pada tahun 1891 di daerah...",
    options: ["Trinil, Ngawi", "Liang Bua, Flores", "Muara Kaman, Kutai", "Trowulan, Mojokerto"],
    answer: 0,
    explanation: "Eugène Dubois menemukan fosil Pithecanthropus erectus di Trinil, tepi sungai Bengawan Solo, Jawa Timur."
  },
  {
    question: "Prasasti Yupa dari Kerajaan Kutai Martapura (Abad ke-4 M) ditulis dalam aksara dan bahasa apa?",
    options: ["Huruf Pallawa & Bahasa Sanskerta", "Huruf Kawi & Bahasa Jawa Kuno", "Huruf Jawi & Bahasa Melayu", "Huruf Pegon & Bahasa Sunda"],
    answer: 0,
    explanation: "Prasasti Yupa ditulis dalam huruf Pallawa dari India Selatan dan menggunakan bahasa Sanskerta."
  },
  {
    question: "Candi Borobudur, candi Buddha terbesar di dunia, dibangun di Jawa Tengah oleh dinasti...",
    options: ["Syailendra", "Sanjaya", "Isyana", "Rajasa"],
    answer: 0,
    explanation: "Dinasti Syailendra yang bercorak Buddha Mahayana membangun Candi Borobudur sekitar abad ke-8 hingga ke-9 Masehi."
  },
  {
    question: "Sumpah Palapa diucapkan oleh Mahapatih Gajah Mada pada masa pemerintahan kerajaan...",
    options: ["Majapahit", "Singhasari", "Kediri", "Mataram Kuno"],
    answer: 0,
    explanation: "Gajah Mada mengucapkan Sumpah Palapa saat diangkat sebagai Mahapatih Majapahit di bawah pemerintahan Raja Hayam Wuruk / Tribhuwana Tunggadewi."
  },
  {
    question: "Siapakah tokoh Wali Songo yang terkenal menyebarkan ajaran Islam lewat media wayang kulit dan tembang macapat?",
    options: ["Sunan Kalijaga", "Sunan Ampel", "Sunan Kudus", "Sunan Giri"],
    answer: 0,
    explanation: "Sunan Kalijaga menggunakan pendekatan budaya lokal seperti wayang kulit dan tembang Jawa untuk berdakwah secara damai."
  },
  {
    question: "Ikrar Sumpah Pemuda pada 28 Oktober 1928 dirumuskan pada Kongres Pemuda II yang berlangsung di...",
    options: ["Batavia (Jakarta)", "Yogyakarta", "Surabaya", "Bandung"],
    answer: 0,
    explanation: "Kongres Pemuda II berlangsung di Batavia (Jakarta), dengan sesi penutup di Jalan Kramat Raya 106."
  },
  {
    question: "Siapakah penjahit Sang Saka Merah Putih yang dikibarkan saat Proklamasi Kemerdekaan 17 Agustus 1945?",
    options: ["Fatmawati", "SK Trimurti", "Christina Martha Tiahahu", "R.A. Kartini"],
    answer: 0,
    explanation: "Fatmawati, istri Soekarno, menjahit langsung Bendera Pusaka Merah Putih sebelum pembacaan Proklamasi."
  },
  {
    question: "Peristiwa penerbangan dan penentuan nasib sendiri rakyat Timor Timur lewat referendum berlangsung pada tahun...",
    options: ["1999", "1998", "2002", "1975"],
    answer: 0,
    explanation: "Referendum Timor Timur diselenggarakan pada 30 Agustus 1999 di bawah pengawasan PBB."
  }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

export function openQuizModal() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  
  const backdrop = document.getElementById('quizModal');
  if (backdrop) {
    backdrop.classList.add('is-open');
    renderQuestion();
  }
}

export function closeQuizModal() {
  const backdrop = document.getElementById('quizModal');
  if (backdrop) {
    backdrop.classList.remove('is-open');
  }
}

function renderQuestion() {
  const bodyEl = document.getElementById('quizModalBody');
  if (!bodyEl) return;

  if (currentQuestionIndex >= QUIZ_QUESTIONS.length) {
    // Show Results
    bodyEl.innerHTML = `
      <div style="text-align:center; padding: 10px 0;">
        <div style="font-size:3rem; margin-bottom:10px;">🏆</div>
        <h3 style="font-family:var(--ff-display); font-size:1.8rem; margin-bottom:8px;">Kuis Selesai!</h3>
        <p style="font-size:1.1rem; color:var(--accent-gold); margin-bottom:20px;">Skor Kamu: <b>${score} / ${QUIZ_QUESTIONS.length}</b> (${Math.round((score/QUIZ_QUESTIONS.length)*100)}%)</p>
        <p style="line-height:1.6; opacity:0.85; margin-bottom:24px;">${
          score === QUIZ_QUESTIONS.length ? 'Luar biasa! Kamu adalah ahli sejarah Nusantara sejati!' :
          score >= 5 ? 'Bagus sekali! Pemahaman sejarah kamu sangat kuat.' :
          'Terus jelajahi linimasa Jejak Nusantara untuk memperdalam wawasanmu!'
        }</p>
        <button id="restartQuizBtn" class="footer__top-btn" type="button">Coba Lagi ↺</button>
      </div>
    `;
    document.getElementById('restartQuizBtn')?.addEventListener('click', openQuizModal);
    return;
  }

  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  bodyEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-family:var(--ff-mono); font-size:12px; color:var(--accent-gold);">
      <span>SOAL ${currentQuestionIndex + 1} DARI ${QUIZ_QUESTIONS.length}</span>
      <span>Skor: ${score}</span>
    </div>
    <h3 style="font-family:var(--ff-display); font-size:1.25rem; line-height:1.4; margin-bottom:18px;">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-opt-btn" data-index="${i}">${opt}</button>
      `).join('')}
    </div>
    <div id="quizExplain" style="display:none; margin-top:16px; padding:14px; background:rgba(247,241,228,0.08); border-radius:8px; font-size:0.9rem; line-height:1.5;"></div>
  `;

  const optBtns = bodyEl.querySelectorAll('.quiz-opt-btn');
  optBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      handleAnswer(idx, q, optBtns, bodyEl);
    });
  });
}

function handleAnswer(selectedIdx, q, optBtns, bodyEl) {
  optBtns.forEach(b => b.style.pointerEvents = 'none');
  
  const isCorrect = selectedIdx === q.answer;
  if (isCorrect) {
    score++;
    optBtns[selectedIdx].classList.add('is-correct');
    playChime(659.25); // E5
  } else {
    optBtns[selectedIdx].classList.add('is-wrong');
    optBtns[q.answer].classList.add('is-correct');
    playChime(329.63); // E4
  }

  const explainEl = bodyEl.querySelector('#quizExplain');
  if (explainEl) {
    explainEl.style.display = 'block';
    explainEl.innerHTML = `<b>${isCorrect ? '✓ Benar!' : '✗ Kurang tepat.'}</b> ${q.explanation}`;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    renderQuestion();
  }, 2200);
}
