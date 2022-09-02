"use strict";
const translator = document.createElement("div");
translator.setAttribute("id", "translatorArea");
translator.classList.add("baseStyle");
const translatorTip = document.createElement("div");
translatorTip.classList.add("baseStyle");
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
.baseStyle {
  font-family:"Times New Roman";
  display: none;
  position:absolute;
  z-index:999999999;
  max-width: 30vw;
  line-height: 1.5em;
  border: 1px solid black;
  padding:10px;
  color: inherit;
  font-size: 15px;
  background: transparent;
  backdrop-filter: blur(5px);
  border-radius: 10px;
}
`;
document.head.appendChild(globalStyle);
setStyle(translatorTip, {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    bottom: "-40vh",
    left: "0",
    right: "0",
    margin: "0 auto",
    width: "100%",
    transition: "all 80ms",
});
document.body.appendChild(translator);
document.body.appendChild(translatorTip);
document.addEventListener("mouseup", (evt) => {
    if (evt.target.id !== "translatorArea") {
        chrome.runtime.sendMessage({
            type: "check",
        }, (resp) => {
            var _a;
            if (resp) {
                const text = (_a = document.getSelection()) === null || _a === void 0 ? void 0 : _a.toString();
                if (text === null || text === void 0 ? void 0 : text.trim()) {
                    const [originLanguage, targetLanguage] = getLangOriginAndTarget(text);
                    chrome.runtime.sendMessage({
                        type: "fetch",
                        url: `https://translate.google.cn/m?ui=tob&hl=en&sl=${originLanguage}&tl=${targetLanguage}&q=${encodeURIComponent(text)}`,
                    }, (resp) => {
                        const elt = document.createElement("div");
                        elt.innerHTML = resp;
                        const result = elt.querySelector(".result-container").innerText;
                        setStyle(translator, {
                            display: "block",
                            top: `${evt.pageY}px`,
                            left: `${evt.pageX}px`,
                        });
                        translator.innerText = result;
                    });
                }
            }
        });
    }
});
document.addEventListener("mousedown", (evt) => {
    if (evt.target.id !== "translatorArea") {
        translator.innerHTML = "";
        setStyle(translator, {
            display: "none",
        });
    }
});
document.addEventListener("keyup", (evt) => {
    if ((evt.ctrlKey && evt.keyCode === 18) ||
        (evt.altKey && evt.keyCode === 17)) {
        chrome.runtime.sendMessage({
            type: "toggleGlobal",
        }, (resp) => {
            const text = resp ? "🌱划词翻译已开启" : "😶划词翻译已关闭";
            translatorTip.innerText = text;
            translatorTip.style.bottom = "8vh";
            const st = setTimeout(() => {
                translatorTip.style.bottom = "-40vh";
                clearTimeout(st);
            }, 3000);
        });
    }
});
function isChinese(text) {
    return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(text);
}
function setStyle(e, s) {
    for (const k in s) {
        const v = s[k];
        if (typeof v === "string") {
            e.style[k] = v;
        }
    }
}
function getLangOriginAndTarget(text) {
    const o = isChinese(text) ? "zh-CN" : "auto";
    const t = o === "zh-CN" ? "en" : "zh-CN";
    return [o, t];
}
