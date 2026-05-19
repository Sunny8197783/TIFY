// js/record.js — 캘린더 + 기록 표시
const moodEmoji = {happy:'😊', sad:'😢', dawn:'🌙', focus:'🎧', chill:'☁️', love:'💗'};
let viewYear, viewMonth;

function init(){
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();
  render();
}

function render(){
  const monthName = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'][viewMonth];
  document.getElementById('calMonth').textContent = monthName + ' ▾';

  const first = new Date(viewYear, viewMonth, 1);
  const lastDate = new Date(viewYear, viewMonth+1, 0).getDate();
  const startDow = first.getDay();
  const today = new Date();
  const records = JSON.parse(localStorage.getItem('records') || '{}');

  const grid = document.getElementById('calGrid');
  const dows = ['일','월','화','수','목','금','토'];
  let html = dows.map((d,i)=>`<div class="dow ${i===0?'sun':''}">${d}</div>`).join('');

  for(let i=0;i<startDow;i++) html += '<div class="cal-cell empty"></div>';
  for(let d=1; d<=lastDate; d++){
    const dow = (startDow + d - 1) % 7;
    const key = `${viewYear}-${viewMonth+1}-${d}`;
    const rec = records[key];
    const isToday = (d===today.getDate() && viewMonth===today.getMonth() && viewYear===today.getFullYear());
    const marker = rec ? `<span class="marker">${moodEmoji[rec.category]||'😊'}</span>` : '';
    html += `<div class="cal-cell ${dow===0?'sun':''} ${isToday?'today':''}" data-day="${d}">${d}${marker}</div>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.cal-cell[data-day]').forEach(c=>{
    c.addEventListener('click', ()=>showDetail(parseInt(c.dataset.day)));
  });
}

function showDetail(day){
  const records = JSON.parse(localStorage.getItem('records') || '{}');
  const key = `${viewYear}-${viewMonth+1}-${day}`;
  const rec = records[key];
  const detail = document.getElementById('recordDetail');
  if(!rec){
    detail.innerHTML = `<div class="rd-head"><div class="date">${viewMonth+1}월 ${day}일</div></div>
      <p style="color:var(--text-dim);padding:20px 0;">이 날에는 아직 기록이 없어요.</p>`;
    return;
  }
  const tags = rec.ratio ? Object.keys(rec.ratio).map(k=>`<span class="rd-tag">#${k.replace(/ /g,'')}</span>`).join('') : '';
  detail.innerHTML = `
    <div class="rd-head">
      <div class="date">${viewMonth+1}월 ${day}일</div>
      <div class="time">${rec.time||''}</div>
    </div>
    <div class="rd-mood">${moodEmoji[rec.category]||'😊'} ${rec.mood||''}</div>
    <div class="rd-tags">${tags}</div>
    <div class="rd-text">${rec.comfortMessage||''}</div>
    <div class="rd-songs">
      <div class="rd-song-thumb"></div>
      <div class="rd-song-thumb"></div>
      <div class="rd-song-thumb"></div>
      <div class="rd-song-thumb"></div>
      <button class="rd-play-all">▶</button>
    </div>`;
}

document.getElementById('prevMonth').addEventListener('click', ()=>{
  viewMonth--; if(viewMonth<0){viewMonth=11; viewYear--;} render();
});
document.getElementById('nextMonth').addEventListener('click', ()=>{
  viewMonth++; if(viewMonth>11){viewMonth=0; viewYear++;} render();
});

init();
