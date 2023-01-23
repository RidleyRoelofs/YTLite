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
        /*
        var shortsLinkElement = Array.from(
            document.getElementsByTagName('a')).find(a => a.href.includes('/shorts/')
        );
        while (!shortsLinkElement) {
            await new Promise(resolve => setTimeout(resolve, 500));
            shortsLinkElement = Array.from(
                document.getElementsByTagName('a')).find(a => a.href.includes('/shorts/')
            );
        }
*/
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
        return ;

        var parent = shortsLinkElement.parentElement;
        console.log(parent);

        while (parent && !(parent instanceof HTMLElement &&
                           parent.tagName === 'DIV' &&
                           //(! parent.classList.contains("style-scope ytd-rich-shelf-renderer")) &&
                           parent.getAttribute("id") === "contents"
                           ) ) {
            parent = parent.parentElement;
            console.log(parent);
        }
        
        const shortsVidsElement = parent;

        if (shortsVidsElement) {
            console.log("I'm about to do it mom");
            console.log(shortsVidsElement);
            //parent.remove();
            shortsVidsElement.style.display = "none";
        }

        var sibling = parent;
        while (sibling && !(sibling.tagName === 'DIV' &&
                            sibling.getAttribute("id") === 'rich-shelf-header')) {
            sibling = sibling.previousElementSibling;      
        }
        const shortsVidsHeader = sibling;
        if (shortsVidsHeader) {
            console.log("I'm about to do it mom");
            console.log(shortsVidsHeader);
            //parent.remove();
            shortsVidsHeader.style.display = "none";
        }

        while (sibling && !(sibling.tagName === 'DIV' &&
                            sibling.getAttribute("id") === 'button-container')) {
            sibling = sibling.nextElementSibling;      
        }

        const shortsVidsFooter = sibling;
        if (shortsVidsFooter) {
            console.log("I'm about to do it mom");
            console.log(shortsVidsFooter);
            //parent.remove();
            shortsVidsFooter.style.display = "none";
        }
        //WOW THEy PUT MULTIPLE SHORTS TABS IN THE RECOMENDED
        //NEED to get the list of <a> elements and get them into non sibling groups
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

