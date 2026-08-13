// Search, Filter, Bookmarks & Toast Utilities for Jejak Nusantara
import { playChime } from './audio.js';

let bookmarkedIds = new Set(JSON.parse(localStorage.getItem('jejak_bookmarks') || '[]'));

export function getBookmarks() {
  return Array.from(bookmarkedIds);
}

export function toggleBookmark(eraId, btnEl = null) {
  if (bookmarkedIds.has(eraId)) {
    bookmarkedIds.delete(eraId);
    showToast('Dihapus dari favorit');
    if (btnEl) btnEl.classList.remove('is-bookmarked');
  } else {
    bookmarkedIds.add(eraId);
    showToast('✦ Disimpan ke favorit!');
    if (btnEl) btnEl.classList.add('is-bookmarked');
    playChime(659.25);
  }
  localStorage.setItem('jejak_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
  updateBookmarkBadge();
  updateBookmarkButtons();
}

export function updateBookmarkButtons() {
  document.querySelectorAll('.era').forEach(era => {
    const eraId = era.id;
    const btn = era.querySelector('.era__bookmark-btn');
    if (btn) {
      if (bookmarkedIds.has(eraId)) {
        btn.classList.add('is-bookmarked');
        btn.innerHTML = `<span>★</span> Favorit`;
      } else {
        btn.classList.remove('is-bookmarked');
        btn.innerHTML = `<span>☆</span> Favoritkan`;
      }
    }
  });
}

export function updateBookmarkBadge() {
  const badge = document.getElementById('bookmarkCountBadge');
  if (badge) {
    badge.textContent = bookmarkedIds.size;
    badge.style.display = bookmarkedIds.size > 0 ? 'inline-flex' : 'none';
  }
}

export function openBookmarksModal() {
  const backdrop = document.getElementById('bookmarksModal');
  const bodyEl = document.getElementById('bookmarksModalBody');
  if (!backdrop || !bodyEl) return;

  const list = Array.from(bookmarkedIds);
  if (list.length === 0) {
    bodyEl.innerHTML = `
      <div style="text-align:center; padding: 30px 0; color:var(--cream-dim); opacity:0.8;">
        <div style="font-size:2.5rem; margin-bottom:10px;">⭐</div>
        <p>Belum ada titik sejarah yang kamu favoritkan.</p>
        <p style="font-size:0.85rem; margin-top:6px;">Klik tombol "☆ Favoritkan" pada titik sejarah mana saja untuk menyimpannya di sini.</p>
      </div>
    `;
  } else {
    const itemsHtml = list.map(id => {
      const eraEl = document.getElementById(id);
      if (!eraEl) return '';
      const title = eraEl.querySelector('.era__title')?.textContent || id;
      const year = eraEl.dataset.year || '';
      const chapter = eraEl.dataset.chapter || '';
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:rgba(247,241,228,0.07); border:1px solid rgba(247,241,228,0.15); border-radius:12px; margin-bottom:10px;">
          <div>
            <div style="font-family:var(--ff-mono); font-size:11px; color:var(--accent-gold);">${chapter} • ${year}</div>
            <div style="font-family:var(--ff-display); font-weight:700; font-size:1.05rem; margin-top:2px;">${title}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="icon-btn jump-to-bookmark-btn" data-target="${id}" style="padding:6px 12px; font-size:12px;">Buka →</button>
            <button class="icon-btn remove-bookmark-btn" data-id="${id}" style="padding:6px 10px; font-size:12px; background:rgba(209,73,91,0.2); border-color:rgba(209,73,91,0.4);">✕</button>
          </div>
        </div>
      `;
    }).join('');

    bodyEl.innerHTML = `<div style="max-height:60vh; overflow-y:auto;">${itemsHtml}</div>`;

    bodyEl.querySelectorAll('.jump-to-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        closeBookmarksModal();
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    bodyEl.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBookmark(btn.dataset.id);
        openBookmarksModal();
      });
    });
  }

  backdrop.classList.add('is-open');
}

export function closeBookmarksModal() {
  document.getElementById('bookmarksModal')?.classList.remove('is-open');
}

export function initSearch() {
  const searchInput = document.getElementById('headerSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    filterTimeline(query);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterTimeline('');
      searchInput.focus();
    });
  }
}

export function filterTimeline(query, chapterFilter = '') {
  const eras = document.querySelectorAll('.era');
  const chapters = document.querySelectorAll('.chapter');
  let matchCount = 0;

  eras.forEach(era => {
    const title = era.querySelector('.era__title')?.textContent.toLowerCase() || '';
    const text = era.querySelector('.era__text')?.textContent.toLowerCase() || '';
    const year = (era.dataset.year || '').toLowerCase();
    const label = (era.dataset.label || '').toLowerCase();
    const eraChapter = (era.dataset.chapter || '').toLowerCase();

    const matchesQuery = !query || title.includes(query) || text.includes(query) || year.includes(query) || label.includes(query);
    const matchesChapter = !chapterFilter || eraChapter.includes(chapterFilter.toLowerCase());

    if (matchesQuery && matchesChapter) {
      era.classList.remove('is-search-hidden');
      if (query) era.classList.add('is-highlighted');
      else era.classList.remove('is-highlighted');
      matchCount++;
    } else {
      era.classList.add('is-search-hidden');
      era.classList.remove('is-highlighted');
    }
  });

  // Hide chapters if no child era is visible
  chapters.forEach(c => {
    c.style.display = query || chapterFilter ? 'flex' : '';
  });
}

export function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
