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
