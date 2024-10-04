chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'findVideos') {
    // 비디오 링크를 찾기 위한 배열
    const videos = [...document.querySelectorAll('video')].map(video => video.src);
    
    // iframe 내의 YouTube 비디오 URL을 추가
    const iframes = [...document.querySelectorAll('iframe')];
    iframes.forEach(iframe => {
      const src = iframe.src;
      // YouTube iframe URL만 추가하고 account.youtube.com은 제외
      if (src.includes('youtube.com') && 
          !src.includes('account.youtube.com') && 
          !src.includes('youtube.com/account') && 
          (src.includes('embed') || src.includes('watch'))) {
        videos.push(src); // YouTube iframe URL 추가
      }
    });
    
    // 비디오 링크가 있는 경우 오버레이를 생성하여 표시
    if (videos.length > 0) {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      overlay.style.color = '#fff';
      overlay.style.zIndex = '9999';
      overlay.style.padding = '20px';
      overlay.style.display = 'flex'; // Flexbox 사용
      overlay.style.flexDirection = 'column'; // 세로 방향으로 정렬
      overlay.style.alignItems = 'center'; // 수평 중앙 정렬
      overlay.style.justifyContent = 'flex-start'; // 세로는 상단 정렬
      overlay.innerHTML = '<h2 style="margin: 0;">Select a video to download:</h2>'; // margin 제거

      videos.forEach((videoUrl) => {
        const videoButton = document.createElement('button');
        videoButton.innerText = videoUrl;
        videoButton.style.color = '#fff';
        videoButton.style.backgroundColor = '#212529'; // 진한 버튼 배경색
        videoButton.style.border = 'none'; // 버튼 테두리 제거
        videoButton.style.padding = '10px 20px'; // 패딩 추가
        videoButton.style.margin = '5px 0'; // 버튼 간격
        videoButton.style.cursor = 'pointer'; // 커서 모양 변경
        videoButton.style.width = '100%'; // 버튼 폭을 100%로 설정
        videoButton.style.borderRadius = '5px'; // 모서리 둥글게 설정
        videoButton.style.fontSize = '16px'; // 글자 크기 조정

        videoButton.onclick = (event) => {
          event.preventDefault(); // 기본 링크 클릭 동작 방지

          // blob URL인지 확인
          if (videoUrl.startsWith('blob:')) {
            // YouTube 비디오 ID 추출
            const videoIdMatch = document.URL.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            if (videoIdMatch) {
              const youtubeUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
              chrome.runtime.sendMessage({ action: 'downloadVideo', url: youtubeUrl });
            } else {
              console.error("YouTube 비디오 URL을 찾을 수 없습니다.");
            }
          } else {
            // 일반 URL인 경우 다운로드 요청
            chrome.runtime.sendMessage({ action: 'downloadVideo', url: videoUrl });
          }

          // 오버레이 닫기
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        };

        overlay.appendChild(videoButton); // 버튼을 오버레이에 추가
      });

      // 오버레이 클릭 시 닫기
      overlay.onclick = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      document.body.appendChild(overlay);
    } else {
      console.log("No videos found on this page.");
    }
  }
});
