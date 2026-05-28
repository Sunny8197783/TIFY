// ⚠️ 주의: 구글 AI 스튜디오에서 발급받은 실제 Gemini API 키를 "코드" 대신 여기에 입력해야 정상 작동합니다.
const GEMINI_API_KEY = "AIzaSyB1y3hECalRo5y35r7XLH9O9-KNzvVPs4c"; 

/**
 * [핵심 기능] 사용자가 입력한 분위기에 맞춰 AI에게 음악을 추천받는 비동기 함수
 * 버튼의 onclick="getMusicRecommendation()" 에 의해 실행됩니다.
 */
async function getMusicRecommendation() {
    // 1. HTML 화면에서 제어할 요소들(입력창, 결과창, 로딩창)을 선택합니다.
    const userInputField = document.getElementById('userInput');
    const resultBox = document.getElementById('resultBox');
    const loader = document.getElementById('loader');

    // [방어적 코드] 만약 HTML에 해당 ID를 가진 요소가 없다면 에러를 내고 함수를 강제 종료합니다.
    if (!userInputField || !resultBox || !loader) {
        console.error("필수 HTML 요소가 로드되지 않았습니다. ID를 확인하세요.");
        return;
    }

    // 2. 사용자가 입력한 텍스트를 가져오고, 앞뒤 쓸데없는 공백을 제거(.trim)합니다.
    const userInput = userInputField.value.trim();
    
    // [예외 처리] 입력창이 비어있다면 경고창을 띄우고 함수를 종료합니다.
    if (!userInput) {
        alert('내용을 입력해주세요!');
        return;
    }

    // 3. 통신 시작 전 화면 상태 초기화
    loader.style.display = "block";  // 빙글빙글 도는 로딩 애니메이션을 화면에 표시
    resultBox.style.display = "none"; // 이전에 검색했던 결과창이 있다면 숨김

    // 4. 구글 Gemini 2.5 Flash 모델에게 요청 보낼 주소(URL) 설정
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        // 5. fetch를 사용해 구글 AI 서버에 POST 방식으로 음악 추천 데이터를 요청합니다.
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // 데이터가 JSON 형식임을 서버에 알림
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        // 구글 AI에게 내리는 상세한 명령어(프롬프트) 설정
                        text: `당신은 세계 최고의 음악 추천 전문가입니다. 사용자의 요청 분위기에 맞춰 음악 3곡을 추천해주세요.
                        
                        ⚠️ 중요 답변 형식 규칙:
                        반드시 아래의 HTML 구조를 지켜서 답변해주세요. 다른 설명글은 제외하고 오직 이 HTML 태그들만 출력하세요.
                        유튜브 링크 주소는 'https://www.youtube.com/results?search_query=노래제목+가수이름' 형식으로 자동 생성해서 href와 data-url에 넣어주세요. 공백은 +로 연결해야 합니다.

                        [출력할 HTML 형식 예시]:
                        <div class="music-item">
                            <strong>1. 노래제목 - 아티스트</strong> 
                            <a href="https://www.youtube.com/results?search_query=Dynamite+BTS" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <button class="share-btn" data-url="https://www.youtube.com/results?search_query=Dynamite+BTS" data-title="Dynamite - BTS">🔗 친구에게 공유</button>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>
                        <div class="music-item">
                            <strong>2. 노래제목 - 아티스트</strong> 
                            <a href="유튜브주소" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <button class="share-btn" data-url="유튜브주소" data-title="노래제목 - 아티스트">🔗 친구에게 공유</button>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>
                        <div class="music-item">
                            <strong>3. 노래제목 - 아티스트</strong> 
                            <a href="유튜브주소" target="_blank" class="youtube-btn">▶ 유튜브 검색</a>
                            <button class="share-btn" data-url="유튜브주소" data-title="노래제목 - 아티스트">🔗 친구에게 공유</button>
                            <p>이 곡을 추천하는 이유 설명</p>
                        </div>

                        사용자 요청 분위기: ${userInput}`
                    }]
                }]
            })
        });

        // 6. 구글 서버로부터 받은 응답을 우리가 읽을 수 있는 JSON 객체로 변환합니다.
        const data = await response.json();
        
        // 7. AI의 답변 데이터가 정상적으로 들어있는지 구조를 확인합니다.
        if (data.candidates && data.candidates[0].content.parts[0]) {
            let recommendationHtml = data.candidates[0].content.parts[0].text;
            
            // [정제 작업] AI가 답변에 마크다운 기호(```html ... ```)를 가끔 섞어주므로, 정규식으로 지워버립니다.
            recommendationHtml = recommendationHtml.replace(/```html/g, '').replace(/```/g, '').trim();

            // AI가 예쁘게 만들어 준 HTML 코드를 결과 박스에 그대로 삽입하여 화면에 그려줍니다.
            resultBox.innerHTML = recommendationHtml;
            resultBox.style.display = "block"; // 결과 박스를 화면에 표시
        } else {
            // 구조가 다르거나 응답에 문제가 있다면 에러 메시지 표시
            resultBox.innerHTML = "추천을 가져오지 못했습니다. 다시 시도해주세요.";
            resultBox.style.display = "block";
        }
    } catch (error) {
        // 8. 인터넷 끊김, API 키 오류 등 네트워크 통신 중에 진짜 에러가 발생한 경우 처리
        console.error("에러 발생:", error);
        resultBox.innerHTML = "오류가 발생했습니다. API 키나 네트워크를 확인하세요.";
        resultBox.style.display = "block";
    } finally {
        // 9. 통신이 성공했든 실패했든 무조건 마지막에 실행되는 블록
        loader.style.display = "none"; // 통신이 다 끝났으므로 빙글빙글 로딩바를 숨깁니다.
    }
}


/**
 * =========================================================================
 * [공유 기능] 이벤트 위임(Event Delegation) 기법
 * AI가 나중에 새로 만들어 낸 '🔗 친구에게 공유' 버튼들의 클릭을 감시하는 코드입니다.
 * =========================================================================
 */
document.getElementById('resultBox').addEventListener('click', async (event) => {
    
    // 사용자가 클릭한 요소가 'share-btn'이라는 클래스를 가지고 있는지 검사합니다.
    if (event.target && event.target.classList.contains('share-btn')) {
        
        // 버튼에 심어져 있는 데이터(유튜브 주소, 음악 제목)를 가져옵니다.
        const shareUrl = event.target.getAttribute('data-url');
        const shareTitle = event.target.getAttribute('data-title');

        // [조건 1] 스마트폰 브라우저 환경인 경우 (카카오톡, 문자, SNS 등 기기 자체 공유창 열기)
        if (navigator.share) {
            try {
                // 스마트폰의 기본 공유 시스템 팝업을 호출합니다.
                await navigator.share({
                    title: shareTitle,
                    text: `이 노래 좋네요! 같이 들어요 🎧\n[${shareTitle}]`,
                    url: shareUrl,
                });
            } catch (error) {
                // 사용자가 공유창을 열었다가 취소(뒤로가기) 버튼을 누른 경우의 예외 처리
                console.log('공유 취소 또는 에러:', error);
            }
        } 
        // [조건 2] 모바일 공유 기능이 없는 PC 브라우저 환경인 경우 (클립보드에 링크 복사하기)
        else {
            try {
                // 사용자의 클립보드에 유튜브 주소를 자동으로 복사해 넣습니다.
                await navigator.clipboard.writeText(shareUrl);
                alert(`📋 [${shareTitle}]\n유튜브 링크가 복사되었습니다!\n친구에게 붙여넣기(Ctrl+V)해서 공유해보세요.`);
            } catch (err) {
                // 복사 권한 거부 등 브라우저 에러가 났을 때 처리
                alert('링크 복사에 실패했습니다.');
            }
        }
    }
});