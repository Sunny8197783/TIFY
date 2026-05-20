// js/playlist.js — 결과 페이지 (추천 + 저장 + 기록)
let allSongs = [];
let currentFilter = '전체';
let analysis = {};
let savedKeys = new Set();

function songKey(s){ return s.title + '|' + s.artist; }

function loadSaved(){
  savedKeys = new Set(JSON.parse(localStorage.getItem('savedSongs')||'[]').map(songKey));
}

async function loadSongs(){
  const res = await fetch('data/songs.json');
  const data = await res.json();
  analysis = JSON.parse(sessionStorage.getItem('analysisResult') || '{}');
  const cat = analysis.category || 'sad';
  allSongs = data[cat] || data.sad;
  if(analysis.comfortMessage){
    document.getElementById('comfortMsg').textContent = analysis.comfortMessage;
  }
  loadSaved();
  render();
  saveTodayRecord();
}

function render(){
  const list = document.getElementById('songList');
  const filtered = currentFilter==='전체' ? allSongs : allSongs.filter(s=>s.mood===currentFilter);
  if(!filtered.length){
    list.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px;">해당 분위기의 곡이 없어요.</p>';
    return;
  }
  list.innerHTML = filtered.map(s=>{
    const k = songKey(s);
    const saved = savedKeys.has(k);
    return `
    <div class="song-card">
      <div class="song-thumb">🎵</div>
      <div class="song-info">
        <div class="title">${s.title}</div>
        <div class="artist">${s.artist}</div>
        <div class="desc">${s.desc}</div>
      </div>
      <div class="song-time">${s.time}</div>
      <button class="save-btn ${saved?'saved':''}" data-key="${k}" title="저장">${saved?'♥':'♡'}</button>
      <button class="play-btn" data-title="${s.title}" data-artist="${s.artist}">▶</button>
    </div>`;
  }).join('');
}

document.getElementById('moodFilters').addEventListener('click', e=>{
  const btn = e.target.closest('.mood-filter'); if(!btn) return;
  document.querySelectorAll('.mood-filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter; render();
});

document.getElementById('songList').addEventListener('click', e=>{
  const sv = e.target.closest('.save-btn');
  const pb = e.target.closest('.play-btn');
  if(sv){
    const key = sv.dataset.key;
    const song = allSongs.find(s=>songKey(s)===key);
    let arr = JSON.parse(localStorage.getItem('savedSongs')||'[]');
    if(savedKeys.has(key)){
      arr = arr.filter(s=>songKey(s)!==key); savedKeys.delete(key);
    } else {
      arr.push(song); savedKeys.add(key);
    }
    localStorage.setItem('savedSongs', JSON.stringify(arr));
    render();
  }
  if(pb){
    document.getElementById('nowTitle').textContent = pb.dataset.title;
    document.getElementById('nowArtist').textContent = pb.dataset.artist;
    document.getElementById('mainPlay').textContent = '⏸';
    // 🔑 [API 연결 자리] YouTube/Spotify Embed 재생
  }
});

document.getElementById('mainPlay').addEventListener('click', e=>{
  e.target.textContent = e.target.textContent==='▶' ? '⏸' : '▶';
});

function saveTodayRecord(){
  if(!analysis.category) return;
  const mood = sessionStorage.getItem('userMood') || '';
  const records = JSON.parse(localStorage.getItem('records') || '{}');
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  records[key] = {
    mood, category:analysis.category, label:analysis.label, emoji:analysis.emoji,
    bars:analysis.bars, comfortMessage:analysis.comfortMessage,
    weather: analysis.weather,
    songs: allSongs.slice(0,4),
    time: today.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})
  };
  localStorage.setItem('records', JSON.stringify(records));
}

loadSongs();
