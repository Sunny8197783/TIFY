// js/saved.js — 저장한 곡 표시 (localStorage)
const list = document.getElementById('savedList');
const saved = JSON.parse(localStorage.getItem('savedSongs') || '[]');
if(saved.length){
  list.innerHTML = saved.map(s=>`
    <div class="song-card">
      <div class="song-thumb">🎵</div>
      <div class="song-info">
        <div class="title">${s.title}</div>
        <div class="artist">${s.artist}</div>
        <div class="desc">${s.desc||''}</div>
      </div>
      <div class="song-time">${s.time||''}</div>
      <button class="play-btn">▶</button>
    </div>`).join('');
}
