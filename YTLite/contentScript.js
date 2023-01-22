(() => {
    let myPreferenceState = {
        shorts: "off",
        recommended: "off",
        all: "off",
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, shorts, recommended, all, url} = obj;

        if (type === "feature-settings") {
            myPreferenceState = {
                shorts: shorts,
                recommended: recommended,
                all: all,
            }
            updateDOM();
        }
    });

    const updateDOM = () => {
        console.log("updating dom you fuck");
    }
    const initializePage = () => {
        
        chrome.storage.sync.get("buttonStateShorts", function(data) {
            // If a button state was saved, set the toggle button to that state
            if (data.buttonStateShorts) {
                myPreferenceState.shorts = data.buttonStateShorts;
            }
        });

        chrome.storage.sync.get("buttonStateRecs", function(data) {
            // If a button state was saved, set the toggle button to that state
            if (data.buttonStateRecs) {
                myPreferenceState.recommended = data.buttonStateRecs;
            }
        });
        
        chrome.storage.sync.get("buttonStateAll", function(data) {
            // If a button state was saved, set the toggle button to that state
            if (data.buttonStateAll) {
                myPreferenceState.all = data.buttonStateAll;
            }
        });

        updateDOM();
    }
    initializePage();
})();

