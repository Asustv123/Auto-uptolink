// ==UserScript==
// @name         Bypass UptoLink
// @namespace    http://violentmonkey.net/
// @version      1.0
// @description  Bypass UptoLink - Compatible with Greasemonkey & Violentmonkey
// @author       Asustv123
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      uptolink.one
// @connect      raw.githubusercontent.com
// @connect      api.github.com
// @connect      generativelanguage.googleapis.com
// @connect      api.kolosal.ai
// @connect      *
// @run-at       document-end
// @icon         https://cdn.discordapp.com/avatars/1001691686721835090/8c9770820eac0449217292ed718b3700.png
// ==/UserScript==

(function() {
    'use strict';
    
    // Tương thích với nhiều script manager
    const GM = typeof GM !== 'undefined' ? GM : {
        xmlHttpRequest: typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null
    };
    
    console.log('Bypass UptoLink script loaded successfully!');
    
    // Code chính ở đây
    try {
        // Kiểm tra nếu là trang uptolink
        if (window.location.hostname.includes('uptolink')) {
            console.log('Detected UptoLink page');
            // Thêm logic bypass ở đây
        }
    } catch(error) {
        console.error('Script error:', error);
    }
})();