chrome.contextMenus.create({
  id: 'my-extension',
  title: 'Download with VDtN',
  contexts: ['link', 'selection', 'video'],  // video에서도 컨텍스트 메뉴가 나타남
});

const resolutions = [
  'best', '2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p', 'audio-m4a', 'audio-mp3'
];

resolutions.forEach(function(resolution) {
  chrome.contextMenus.create({
    parentId: 'my-extension',
    id: resolution,
    title: resolution,
    type: 'radio',
    contexts: ['link', 'selection', 'video'],  // video에서도 해당 화질 선택이 가능하게 함
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (resolutions.includes(info.menuItemId)) {
    chrome.storage.sync.get(['restUrl', 'id', 'pw'], function(options) {
      let url = null;
      if (info.linkUrl) {
        url = info.linkUrl;
      } else if (info.selectionText && isUrl(info.selectionText)) {
        url = info.selectionText;
      } else if (info.srcUrl && info.mediaType === 'video') {
        // 동영상에서 우클릭한 경우 video의 srcUrl을 가져옴
        url = info.srcUrl;
      }

      if (url) {
        const request = new Request(options.restUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({
            url: url,
            resolution: info.menuItemId,
            id: options.id,
            pw: options.pw,
          })
        });

        fetch(request);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showMenu') {
    chrome.contextMenus.update('my-extension', {
      visible: true,
      targetUrlPatterns: [request.url],
    });
    resolutions.forEach(function(resolution) {
      chrome.contextMenus.update(resolution, {
        checked: resolution === 'best',
      });
    });
  } else if (request.action === 'hideMenu') {
    chrome.contextMenus.update('my-extension', { visible: false });
  }
});

function isUrl(text) {
  const pattern = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(text);
}
