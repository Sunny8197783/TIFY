/**
 * js/recent.js — 사이드바의 .weather-card 를 자동으로
 *                 "최근 추천곡 3" 카드로 교체. 클릭 시 result.html 이동.
 * playlist.js 가 localStorage('tify_latest_songs') 에 저장한 데이터를 읽음.
 */
(function () {
  if (window.__tifyRecent) return;
  window.__tifyRecent = true;

  function loadRecent() {
    try {
      const raw = localStorage.getItem('tify_latest_songs');
      if (!raw || raw === 'undefined') return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(0, 3) : [];
    } catch (e) { return []; }
  }

  function renderHTML(songs) {
    if (!songs.length) {
      return `
        <div class="recent-empty">
          <div class="empty-emoji">🎵</div>
          <div class="empty-text">아직 추천받은<br>곡이 없어요</div>
        </div>`;
    }
    const items = songs.map(s => `
      <div class="recent-song">
        <div class="rs-thumb">🎵</div>
        <div class="rs-info">
          <div class="rs-title">${escapeHtml(s.title || '제목 없음')}</div>
          <div class="rs-artist">${escapeHtml(s.artist || '가수 없음')}</div>
        </div>
      </div>`).join('');
    return `
      <div class="recent-head">
        <span>🎧</span>
        <span>최근 추천</span>
        <span class="recent-arrow">→</span>
      </div>
      <div class="recent-songs">${items}</div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function init() {
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return;

    const recent = document.createElement('div');
    recent.className = 'recent-card';
    recent.innerHTML = renderHTML(loadRecent());

    recent.addEventListener('click', () => {
      // 결과 페이지가 아니면 이동, 결과 페이지면 새로고침
      const file = window.location.pathname.split('/').pop();
      if (file === 'result.html') {
        window.location.reload();
      } else {
        window.location.href = 'result.html';
      }
    });

    weatherCard.replaceWith(recent);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();