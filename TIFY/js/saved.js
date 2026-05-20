// js/saved.js — 저장한 곡 목록 + 삭제
function render(){
  const list = document.getElementById('savedList');
  const count = document.getElementById('savedCount');
  const arr = JSON.parse(localStorage.getItem('savedSongs')||'[]');
  count.textContent = arr.length ? `(${arr.length}곡)` : '';
  if(!arr.length){
    list.innerHTML = `<div class="empty-state"><span class="ic">🎵</span>
      아직 저장한 곡이 없어요.<br/>마음에 드는 곡은 ♥ 버튼으로 담아보세요.</div>`;
    return;
  }
  list.innerHTML = arr.map((s,i)=>`
    <div class="song-card">
      <div class="song-thumb">🎵</div>
      <div class="song-info">
        <div class="title">${s.title}</div>
        <div class="artist">${s.artist}</div>
        <div class="desc">${s.desc||''}</div>
      </div>
      <div class="song-time">${s.time||''}</div>
      <button class="save-btn saved" data-i="${i}" title="삭제">♥</button>
      <button class="play-btn">▶</button>
    </div>`).join('');
}
document.getElementById('savedList').addEventListener('click', e=>{
  const sv = e.target.closest('.save-btn'); if(!sv) return;
  const i = parseInt(sv.dataset.i);
  const arr = JSON.parse(localStorage.getItem('savedSongs')||'[]');
  arr.splice(i,1);
  localStorage.setItem('savedSongs', JSON.stringify(arr));
  render();
});
render();
