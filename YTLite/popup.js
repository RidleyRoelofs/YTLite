// Get a reference to the toggle button
const toggleButtonShorts = document.getElementById('toggle-button-shorts');
const toggleButtonRecs = document.getElementById('toggle-button-recs');
const toggleButtonAll = document.getElementById('toggle-button-all');
const slideTime = 11

document.addEventListener("DOMContentLoaded", function() {

  chrome.storage.sync.get("buttonStateShorts", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateShorts) {
      var before  = document.getElementById("toggle-button-shorts").style.display 
      document.getElementById("toggle-button-shorts").style.display = "none";
      document.getElementById("toggle-button-shorts").classList.add(data.buttonStateShorts);
      
      setTimeout(() => {
        document.getElementById("toggle-button-shorts").style.display = before;
      }, slideTime);

      
    }
  });

  chrome.storage.sync.get("buttonStateRecs", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateRecs) {
      var before  = document.getElementById("toggle-button-recs").style.display
      document.getElementById("toggle-button-recs").style.display = "none";
      document.getElementById("toggle-button-recs").classList.add(data.buttonStateRecs);

      setTimeout(() => {
        document.getElementById("toggle-button-recs").style.display = before;
      }, slideTime);
    }
  });

  chrome.storage.sync.get("buttonStateAll", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateAll) {
      var before  = document.getElementById("toggle-button-all").style.display
      document.getElementById("toggle-button-all").style.display = "none";
      document.getElementById("toggle-button-all").classList.add(data.buttonStateAll);

      setTimeout(() => {
        document.getElementById("toggle-button-all").style.display = before;
      }, slideTime);
    }
  });

  //sendUserSettings();
});


toggleButtonShorts.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonShorts.classList.toggle('on');
  saveButtonAction(toggleButtonShorts);
  sendUserSettings();
});

toggleButtonRecs.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonRecs.classList.toggle('on');
  saveButtonAction(toggleButtonRecs);
  sendUserSettings();
});

toggleButtonAll.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonAll.classList.toggle('on');
  saveButtonAction(toggleButtonAll);
  sendUserSettings();
});

function saveButtonAction(element) {
  //var button = document.getElementById(id);
  var buttonState = element.classList.contains("on") ? "on" : "off";
  switch (element.id) {
    case "toggle-button-shorts":
      chrome.storage.sync.set({buttonStateShorts: buttonState});
      break;
    case "toggle-button-recs":
      chrome.storage.sync.set({buttonStateRecs: buttonState});
      break;
    case "toggle-button-all":
      chrome.storage.sync.set({buttonStateAll: buttonState});
      break;
    default: 
      console.log(`Error: not a valid element id: ${element.id}.`);
  }
}

function sendUserSettings() {
  var msg = {
    type: "feature-settings",
    shorts: "off",
    recommended: "off",
    all: "off",
    url: "",
  }
  if (toggleButtonShorts.classList.contains('on')) {
    
    msg.shorts = "on"
  } 

  if (toggleButtonRecs.classList.contains('on')) {
    
    msg.recommended = "on"
  } 

  if (toggleButtonAll.classList.contains('on')) {
    
    msg.all = "on"
  } 
  chrome.tabs.query({url: "https://www.youtube.com/*"}, function(tabs) {
    // Send a message to the content script in each tab
    
    tabs.forEach(function(tab) {
      msg.url = tab.url
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
}

//delete the href /shorts ytd-rich-section-renderer