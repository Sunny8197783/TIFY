/**
 * js/saved.js v2 — 큰 앨범 커버 카드 그리드
 */
let savedSongs = [];

function songKey(s) {
  return (s?.title || '제목없음') + '|' + (s?.artist || '가수없음');
}

function loadSavedSongs() {
  try {
    let raw = localStorage.getItem('savedSongs');
    if (!raw || raw === 'undefined') raw = '[]';
    savedSongs = JSON.parse(raw);
  } catch(e) {
    savedSongs = [];
  }
  renderSaved();
}

function renderSaved() {
  const grid    = document.getElementById('savedList');
  const countEl = document.getElementById('savedCount');

  if (countEl) {
    countEl.textContent = savedSongs.length > 0 ? `${savedSongs.length}곡` : '';
  }
  if (!grid) return;

  // 빈 상태
  if (savedSongs.length === 0) {
    grid.innerHTML = `
      <div class="saved-empty">
        <div class="empty-icon">🎵</div>
        <p class="empty-title">아직 저장한 음악이 없어요</p>
        <p class="empty-sub">추천 화면에서 마음에 드는 곡에<br>♡ 버튼을 눌러 저장해보세요!</p>
        <a href="index.html" class="empty-btn">감정 입력하러 가기 →</a>
      </div>`;
    return;
  }

  // 카드 그리드 (Spotify 352px 임베드 = 큰 앨범 커버 + 재생 + 시간)
  grid.innerHTML = savedSongs.map(s => {
    if (!s) return '';
    const k = songKey(s);

    if (s.spotifyId) {
      const url = `https://open.spotify.com/embed/track/${s.spotifyId}?utm_source=generator&theme=0`;
      return `
        <div class="saved-card">
          <iframe
            src="${url}"
            width="100%" height="352" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="${s.title || 'song'}"></iframe>
          <button class="remove-btn" data-key="${k}" title="저장 취소">♥</button>
        </div>`;
    } else {
      // 폴백 (Spotify ID 없음)
      const desc = s.description || s.desc || '내가 저장한 소중한 곡이에요.';
      return `
        <div class="saved-card saved-card-fallback">
          <button class="remove-btn" data-key="${k}" title="저장 취소">♥</button>
          <div class="fallback-cover">🎵</div>
          <div class="fallback-info">
            <div class="title">${s.title || '제목없음'}</div>
            <div class="artist">${s.artist || '가수없음'}</div>
            <div class="desc">${desc}</div>
          </div>
        </div>`;
    }
  }).join('');
}

// 저장 취소 버튼
document.addEventListener('click', e => {
  const rm = e.target.closest('.remove-btn');
  if (!rm) return;
  const key = rm.dataset.key;
  savedSongs = savedSongs.filter(s => songKey(s) !== key);
  localStorage.setItem('savedSongs', JSON.stringify(savedSongs));
  renderSaved();
});

loadSavedSongs();