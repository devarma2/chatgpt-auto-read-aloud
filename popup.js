const checkbox = document.getElementById('enabled');
chrome.storage.sync.get({enabled:true}, s => checkbox.checked = s.enabled);
checkbox.addEventListener('change', () => chrome.storage.sync.set({enabled: checkbox.checked}));
