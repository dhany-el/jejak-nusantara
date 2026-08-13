import './style.css';
import { toggleAmbientSound, playChime } from './audio.js';
import { openQuizModal, closeQuizModal } from './quiz.js';
import {
  initSearch,
  filterTimeline,
  toggleBookmark,
  updateBookmarkButtons,
  updateBookmarkBadge,
  openBookmarksModal,
  closeBookmarksModal,
  showToast
} from './search.js';

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerFine = window.matchMedia('(pointer: fine)').matches;
  const eras = Array.prototype.slice.call(document.querySelectorAll('.era'));
  const chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  const milestones = Array.prototype.slice.call(document.querySelectorAll('.milestone'));

  /* ---------- Build side nav dots grouped by chapter ---------- */
  const navList = document.getElementById('timelineNavList');
  let lastChapter = null;

  if (navList) {
    eras.forEach(function (section) {
      const chapterFull = section.dataset.chapter || '';
      if (chapterFull !== lastChapter) {
        const label = document.createElement('li');
        label.className = 'timeline-nav__chapter';
        label.textContent = chapterFull.split('—')[0].trim();
        navList.appendChild(label);
        lastChapter = chapterFull;
      }
      const li = document.createElement('li');
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'timeline-nav__dot';
      dot.setAttribute('aria-label', section.dataset.label || '');
      dot.addEventListener('click', function () {
        playChime(523.25);
        section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
      li.appendChild(dot);
      navList.appendChild(li);
    });
  }

  const navDots = navList ? navList.querySelectorAll('.timeline-nav__dot') : [];
  const timelineNavEl = document.querySelector('.timeline-nav');

  function centerActiveNavDot(index) {
    const dot = navDots[index];
    if (!timelineNavEl || !dot || timelineNavEl.offsetParent === null) return;
    const navRect = timelineNavEl.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const dotCenterRel = (dotRect.top - navRect.top) + timelineNavEl.scrollTop + dotRect.height / 2;
    const target = dotCenterRel - timelineNavEl.clientHeight / 2;
    timelineNavEl.scrollTo({
      top: Math.max(0, target),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  /* ---------- Year Estimation Logarithmic Interpolation ---------- */
  const YEAR_NOW = new Date().getFullYear();
  const yearAnchors = eras
    .map(function (s) { return parseFloat(s.dataset.yba); })
    .filter(function (v) { return !isNaN(v); });
  const YEAR_MIN = yearAnchors.length ? Math.min.apply(null, yearAnchors) : -2000000;
  const LOG_MAX = Math.log((YEAR_NOW - YEAR_MIN) + 1);

  function scrollFractionToYear(f) {
    f = Math.min(1, Math.max(0, f));
    const age = Math.exp(LOG_MAX * (1 - f)) - 1;
    return YEAR_NOW - age;
  }

  function formatEstimatedYear(year) {
    const y = Math.round(year);
    if (y < 1) {
      const age = Math.round(YEAR_NOW - y);
      if (age >= 10000) {
        return '±' + Math.round(age / 1000).toLocaleString('id-ID') + '.000 tahun lalu';
      }
      return '±' + age.toLocaleString('id-ID') + ' tahun lalu';
    }
    if (y >= YEAR_NOW - 2) return 'Masa kini';
    return 'Sekitar tahun ' + y + ' M';
  }

  /* ---------- HUD Readouts ---------- */
  const hudChapterEl = document.getElementById('hudChapter');
  const hudYearEl = document.getElementById('hudYear');
  const hudEraEl = document.getElementById('hudEra');
  const hudAnnounceEl = document.getElementById('hudAnnounce');
  const mobileNavLabelEl = document.getElementById('mobileNavLabel');
  const dialProgress = document.getElementById('hudDialProgress');
  const circumference = 2 * Math.PI * 42;
  if (dialProgress) {
    dialProgress.style.strokeDasharray = String(circumference);
  }

  function setActive(index) {
    const section = eras[index];
    if (!section) return;
    const chapterFull = section.dataset.chapter || '';
    const chapterShort = chapterFull.split('—')[0].trim();
    if (hudChapterEl) hudChapterEl.textContent = chapterShort;
    if (hudEraEl) hudEraEl.textContent = section.dataset.label || '';
    if (mobileNavLabelEl) mobileNavLabelEl.textContent = section.dataset.label || '';
    navDots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
    centerActiveNavDot(index);
    if (hudAnnounceEl) {
      hudAnnounceEl.textContent =
        'Sekarang: ' + (section.dataset.label || '') + ', ' + (section.dataset.year || '') + ' — ' + chapterShort + '.';
    }
  }

  /* ---------- Intersection Observers ---------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    eras.forEach(function (s) { revealObserver.observe(s); });
    chapters.forEach(function (c) { revealObserver.observe(c); });
    milestones.forEach(function (m) { revealObserver.observe(m); });

    const activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(eras.indexOf(entry.target));
      });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
    eras.forEach(function (s) { activeObserver.observe(s); });
  } else {
    eras.forEach(function (s) { s.classList.add('is-visible'); });
    chapters.forEach(function (c) { c.classList.add('is-visible'); });
    milestones.forEach(function (m) { m.classList.add('is-visible'); });
  }

  /* ---------- Scroll Progress & Continuous Year Display ---------- */
  const topBar = document.getElementById('topProgressBar');
  const mobileNavFill = document.getElementById('mobileNavFill');

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (topBar) topBar.style.width = pct + '%';
    if (mobileNavFill) mobileNavFill.style.width = pct + '%';
    if (dialProgress) dialProgress.style.strokeDashoffset = String(circumference * (1 - pct / 100));
    if (hudYearEl) hudYearEl.textContent = formatEstimatedYear(scrollFractionToYear(pct / 100));
  }

  /* ---------- 3D Parallax & Frame Tilt ---------- */
  const frames = Array.prototype.slice.call(document.querySelectorAll('.era__frame'));
  const frameState = new Map();
  frames.forEach(function (f) { frameState.set(f, { ty: 0, rx: 0, ry: 0 }); });

  function applyFrameTransform(frame) {
    const s = frameState.get(frame);
    frame.style.transform =
      'translateY(' + s.ty.toFixed(1) + 'px) perspective(700px) rotateX(' + s.rx.toFixed(2) + 'deg) rotateY(' + s.ry.toFixed(2) + 'deg)';
  }

  function updateFrameParallax() {
    const centerY = window.innerHeight / 2;
    frames.forEach(function (frame) {
      const rect = frame.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - centerY) * 0.06;
      const s = frameState.get(frame);
      s.ty = offset;
      applyFrameTransform(frame);
    });
  }

  if (pointerFine && !reduceMotion) {
    frames.forEach(function (frame) {
      frame.addEventListener('mousemove', function (e) {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const s = frameState.get(frame);
        s.rx = -y * 8;
        s.ry = x * 8;
        applyFrameTransform(frame);
      });
      frame.addEventListener('mouseleave', function () {
        const s = frameState.get(frame);
        s.rx = 0; s.ry = 0;
        applyFrameTransform(frame);
      });
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        if (!reduceMotion) updateFrameParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- Facts Accordion Buttons ---------- */
  document.querySelectorAll('.era__info-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      playChime(440);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const factEl = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (factEl) factEl.classList.toggle('is-open', !expanded);
    });
  });

  /* ---------- Inject Action Buttons (Bookmark & Share) into Cards ---------- */
  eras.forEach(era => {
    const body = era.querySelector('.era__body');
    const infoBtn = era.querySelector('.era__info-btn');

    if (body && infoBtn) {
      let actions = era.querySelector('.era__actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'era__actions';
        infoBtn.parentNode.insertBefore(actions, infoBtn);
        actions.appendChild(infoBtn);
      }

      // Bookmark Button
      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.type = 'button';
      bookmarkBtn.className = 'era__action-sub-btn era__bookmark-btn';
      bookmarkBtn.innerHTML = `<span>☆</span> Favoritkan`;
      bookmarkBtn.addEventListener('click', () => {
        toggleBookmark(era.id, bookmarkBtn);
      });
      actions.appendChild(bookmarkBtn);

      // Share Button
      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'era__action-sub-btn';
      shareBtn.innerHTML = `<span>🔗</span> Bagikan`;
      shareBtn.addEventListener('click', () => {
        const url = `${window.location.origin}${window.location.pathname}#${era.id}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link berhasil disalin!');
          playChime(783.99);
        });
      });
      actions.appendChild(shareBtn);
    }
  });

  /* ---------- Header Control Buttons Binding ---------- */
  // Developer Profile Modal Toggle
  const devBtn = document.getElementById('devProfileBtn');
  const devModal = document.getElementById('devProfileModal');
  const devCloseBtn = document.getElementById('devCloseBtn');

  if (devBtn && devModal) {
    devBtn.addEventListener('click', () => {
      devModal.classList.add('is-open');
      playChime(523.25);
    });
  }
  if (devCloseBtn && devModal) {
    devCloseBtn.addEventListener('click', () => {
      devModal.classList.remove('is-open');
    });
  }
  if (devModal) {
    devModal.addEventListener('click', (e) => {
      if (e.target.id === 'devProfileModal') devModal.classList.remove('is-open');
    });
  }

  // Ambient Music Toggle
  const ambientBtn = document.getElementById('ambientToggleBtn');
  const ambientIcon = document.getElementById('ambientBtnIcon');
  const ambientLabel = document.getElementById('ambientBtnLabel');

  if (ambientBtn) {
    ambientBtn.addEventListener('click', () => {
      const playing = toggleAmbientSound();
      if (playing) {
        ambientBtn.classList.add('is-active');
        if (ambientIcon) ambientIcon.innerHTML = `<span class="eq-bars"><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span></span>`;
        if (ambientLabel) ambientLabel.textContent = 'Ambient: On';
        showToast('Suara Ambient dinyalakan 🎵');
      } else {
        ambientBtn.classList.remove('is-active');
        if (ambientIcon) ambientIcon.textContent = '🔇';
        if (ambientLabel) ambientLabel.textContent = 'Ambient';
        showToast('Suara Ambient dimatikan');
      }
    });
  }

  // Quiz Modal Toggle
  document.getElementById('quizBtn')?.addEventListener('click', openQuizModal);
  document.getElementById('quizCloseBtn')?.addEventListener('click', closeQuizModal);
  document.getElementById('quizModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'quizModal') closeQuizModal();
  });

  // Bookmarks Modal Toggle
  document.getElementById('bookmarksBtn')?.addEventListener('click', openBookmarksModal);
  document.getElementById('bookmarksCloseBtn')?.addEventListener('click', closeBookmarksModal);
  document.getElementById('bookmarksModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'bookmarksModal') closeBookmarksModal();
  });

  // Chapter Chips Filter
  document.querySelectorAll('.chapter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chapter = chip.dataset.chapter;
      document.querySelectorAll('.chapter-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      filterTimeline('', chapter);
      playChime(523.25);
    });
  });

  /* ---------- Scroll Hint & Top Button ---------- */
  const scrollHintBtn = document.getElementById('scrollHintBtn');
  if (scrollHintBtn && eras[0]) {
    scrollHintBtn.addEventListener('click', function () {
      eras[0].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Init State ---------- */
  initSearch();
  updateBookmarkButtons();
  updateBookmarkBadge();
  setActive(0);
  updateProgress();
})();
