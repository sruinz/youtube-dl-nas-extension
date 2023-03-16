chrome.contextMenus.create({
  id: 'my-extension',
  title: 'Download with youtube-dl',
  contexts: ['link', 'selection'],
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
    contexts: ['link', 'selection'],
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
