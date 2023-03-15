let isBlockingEnabled = false;

chrome.storage.sync.get("buttonStateAll", function(data) {
  // If a button state was saved, set the toggle button to that state
  if (data.buttonStateAll) {
    if (data.buttonStateAll === 'on') {
      isBlockingEnabled = true;
    } else {
      isBlockingEnabled = false;
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggle-blocking') {
    if (request.state === 'on') {
      isBlockingEnabled = true;
      
    } else {
      isBlockingEnabled = false;
    }
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  // Check blocking state before redirecting
  if (isBlockingEnabled && details.url.includes('www.youtube.com')) {
    var redirLink = chrome.runtime.getURL("assets/redirect_youtube.html");
    chrome.tabs.update(details.tabId, {url: redirLink});
  }
}, {url: [{hostSuffix: 'youtube.com'}]});

