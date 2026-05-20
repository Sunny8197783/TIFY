// js/record.js — 캘린더 + 통계
const moodEmoji = {happy:'😊', sad:'😢', dawn:'🌙', focus:'🎧', chill:'☁️', love:'💗',
  angry:'😠', anxious:'😰', energetic:'⚡', nostalgic:'📷', lonely:'🥀', rainy:'🌧️'};
const moodLabel = {happy:'행복', sad:'우울', dawn:'새벽감성', focus:'집중', chill:'멍', love:'설렘',
  angry:'분노', anxious:'불안', energetic:'에너지', nostalgic:'추억', lonely:'외로움', rainy:'비'};
let viewYear, viewMonth, selectedDay=null;

function init(){
  const now = new Date();
  viewYear = now.getFullYear(); viewMonth = now.getMonth();
  selectedDay = now.getDate();
  render(); showDetail(selectedDay);
}

function render(){
  const monthName = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'][viewMonth];
  document.getElementById('calMonth').textContent = `${viewYear}년 ${monthName}`;

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
    const isSel = (d===selectedDay);
    const marker = rec ? `<span class="marker">${moodEmoji[rec.category]||'😊'}</span>` : '';
    const cls = ['cal-cell', dow===0?'sun':'', isToday?'today':'', isSel?'selected':''].filter(Boolean).join(' ');
    html += `<div class="${cls}" data-day="${d}">${d}${marker}</div>`;
  }
  grid.innerHTML = html;
  grid.querySelectorAll('.cal-cell[data-day]').forEach(c=>{
    c.addEventListener('click', ()=>{
      selectedDay = parseInt(c.dataset.day);
      render(); showDetail(selectedDay);
    });
  });
  renderStats(records);
}

function renderStats(records){
  const row = document.getElementById('statsRow');
  const counts = {};
  Object.entries(records).forEach(([k,v])=>{
    const [y,m] = k.split('-').map(Number);
    if(y===viewYear && m===viewMonth+1){
      counts[v.category] = (counts[v.category]||0) + 1;
    }
  });
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){
    row.innerHTML = '<span style="color:var(--text-dim);font-size:13px;">아직 기록이 없어요.</span>';
    return;
  }
  row.innerHTML = entries.map(([c,n])=>
    `<div class="stat-pill">${moodEmoji[c]||'😊'} ${moodLabel[c]||c} <strong>${n}</strong></div>`
  ).join('');
}

function showDetail(day){
  const records = JSON.parse(localStorage.getItem('records') || '{}');
  const key = `${viewYear}-${viewMonth+1}-${day}`;
  const rec = records[key];
  const detail = document.getElementById('recordDetail');
  const dateLabel = `${viewMonth+1}월 ${day}일`;
  if(!rec){
    detail.innerHTML = `
      <div class="rd-head"><div class="date">${dateLabel}</div></div>
      <p style="color:var(--text-dim);padding:30px 0;text-align:center;">이 날의 감정 기록이 아직 없어요.<br/>홈에서 오늘의 기분을 입력해보세요.</p>`;
    return;
  }
  const tags = rec.bars ? Object.keys(rec.bars).map(k=>`<span class="rd-tag">#${k.replace(/ /g,'')}</span>`).join('') : '';
  const songsHtml = (rec.songs||[]).map(s=>`
    <div class="rd-song-item">
      <div class="song-thumb" style="width:36px;height:36px;font-size:14px;">🎵</div>
      <div><div class="t">${s.title}</div><div class="a">${s.artist}</div></div>
    </div>`).join('');
  const wIcon = rec.weather ? rec.weather.icon : '';
  detail.innerHTML = `
    <div class="rd-head">
      <div class="date">${dateLabel} ${wIcon}</div>
      <div class="time">${rec.time||''}</div>
    </div>
    <div class="rd-mood">${rec.emoji||'😊'} ${rec.label||''}</div>
    <div class="rd-tags">${tags}</div>
    <div class="rd-text">"${rec.mood||''}"<br/><br/>${rec.comfortMessage||''}</div>
    <div class="rd-songs">${songsHtml}</div>`;
}

document.getElementById('prevMonth').addEventListener('click', ()=>{
  viewMonth--; if(viewMonth<0){viewMonth=11; viewYear--;} selectedDay=null;
  render(); document.getElementById('recordDetail').innerHTML =
    '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">날짜를 선택하면 그날의 감정 기록이 표시돼요.</p>';
});
document.getElementById('nextMonth').addEventListener('click', ()=>{
  viewMonth++; if(viewMonth>11){viewMonth=0; viewYear++;} selectedDay=null;
  render(); document.getElementById('recordDetail').innerHTML =
    '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">날짜를 선택하면 그날의 감정 기록이 표시돼요.</p>';
});

init();
