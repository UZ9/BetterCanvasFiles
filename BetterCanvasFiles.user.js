// ==UserScript==
// @name         BetterCanvasFiles
// @namespace    http://tampermonkey.net/
// @version      2024-09-08
// @description  try to take over the world!
// @author       Ryder (Yerti)
// @match        https://*.instructure.com/courses/**/files/**
// @match        https://*.instructure.com/courses/**/files
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

// Generate div given raw html string
function elementFromHtml(html) {
    let temp = document.createElement('div');
    temp.innerHTML = html.trim();

    return temp.firstChild;
}

// Utility for (roughly) sleeping a given time in milliseconds
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

// Tampermonkey mysteriously drops files if you don't have a delay between each, add a slight delay
async function downloadDelay(url, name, delay) {
    await sleep(delay);

    GM_download({
        url,
        name,
        saveAs: false,
    });
}


main();

async function main() {
    await sleep(1000);

    'use strict';

    const downloadButton = elementFromHtml('<button type="button" id="download_all" class="btn btn-primary btn-download">Download</button>');

    downloadButton.style.marginLeft = "4px";

    $('.ef-header').get(0).appendChild(downloadButton);

    $('#download_all').click(() => {
        $('.ef-name-col__link').each((i, obj) => {
            if (!obj.href.includes("folder")) {

                const className = $('#treenode-2 > a > span').text().replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "");
                const folder = document.URL.includes("folder") ? document.URL.split("folder")[1].substring(1) + "/" : "";
                const fileName = obj.children[1].innerText;

                console.log({className, folder, fileName});

                downloadDelay(obj.href, className + "/" + folder + fileName, i * 10);
            }
        });
    });
};
