// js/ai.js — 감정 분석 화면 (API 자리만 표시, 실제론 시뮬레이션)
const userMood = sessionStorage.getItem('userMood') || '';

async function analyzeWithAI(text){
  // ============================================
  // 🔑 [API 연결 자리] OpenAI GPT API 호출
  // ============================================
  // const res = await fetch('/api/analyze', {
  //   method:'POST',
  //   headers:{'Content-Type':'application/json'},
  //   body: JSON.stringify({ text })
  // });
  // const data = await res.json();
  // return data; // { emotion, ratio:{...}, comfortMessage, category }
  // ============================================

  // ▼ API 연결 전 임시 시뮬레이션 결과
  await new Promise(r=>setTimeout(r, 100));
  let category = 'sad';
  if(/행복|기쁨|좋|happy/i.test(text)) category='happy';
  else if(/새벽|밤|night/i.test(text)) category='dawn';
  else if(/집중|공부|focus/i.test(text)) category='focus';
  else if(/멍|쉬|chill/i.test(text)) category='chill';
  else if(/설레|love|좋아해/i.test(text)) category='love';
  return {
    category,
    ratio:{ '피로감':76, '외로움':52, '안정 필요':80, '우울감':45 },
    comfortMessage:'오늘 하루도 정말 수고했어요. 천천히 호흡하며 이 노래들과 함께 쉬어가요. ☕'
  };
}

window.addEventListener('load', async ()=>{
  // 막대 애니메이션 시작
  requestAnimationFrame(()=>{
    document.querySelectorAll('.bar-fill').forEach(el=>{
      el.style.width = el.dataset.pct + '%';
    });
  });

  const result = await analyzeWithAI(userMood);
  sessionStorage.setItem('analysisResult', JSON.stringify(result));

  // 3초 뒤 결과 페이지로
  setTimeout(()=>{ location.href='result.html'; }, 3000);
});
