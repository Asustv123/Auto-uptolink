// ==UserScript==
// @name         CatBell Full Logic v3 - Fixed
// @namespace    catbell.full
// @version      3.0
// @description  Script có UI + chrome API mock + logic hoạt động
// @match        https://uptolink.com/*
// @match        https://bypass.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("[CatBell] Script loaded");

    // ====== 1. MOCK CHROME API ======
    const chrome = {
        storage: {
            local: {
                get: (key, cb) => cb({}),
                set: () => {}
            }
        },
        runtime: {
            onMessage: {
                addListener: () => {}
            },
            sendMessage: () => {
                console.warn("[CatBell] chrome.runtime not supported in Tampermonkey");
            }
        }
    };

    // ====== 2. LƯU DỮ LIỆU ======
    let count = GM_getValue("visit_count", 0);
    count++;
    GM_setValue("visit_count", count);
    console.log("[CatBell] Số lần truy cập:", count);

    // ====== 3. CONFIG ======
    const CONFIG = {
        clickDelay: 500,
        maxRetries: 3,
        buttonSelector: "button.proceed, a.download-btn"
    };

    // ====== 4. UTILITY FUNCTIONS ======
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function log(msg, type = "info") {
        console.log(`[CatBell] ${type.toUpperCase()}: ${msg}`);
    }

    // ====== 5. TẠO UI ======
    function createUI() {
        if (document.getElementById("catbell-ui")) return;

        let div = document.createElement("div");
        div.id = "catbell-ui";
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "20px";
        div.style.zIndex = "999999";
        div.style.background = "#1a1a1a";
        div.style.color = "#00ff00";
        div.style.padding = "15px";
        div.style.borderRadius = "10px";
        div.style.fontFamily = "monospace";
        div.style.fontSize = "12px";
        div.style.border = "2px solid #00ff00";
        div.style.boxShadow = "0 0 10px rgba(0,255,0,0.3)";
        
        div.innerHTML = `
            <div style="margin-bottom:10px; font-weight:bold">⚙️ CatBell Tool</div>
            <div style="margin-bottom:8px">
                <span>Visit Count: </span>
                <span id="cb-visit-count">${count}</span>
            </div>
            <div style="margin-bottom:8px">
                <span>Status: </span>
                <span id="cb-phase">Ready</span>
            </div>
            <div style="display:flex; gap:5px">
                <button id="cb-toggle" style="
                    padding:5px 10px;
                    background:#00ff00;
                    color:#000;
                    border:none;
                    borderRadius:5px;
                    cursor:pointer;
                    fontWeight:bold;
                ">Start</button>
                <button id="cb-close" style="
                    padding:5px 10px;
                    background:#ff0000;
                    color:#fff;
                    border:none;
                    borderRadius:5px;
                    cursor:pointer;
                ">Close</button>
            </div>
        `;
        document.body.appendChild(div);

        // Event listeners
        document.getElementById("cb-toggle").onclick = async () => {
            document.getElementById("cb-phase").textContent = "Running...";
            await handleButtons();
            document.getElementById("cb-phase").textContent = "Done";
            setTimeout(() => {
                document.getElementById("cb-phase").textContent = "Ready";
            }, 2000);
        };

        document.getElementById("cb-close").onclick = () => {
            div.remove();
            log("UI closed");
        };
    }

    // ====== 6. LOGIC CHÍNH ======
    async function handleButtons() {
        try {
            let buttons = document.querySelectorAll(CONFIG.buttonSelector);
            if (buttons.length === 0) {
                log("Không tìm thấy button", "warn");
                return;
            }

            for (let btn of buttons) {
                if (btn.offsetParent !== null) {
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
            });
        } catch (err) {
            log(`Error handling links: ${err.message}`, "error");
        }
    }

    // ====== 7. CHẠY KHI LOAD ======
    window.addEventListener("load", () => {
        log("DOM Ready");
        createUI();
        handleLinks();
    });

})();