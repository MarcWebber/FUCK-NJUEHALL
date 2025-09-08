console.log("[南大ehall刷课助手] 已成功注入");

const libScript = document.createElement('script');
libScript.src = chrome.runtime.getURL('lib.js');
libScript.onload = () => {
    console.log("[南大ehall刷课助手] lib.js 已注入至页面上下文");

    const uiScript = document.createElement('script');
    uiScript.src = chrome.runtime.getURL('ui.js');
    uiScript.onload = () => {
        console.log("[南大ehall刷课助手] ui.js 已注入至页面上下文");
    };
    (document.head || document.documentElement).appendChild(uiScript);
};

(document.head || document.documentElement).appendChild(libScript);
