// js/chat.js — 입력 → sessionStorage → analyzing
const form = document.getElementById('inputForm');
const input = document.getElementById('moodInput');
const chips = document.getElementById('chips');
let selectedChips = [];
let selectedMoods = [];

chips.addEventListener('click', e=>{
  const btn = e.target.closest('.chip');
  if(!btn) return;
  btn.classList.toggle('selected');
  const label = btn.dataset.label;
  const mood = btn.dataset.mood;
  if(btn.classList.contains('selected')){
    selectedChips.push(label);
    selectedMoods.push(mood);
  } else {
    selectedChips = selectedChips.filter(x=>x!==label);
    selectedMoods = selectedMoods.filter(x=>x!==mood);
  }
});

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text && selectedChips.length===0){ input.focus(); return; }
  const finalText = [text, ...selectedChips].filter(Boolean).join(' / ');
  sessionStorage.setItem('userMood', finalText);
  sessionStorage.setItem('moodChips', JSON.stringify(selectedMoods));
  location.href = 'analyzing.html';
});
