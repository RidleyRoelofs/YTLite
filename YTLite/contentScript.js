(() => {
    let myPreferenceState = {
        shorts: "off",
        recommended: "off",
        all: "off",
    }
    
    const observer = new MutationObserver((mutationsList, observer) => {
        
        updateDOM(window.location.href);
        
      });
      
    // configure the observer to watch for changes to the DOM tree
    const config = { childList: true, subtree: true };
      
    // start observing the target node for DOM changes
    observer.observe(document.body, config);
    
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        
        const {type, shorts, recommended, all, url} = obj;

        if (type === "feature-settings") {
            
            myPreferenceState = {
                shorts: shorts,
                recommended: recommended,
                all: all,
            }

            updateDOM(url);

            location.reload();
        }
    });
    const curateRecommended = async (url) => {
        
        if (myPreferenceState.recommended === "off") {
            return ;
        }
        
        let itemsDiv = null;
        
        if (url === "https://www.youtube.com/") {
            itemsDiv = document.getElementById("contents");
            if(itemsDiv != null)
                itemsDiv.remove();
                //itemsDiv.style.display = "none";
            
        } else if (url.includes("watch")) {
            itemsDiv = document.getElementById("items");
            if(itemsDiv != null)
                itemsDiv.remove();
            //itemsDiv.style.display = "none";
        }
        
    }
    const curateShorts = async (url) => {
        var turn_off = true;
        if (myPreferenceState.shorts === "off") {
            turn_off = false;
        }
        if (turn_off && url.includes("shorts")) {
            var redirLink = chrome.runtime.getURL("assets/redirect.html");
            window.location.href = redirLink;
            return ;
        } 
        if (!turn_off) {
            return ;
        }
        var shortsContainers = Array.from(document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]'));
        
        var num_tries = 0
        const max_tries = 2;
        while ((!shortsContainers && num_tries < max_tries) || num_tries < max_tries) {
            await new Promise(resolve => setTimeout(resolve, 500));
            shortsContainers = Array.from(document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]'));
            num_tries  = num_tries + 1;
        }
        if (!shortsContainers) {
            return ; 
        }
        
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
            if (turn_off) {
                
                element.style.display = "none";
            } 
            
        });
        
    }

    const updateDOM = (url, callback=null) => {
        
        curateShorts(url);
        curateRecommended(url);
        if(callback) {
            callback();
        }
    }
    const initializePage = () => {
        
        chrome.storage.sync.get("buttonStateShorts", function(data) {
            // If a button state was saved, set the toggle button to that state
            if (data.buttonStateShorts) {
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

