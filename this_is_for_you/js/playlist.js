// js/playlist.js — 추천 결과 렌더링 + 플레이어
let allSongs = [];
let currentFilter = '전체';

async function loadSongs(){
  const res = await fetch('data/songs.json');
  const data = await res.json();
  const analysis = JSON.parse(sessionStorage.getItem('analysisResult') || '{}');
  const cat = analysis.category || 'sad';
  allSongs = data[cat] || data.sad;
  if(analysis.comfortMessage){
    document.getElementById('comfortMsg').textContent = analysis.comfortMessage;
  }
  render();
}

function render(){
  const list = document.getElementById('songList');
  const filtered = currentFilter==='전체'
    ? allSongs
    : allSongs.filter(s=>s.mood===currentFilter);
  list.innerHTML = filtered.map((s,i)=>`
    <div class="song-card" data-i="${i}">
      <div class="song-thumb">🎵</div>
      <div class="song-info">
        <div class="title">${s.title}</div>
        <div class="artist">${s.artist}</div>
        <div class="desc">${s.desc}</div>
      </div>
      <div class="song-time">${s.time}</div>
      <button class="play-btn" data-title="${s.title}" data-artist="${s.artist}">▶</button>
    </div>
  `).join('') || '<p style="color:var(--text-dim);text-align:center;padding:40px;">해당 분위기의 곡이 없어요.</p>';
}

document.getElementById('moodFilters').addEventListener('click', e=>{
  const btn = e.target.closest('.mood-filter');
  if(!btn) return;
  document.querySelectorAll('.mood-filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  render();
});

document.getElementById('songList').addEventListener('click', e=>{
  const pb = e.target.closest('.play-btn');
  if(!pb) return;
  document.getElementById('nowTitle').textContent = pb.dataset.title;
  document.getElementById('nowArtist').textContent = pb.dataset.artist;
  document.getElementById('mainPlay').textContent = '⏸';
  // ============================================
  // 🔑 [API 연결 자리] YouTube/Spotify Embed 재생
  // ============================================
});

document.getElementById('mainPlay').addEventListener('click', e=>{
  e.target.textContent = e.target.textContent==='▶' ? '⏸' : '▶';
});

loadSongs();

// 오늘의 감정 기록 저장 (localStorage)
window.addEventListener('load', ()=>{
  const analysis = JSON.parse(sessionStorage.getItem('analysisResult') || '{}');
  const mood = sessionStorage.getItem('userMood') || '';
  if(!analysis.category) return;
  const records = JSON.parse(localStorage.getItem('records') || '{}');
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  records[key] = {
    mood, category:analysis.category,
    ratio:analysis.ratio, comfortMessage:analysis.comfortMessage,
    time: today.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})
  };
  localStorage.setItem('records', JSON.stringify(records));
});
