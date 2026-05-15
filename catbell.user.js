// ==UserScript==
// @name         CatBell Full Logic v2
// @namespace    catbell.full
// @version      2.0
// @description  Script có lưu dữ liệu + logic hoạt động (improved)
// @match        https://uptolink.com/*
// @match        https://bypass.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script loaded");

    // ====== 1. LƯU DỮ LIỆU ======
    let count = GM_getValue("visit_count", 0);
    count++;
    GM_setValue("visit_count", count);
    console.log("Số lần truy cập:", count);

    // ====== 2. CONFIG ======
    const CONFIG = {
        clickDelay: 500,        // ms giữa các click
        maxRetries: 3,
        buttonSelector: "button.proceed, a.download-btn" // Tùy website
    };

    // ====== 3. UTILITY FUNCTIONS ======
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function log(msg, type = "info") {
        console.log(`[CatBell] ${type.toUpperCase()}: ${msg}`);
    }

    // ====== 4. LOGIC CHÍNH ======
    async function handleButtons() {
        try {
            let buttons = document.querySelectorAll(CONFIG.buttonSelector);
            if (buttons.length === 0) {
                log("Không tìm thấy button", "warn");
                return;
            }

            for (let btn of buttons) {
                if (btn.offsetParent !== null) { // Check visible
                    log(`Click button: ${btn.textContent}`);
                    btn.click();
                    await sleep(CONFIG.clickDelay);
                }
            }
        } catch (err) {
            log(`Error clicking: ${err.message}`, "error");
        }
    }

    function handleLinks() {
        try {
            let links = document.querySelectorAll("a[href*='redirect'], a[href*='skip']");
            links.forEach((link, idx) => {
                log(`Bypass link ${idx}: ${link.href}`);
                // Thay vì redirect, có thể open tab mới
                // window.open(link.href, '_blank');
            });
        } catch (err) {
            log(`Error handling links: ${err.message}`, "error");
        }
    }

    // ====== 5. CHẠY KHI LOAD ======
    window.addEventListener("load", async () => {
        log("DOM Ready - Chạy logic");
        await handleButtons();
        handleLinks();
    });

})();