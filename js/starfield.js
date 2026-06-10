/**
 * js/starfield.js — 모든 페이지에 별 하늘 + 별똥별
 * 어디서 import하든 1번만 초기화됨
 */
(function () {
  if (window.__tifyStarfield) return;
  window.__tifyStarfield = true;

  function init() {
    if (document.getElementById('tify-starfield')) return;

    // 컨테이너
    const container = document.createElement('div');
    container.id = 'tify-starfield';
    Object.assign(container.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    // 깜빡이는 정적 별 80개
    const STAR_COUNT = 80;
    let stars = '';
    for (let i = 0; i < STAR_COUNT; i++) {
      const size  = (Math.random() * 1.8 + 0.6).toFixed(2);
      const left  = (Math.random() * 100).toFixed(1);
      const top   = (Math.random() * 100).toFixed(1);
      const delay = (Math.random() * 6).toFixed(1);
      const dur   = (Math.random() * 4 + 3).toFixed(1);
      stars += `<div class="tify-star" style="width:${size}px;height:${size}px;left:${left}vw;top:${top}vh;animation-delay:${delay}s;animation-duration:${dur}s"></div>`;
    }
    container.innerHTML = stars;

    // 스타일 주입
    if (!document.getElementById('tify-starfield-style')) {
      const style = document.createElement('style');
      style.id = 'tify-starfield-style';
      style.textContent = `
        #tify-starfield .tify-star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: tifyTwinkle linear infinite alternate;
          will-change: opacity, transform;
        }
        @keyframes tifyTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.25); }
        }
        #tify-starfield .tify-shooting {
          position: absolute;
          width: 2px; height: 2px;
          background: linear-gradient(-45deg, #ffffff, rgba(180,130,255,0));
          filter: drop-shadow(0 0 8px #fff) drop-shadow(0 0 14px rgba(180,130,255,0.85));
          border-radius: 999px;
          animation-name: tifyTail, tifyShoot;
          animation-timing-function: ease-in-out;
          animation-fill-mode: forwards;
        }
        @keyframes tifyTail  {
          0% { width: 0; }
          30% { width: 140px; }
          100% { width: 0; }
        }
        @keyframes tifyShoot {
          0%   { transform: translateX(0)   translateY(0)   rotate(45deg); opacity: 1; }
          100% { transform: translateX(900px) translateY(900px) rotate(45deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(container);

    // 주기적인 별똥별
    function shoot() {
      const star = document.createElement('div');
      star.className = 'tify-shooting';
      star.style.left = (Math.random() * 100) + 'vw';
      star.style.top  = (Math.random() * 40)  + 'vh';
      const dur = (Math.random() * 1.5 + 2.5).toFixed(2);
      star.style.animationDuration = `${dur}s, ${dur}s`;
      container.appendChild(star);
      setTimeout(() => star.remove(), dur * 1000 + 300);
    }

    setTimeout(shoot, 800);
    // 4~7초 간격으로 1개씩
    setInterval(() => { if (Math.random() < 0.6) shoot(); }, 3500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();