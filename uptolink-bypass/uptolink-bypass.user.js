// ==UserScript==
// @name         UptoLink Bypass Clean
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass shortlink uptolink (clean version)
// @author       VietAnh
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      uptolink.one
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg, type = "info") => {
        console.log(`[Bypass] ${msg}`);
    };

    // 🔍 Tìm link trong trang
    function findLinks() {
        const links = [];
        document.querySelectorAll("a").forEach(a => {
            if (a.href && a.href.includes("http")) {
                links.push(a.href);
            }
        });
        return links;
    }

    // 🌐 Gửi request bypass
    function bypass(url) {
        log("Đang gửi request bypass...");

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://uptolink.one/check/countdown",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `url=${encodeURIComponent(url)}`,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);

                    if (!data || !data.success) {
                        log("Không lấy được countdown", "error");
                        return;
                    }

                    const token = data.token;

                    setTimeout(() => {
                        getFinalLink(token);
                    }, 3000); // fake delay

                } catch (e) {
                    log("Lỗi parse JSON", "error");
                }
            }
        });
    }

    // 🔗 Lấy link thật
    function getFinalLink(token) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://uptolink.one/check/continue",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `token=${token}`,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);

                    if (data && data.url) {
                        log("Thành công! Redirect...");
                        window.location.href = data.url;
                    } else {
                        log("Không có link cuối", "error");
                    }

                } catch (e) {
                    log("Lỗi xử lý link", "error");
                }
            }
        });
    }

    // 🧠 UI nhập tay (fallback)
    function createUI() {
        const box = document.createElement("div");
        box.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #111;
            padding: 10px;
            border-radius: 8px;
            z-index: 9999;
            border: 2px solid #00ff00;
            color: #00ff00;
            font-family: monospace;
            box-shadow: 0 0 10px rgba(0,255,0,0.3);
        `;

        const input = document.createElement("input");
        input.placeholder = "Nhập link...";
        input.style = `
            padding: 5px;
            margin-right: 5px;
            background: #222;
            color: #00ff00;
            border: 1px solid #00ff00;
            border-radius: 5px;
        `;

        const btn = document.createElement("button");
        btn.innerText = "Bypass";
        btn.style = `
            padding: 5px 10px;
            background: #00ff00;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        btn.onclick = () => {
            if (input.value) bypass(input.value);
        };

        box.appendChild(input);
        box.appendChild(btn);
        document.body.appendChild(box);
    }

    // 🚀 Auto chạy
    function init() {
        log("Script chạy");

        const links = findLinks();

        if (links.length > 0) {
            log("Tìm thấy link, auto bypass...");
            bypass(links[0]);
        } else {
            log("Không tìm thấy link, dùng manual");
        }

        createUI();
    }

    window.addEventListener("load", init);

})();