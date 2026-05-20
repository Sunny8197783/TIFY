// js/weather.js — 사이드바 + 홈 배너에 오늘의 날씨 표시
// 🔑 [API 연결 자리] OpenWeather API
// const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
// async function fetchRealWeather(lat, lon){
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`;
//   const res = await fetch(url);
//   return await res.json();
// }

const WEATHER_PRESETS = [
  {key:'sunny',  icon:'☀️', desc:'맑고 화창해요',     temp:22, loc:'서울'},
  {key:'cloudy', icon:'☁️', desc:'구름이 많은 하루',  temp:18, loc:'서울'},
  {key:'rainy',  icon:'🌧️', desc:'비가 내리고 있어요', temp:15, loc:'서울'},
  {key:'snowy',  icon:'❄️', desc:'눈이 내려요',       temp:-2, loc:'서울'},
  {key:'night',  icon:'🌙', desc:'고요한 밤이에요',   temp:14, loc:'서울'},
  {key:'misty',  icon:'🌫️', desc:'안개가 자욱해요',   temp:12, loc:'서울'}
];

function getTodayWeather(){
  // 임시방편: 날짜 기반으로 고정값 (같은 날엔 같은 날씨)
  const cached = sessionStorage.getItem('todayWeather');
  if(cached) return JSON.parse(cached);
  const d = new Date();
  const idx = (d.getDate() + d.getMonth()) % WEATHER_PRESETS.length;
  const w = {...WEATHER_PRESETS[idx]};
  w.temp = w.temp + Math.floor(Math.random()*4 - 2);
  sessionStorage.setItem('todayWeather', JSON.stringify(w));
  return w;
}

function renderWeather(){
  const w = getTodayWeather();
  const ic = document.getElementById('wIcon');
  const tp = document.getElementById('wTemp');
  const ds = document.getElementById('wDesc');
  const lc = document.getElementById('wLoc');
  if(ic) ic.textContent = w.icon;
  if(tp) tp.textContent = w.temp + '°';
  if(ds) ds.textContent = w.desc;
  if(lc) lc.textContent = '📍 ' + w.loc;

  const banner = document.getElementById('bannerText');
  if(banner){
    document.querySelector('.weather-banner .ic').textContent = w.icon;
    banner.textContent = `오늘은 ${w.desc} · ${w.temp}°`;
  }
}
renderWeather();
window.TIFY_WEATHER = getTodayWeather();
