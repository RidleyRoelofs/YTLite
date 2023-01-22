// Get a reference to the toggle button
const toggleButtonShorts = document.getElementById('toggle-button-shorts');
const toggleButtonRecs = document.getElementById('toggle-button-recs');
const toggleButtonAll = document.getElementById('toggle-button-all');


document.addEventListener("DOMContentLoaded", function() {

  chrome.storage.sync.get("buttonStateShorts", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateShorts) {
      
      document.getElementById("toggle-button-shorts").classList.add(data.buttonStateShorts);
    }
  });

  chrome.storage.sync.get("buttonStateRecs", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateRecs) {
      document.getElementById("toggle-button-recs").classList.add(data.buttonStateRecs);
    }
  });

  chrome.storage.sync.get("buttonStateAll", function(data) {
    // If a button state was saved, set the toggle button to that state
    if (data.buttonStateAll) {
      document.getElementById("toggle-button-all").classList.add(data.buttonStateAll);
    }
  });
});


toggleButtonShorts.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonShorts.classList.toggle('on');
  saveButtonAction(toggleButtonShorts);
});

toggleButtonRecs.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonRecs.classList.toggle('on');
  saveButtonAction(toggleButtonRecs);
});

toggleButtonAll.addEventListener('click', () => {
  // Toggle the "on" class on the toggle button
  toggleButtonAll.classList.toggle('on');
  saveButtonAction(toggleButtonAll);
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
  msg = {
    type: "feature-settings",
    shorts: False,
    recommended: False,
    all: False,
  }
  if (toggleButtonShorts.classList.contains('on')) {
    console.log('Toggle button for shorts is toggled on');
    msg.shorts = True
  } 

  if (toggleButtonRecs.classList.contains('on')) {
    console.log('Toggle button for shorts is toggled on');
    msg.recommended = True
  } 

  if (toggleButtonAll.classList.contains('on')) {
    console.log('Toggle button for shorts is toggled on');
    msg.all = True
  } 
  chrome.tabs.query({url: "https://www.youtube.com*"}, function(tabs) {
    // Send a message to the content script in each tab
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
  
}

//delete the href /shorts ytd-rich-section-renderer