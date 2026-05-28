
const GEMINI_API_KEY = "AIzaSyB1y3hECalRo5y35r7XLH9O9-KNzvVPs4c"; 

// 사용자가 버튼을 눌렀을 때 작동하는 핵심 비동기(async) 함수
async function getMusicRecommendation() {
    // HTML 요소(입력창, 결과창, 로딩창)를 DOM에서 가져오기
    const userInputField = document.getElementById('userInput');
    const resultBox = document.getElementById('resultBox');
    const loader = document.getElementById('loader');

    // 입력값 검증 (방어적 코드)
    if (!userInputField || !resultBox || !loader) {
        console.error("필수 HTML 요소가 로드되지 않았습니다. ID를 확인하세요.");
        return;
    }

    const userInput = userInputField.value.trim();

    // 예외 처리: 입력창이 비어있으면 경고창을 띄우고 중단	
    if (!userInput) {
        alert('내용을 입력해주세요!');
        return;
    }

    // 화면 상태 초기화: 로딩 애니메이션은 켜고, 이전 결과창은 숨김
    loader.style.display = "block";
    resultBox.style.display = "none";

    // 구글 Gemini 2.5 Flash 모델 통신 주소 (요청 URL)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        // fetch를 이용해 구글 AI 서버에 데이터 요청 시작 (서버 응답을 기다림)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // AI에게 전달할 옵션과 명령어(프롬프트) 설정
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `당신은 세계 최고의 음악 추천 전문가입니다. 사용자의 요청 분위기에 맞춰 음악 3곡을 추천해주세요.
                        
                        ⚠️ 중요 답변 형식 규칙:
                        반드시 아래의 HTML 구조를 지켜서 답변해주세요. 다른 설명글(예: "추천해 드리겠습니다" 등)은 모두 제외하고 오직 이 HTML 태그들만 출력하세요.
                        공백이나 줄바꿈은 자유롭게 하되 구조는 유지해야 합니다.
                        유튜브 링크 주소는 'https://www.youtube.com/results?search_query=노래제목+가수이름' 형식으로 자동 생성해서 href에 넣어주세요. 공백은 +로 연결해야 합니다.

                        [출력할 HTML 형식 예시]:
                        <div class="music-item">
                            <strong>1. 노래제목 - 아티스트</strong> 
                            <a href="https://www.youtube.com/results?search_query=Dynamite+BTS" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>
                        <div class="music-item">
                            <strong>2. 노래제목 - 아티스트</strong> 
                            <a href="유튜브주소" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>
                        <div class="music-item">
                            <strong>3. 노래제목 - 아티스트</strong> 
                            <a href="유튜브주소" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>

                        사용자 요청 분위기: ${userInput}`
                    }]
                }]
            })
        });

        // 서버로부터 받은 응답 데이터를 JSON 형식으로 변환
        const data = await response.json();
        
        // 응답 데이터가 정상적으로 들어왔는지 확인
        if (data.candidates && data.candidates[0].content.parts[0]) {
            let recommendationHtml = data.candidates[0].content.parts[0].text;
            
            /* AI가 답변 양식에 마크다운 기호(```html ... 
```)를 섞어 주는 경우가 있으므로,
               정규식을 사용해 해당 글자들을 깨끗하게 지워주는 정제 작업입니다. */
            recommendationHtml = recommendationHtml.replace(/```html/g, '').replace(/```/g, '').trim();

            // 정제된 HTML 코드를 결과 박스 내부에 삽입하여 화면에 렌더링
            resultBox.innerHTML = recommendationHtml;
            resultBox.style.display = "block"; // 결과창 보여주기
        } else {
            resultBox.innerHTML = "추천을 가져오지 못했습니다. 다시 시도해주세요.";
            resultBox.style.display = "block";
        }
    } catch (error) {
        // 네트워크 오류나 API 키 잘못 입력 등 에러가 발생했을 때 처리
        console.error("에러 발생:", error);
        resultBox.innerHTML = "오류가 발생했습니다. API 키를 확인하세요.";
        resultBox.style.display = "block";
    } finally {
        // 성공하든 실패하든 통신이 끝났으므로 로딩 애니메이션은 종료(숨김)
        loader.style.display = "none";
    }
}