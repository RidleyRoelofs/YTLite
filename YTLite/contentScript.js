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
            updateDOM(url);
        }
    });
    const curateShorts = async (url) => {
        
        if (myPreferenceState.shorts === "off") {
            console.log("I think shorts are enabled");
            return ;
        }
        if (url.includes("shorts")) {
            var redirLink = chrome.runtime.getURL("assets/redirect.html");
            console.log(redirLink);
            window.location.href = redirLink;
            return ;
        } 

        var shortsContainers = Array.from(document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]'));

        while (!shortsContainers || shortsContainers.length < 2) {
            await new Promise(resolve => setTimeout(resolve, 500));
            shortsContainers = Array.from(document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]'));

        }

        console.log(shortsContainers.length);
        var shortsContents = [];
        shortsContainers.forEach(function(element) {
            const contentsDiv = element.querySelector('div#contents');
            const headerDiv = element.querySelector('div#rich-shelf-header');
            const footerDiv = element.querySelector('div#button-container');
            shortsContents.push(contentsDiv);
            shortsContents.push(headerDiv);
            shortsContents.push(footerDiv);
        });

        shortsContents.forEach(function(element) {
            element.style.display = "none";
        });
        
    }

    const updateDOM = (url) => {
        console.log("updating dom you fuck");
        curateShorts(url);
    }
    const initializePage = () => {
        
        chrome.storage.sync.get("buttonStateShorts", function(data) {
            // If a button state was saved, set the toggle button to that state
            if (data.buttonStateShorts) {
                console.log("I set shorts state to");
                console.log(data.buttonStateShorts);
                myPreferenceState.shorts = data.buttonStateShorts;
            }
            chrome.storage.sync.get("buttonStateRecs", function(data) {
                // If a button state was saved, set the toggle button to that state
                if (data.buttonStateRecs) {
                    myPreferenceState.recommended = data.buttonStateRecs;
                }
                chrome.storage.sync.get("buttonStateAll", function(data) {
                    // If a button state was saved, set the toggle button to that state
                    if (data.buttonStateAll) {
                        myPreferenceState.all = data.buttonStateAll;
                    }
                    var url = window.location.href;
                    updateDOM(url);
                });
            });
        });
        
    }
    initializePage();
    
})();

