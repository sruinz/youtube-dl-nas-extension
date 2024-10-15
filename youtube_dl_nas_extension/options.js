document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#options');
  const saveButton = document.querySelector('.submit-button'); // Save 버튼 요소
  const togglePassword = document.querySelector('#togglePassword'); // 비밀번호 아이콘
  const pwField = document.querySelector('#pw'); // 비밀번호 입력 필드

  chrome.storage.sync.get(['restUrl', 'id', 'pw'], function(items) {
    if (items.restUrl) {
      form.restUrl.value = items.restUrl;
    }
    if (items.id) {
      form.id.value = items.id;
    }
    // 비밀번호는 항상 공란으로 표시
    form.pw.value = ''; 
  });

  // 비밀번호 표시/숨기기 기능
  togglePassword.addEventListener('click', function() {
    if (pwField.type === 'password') {
      pwField.type = 'text';
      togglePassword.textContent = '👁️‍🗨️'; // 비밀번호 표시 중
    } else {
      pwField.type = 'password';
      togglePassword.textContent = '👁️'; // 비밀번호 숨기기 중
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    let restUrl = form.restUrl.value.trim();
    const id = form.id.value.trim();
    const pw = form.pw.value.trim();
    let valid = true;

    // 입력 필드 유효성 검사
    if (!restUrl) {
      valid = false;
      form.restUrl.style.border = "1px solid red"; // 빨간 테두리
    } else {
      form.restUrl.style.border = ""; // 테두리 초기화
    }

    if (!id) {
      valid = false;
      form.id.style.border = "1px solid red"; // 빨간 테두리
    } else {
      form.id.style.border = ""; // 테두리 초기화
    }

    if (!pw) {
      valid = false;
      form.pw.style.border = "1px solid red"; // 빨간 테두리
    } else {
      form.pw.style.border = ""; // 테두리 초기화
    }

    // 모든 필드가 채워졌을 때만 저장
    if (valid) {
      // "/youtube-dl/rest"가 없으면 추가
      if (!restUrl.endsWith('/youtube-dl/rest')) {
        // 마지막 슬래시를 제거하고 추가
        restUrl = restUrl.replace(/\/+$/, ''); // 중복된 슬래시 제거
        restUrl += '/youtube-dl/rest';
      }

      chrome.storage.sync.set({ restUrl: restUrl, id: id, pw: pw }, function() {
        // Save 버튼의 텍스트를 '저장 완료'로 변경
        saveButton.textContent = '저장 완료!';
        saveButton.disabled = true; // 저장 완료 후 버튼 비활성화

        // 1초 후에 Save 버튼 원래 텍스트로 복원 및 재활성화
        setTimeout(function() {
          saveButton.textContent = '저장';
          saveButton.disabled = false;
          window.close(); // 옵션 창 닫기
        }, 1000);
      });
    } else {
      // 채워지지 않은 필드가 있을 경우 알림 표시
      alert('모든 필드를 채워주세요.');
    }
  });
});
