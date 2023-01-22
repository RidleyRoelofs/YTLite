chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
      var msg = {
        type: "feature-settings",
        shorts: "off",
        recommended: "off",
        all: "off",
        url: tab.url,
      }
      console.log("youtube page")
    }
  });