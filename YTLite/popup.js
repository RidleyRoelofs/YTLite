// Get a reference to the toggle button
const toggleButtonShorts = document.getElementById('toggle-button-shorts');
const toggleButtonRecs = document.getElementById('toggle-button-recs');
const toggleButtonAll = document.getElementById('toggle-button-all');
const slideTime = 5

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
      chrome.storage.sync.set({buttonStateAll: buttonState}, function() {
        chrome.runtime.sendMessage({action: 'toggle-blocking', state: buttonState});
        updateYoutubeAccess();
      }); 
      break;
    default: 
      console.log(`Error: not a valid element id: ${element.id}.`);
  }
}


function closeTabsAndSaveInfo(tabs) {
  console.log("got to close tabs func");
  let closedTabList = [];
  tabs.forEach(function(tab) {
    const windowId = tab.windowId;
    const url = tab.url;
    closedTabList.push({windowId: windowId, url: url});
  });
  tabs.forEach(function(tab) {
    const windowId = tab.windowId;
    const url = tab.url;
    chrome.tabs.remove(tab.id, function() {});
  });
  chrome.storage.sync.set({closedYtTabs: JSON.stringify(closedTabList)});
  
}

function reopenClosedTabs() {
  chrome.storage.sync.get("closedYtTabs", function(data) {
    console.log("got to reopen func")
    if (data.closedYtTabs) {
      var theTabList = JSON.parse(data.closedYtTabs);
      console.log(theTabList);
      if (theTabList.length === 0) {
        return;
      }
      chrome.windows.getAll({populate: true}, function(windows) {
        var newWindows = [];
        for (const closedTabInfo of theTabList) {
          const window = windows.find(window => window.id === closedTabInfo.windowId);
          if (!window) {
            var newWindow = true;
            var newWindowInd = -1;
            var i = 0;
            newWindows.forEach(function(winInfo) {
              if (winInfo.oldWid === closedTabInfo.windowId) {
                newWindow = false;
                newWindowInd = i;
              }
              i += 1;
            });

            if (newWindow) {
              chrome.windows.create({url: closedTabInfo.url}, function(window) {
                newWindows.push({oldWid: closedTabInfo.windowId, newWid: window.id});
              });
            } else {
              newWinInfo = newWindows[newWindowInd];
              chrome.tabs.create({url: closedTabInfo.url, windowId: winInfo.newWid, active: false});
            }
            return;
          }
          chrome.tabs.create({url: closedTabInfo.url, windowId: closedTabInfo.windowId, active: false});
      
        }
    
      });
    }
  });
      
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
      msg.url = tab.url;
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
}

function updateYoutubeAccess() {
  
  var allowYT = true;
  if (toggleButtonAll.classList.contains('on')) {
    allowYT = false;
  }
  if (allowYT) {
    reopenClosedTabs();
    return;
  }
  chrome.tabs.query({url: "https://www.youtube.com/*"}, function(tabs) {
    closeTabsAndSaveInfo(tabs);
  });
}

//TODO: add listener to update youtube access that stop new tabs
// TODO: remove the shorts button from the youtube menu
// TODO: remove recomended from home page and video player
// TODO: right now I have the tab that i am on refreshing when the button state changes, but I need to refresh every single youtube tab....