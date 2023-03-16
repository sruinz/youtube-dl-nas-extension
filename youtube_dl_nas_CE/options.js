document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#options');
  chrome.storage.sync.get(['restUrl', 'id', 'pw'], function(items) {
    if (items.restUrl) {
      form.restUrl.value = items.restUrl;
    }
    if (items.id) {
      form.id.value = items.id;
    }
    if (items.pw) {
      form.pw.value = items.pw.replace(/./g, '*'); // pw 필드 마스킹
    }
  });
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const restUrl = form.restUrl.value;
    const id = form.id.value;
    const pw = form.pw.value;
    chrome.storage.sync.set({restUrl: restUrl, id: id, pw: pw}, function() {
      alert('Options saved!');
    });
  });
});
