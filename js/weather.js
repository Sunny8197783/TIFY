// js/weather.js

// 1. 날씨 상태(한글)에 따라 예쁜 이모지 아이콘을 반환하는 함수
function getWeatherIcon(condition) {
  if (!condition) return '☁️';
  if (condition.includes('맑') || condition.includes('해')) return '☀️';
  if (condition.includes('구름') || condition.includes('흐')) return '☁️';
  if (condition.includes('비')) return '🌧️';
  if (condition.includes('눈')) return '❄️';
  if (condition.includes('천둥') || condition.includes('번개')) return '⛈️';
  return '🌫️'; // 기본값
}

// 2. 내 진짜 위치(위도, 경도)로 백엔드 서버에 날씨 요청하기
async function fetchRealWeather(lat, lon) {
  try {
    const url = `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("서버에서 날씨를 가져오지 못했습니다.");
    return await response.json();
  } catch (error) {
    console.error("날씨 API 호출 에러:", error);
    return null;
  }
}

// 3. 서버에서 받은 진짜 날씨 데이터를 화면(HTML)에 그리기
function renderWeather(weatherData) {
  if (!weatherData) return;

  // 🚨 [핵심 수정 부분] 팀원분이 깎아둔 깔끔한 백엔드 데이터 구조에 맞춤!
  const temp = Math.round(weatherData.temp); // 온도
  const desc = weatherData.description; // 날씨 상세 설명 (예: 튼구름)
  const condition = weatherData.weather; // 날씨 상태 (예: 흐림)
  const loc = weatherData.city; // 동네 이름
  const icon = getWeatherIcon(condition); // 한글 상태에 맞춰 아이콘 변환

  // 화면의 아이디(ID)를 찾아서 텍스트 바꿔치기
  const ic = document.getElementById('wIcon');
  const tp = document.getElementById('wTemp');
  const ds = document.getElementById('wDesc');
  const lc = document.getElementById('wLoc');

  if(ic) ic.textContent = icon;
  if(tp) tp.textContent = temp + '°';
  if(ds) ds.textContent = desc;
  if(lc) lc.textContent = '📍 ' + loc;

  // 상단 홈 배너 업데이트
  const banner = document.getElementById('bannerText');
  if(banner){
    const bannerIcon = document.querySelector('.weather-banner .ic');
    if(bannerIcon) bannerIcon.textContent = icon;
    banner.textContent = `오늘은 ${desc} · ${temp}°`;
  }
}

// 4. 내 위치 추적을 시작하고 날씨 앱 실행하는 핵심 함수
function initWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`📍 내 위치 확인 완료: 위도 ${lat}, 경도 ${lon}`);

        const weatherData = await fetchRealWeather(lat, lon);
        renderWeather(weatherData);
      },
      async (error) => {
        console.warn("위치 권한이 거부되었습니다. 기본 위치(서울) 날씨를 보여줍니다.");
        const weatherData = await fetchRealWeather(37.5665, 126.9780);
        renderWeather(weatherData);
      }
    );
  } else {
    console.error("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
  }
}

// 스크립트 실행
initWeather();