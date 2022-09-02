
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "check") checkGlobalOrCurrent(sendResponse);
  else if (message.type === "fetch") fich(sendResponse, message.url);
  else if (message.type === "toggleGlobal") toggleGlobal(sendResponse);
  return true;
});

function checkGlobalOrCurrent(func: Function) {
  chrome.tabs.query({ active: true }, () => {
    chrome.storage.sync.get(["globalSwitch"], (data) => {
      func(data.globalSwitch === true);
    });
  });
}

function fich(func: Function, url: string) {
  fetch(url)
    .then((r) => r.text())
    .then((html) => func(html));
}

function toggleGlobal(func: Function) {
  chrome.storage.sync.get("globalSwitch", (data) => {
    data["globalSwitch"] = !data["globalSwitch"];
    chrome.storage.sync.set(data);
    func(data["globalSwitch"]);
  });
}