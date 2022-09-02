"use strict";
const globalSwitch = document.querySelector("#globalSwitch");
const myText = document.querySelector("#base");
chrome.storage.sync.get("globalSwitch", (data) => {
    if (data.globalSwitch !== false) {
        chrome.storage.sync.set({ globalSwitch: true });
        globalSwitch.checked = true;
    }
});
globalSwitch.addEventListener("click", () => {
    chrome.storage.sync.set({ globalSwitch: globalSwitch.checked });
});
