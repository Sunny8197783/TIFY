// js/chat.js — 입력 → sessionStorage 저장 → analyzing 페이지로
const form = document.getElementById('inputForm');
const input = document.getElementById('moodInput');
const chips = document.getElementById('chips');
let selectedChips = [];

chips.addEventListener('click', e=>{
  const btn = e.target.closest('.chip');
  if(!btn) return;
  btn.classList.toggle('selected');
  const label = btn.dataset.label;
  if(btn.classList.contains('selected')){
    selectedChips.push(label);
  } else {
    selectedChips = selectedChips.filter(x=>x!==label);
  }
});

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text && selectedChips.length===0){
    input.focus();
    return;
  }
  const finalText = [text, ...selectedChips].filter(Boolean).join(' / ');
  sessionStorage.setItem('userMood', finalText);
  sessionStorage.setItem('moodChips', JSON.stringify(selectedChips));
  location.href = 'analyzing.html';
});
