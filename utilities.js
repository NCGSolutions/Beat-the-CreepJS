const fs = require('fs').promises;
const proxyChain = require('proxy-chain');
require('dotenv').config();

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
];

function getRandomResidentialProxy() {
    // Access username and password from environment variables
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (!username || !password) {
        throw new Error('Proxy username or password not set in environment variables.');
    }

    const host = 'geo.iproyal.com';
    const port = '12321';
    const randomPartLength = 8;
    const randomPart = Array.from({ length: randomPartLength }, () => Math.random().toString(36)[2] || 0).join('');
    const session = randomPart; // Random session ID
    const formattedProxy = `http://${username}:${password}_country-us_session-${session}_lifetime-10m_streaming-1@${host}:${port}`;

    console.log(formattedProxy);
    return formattedProxy;
}

function wait(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function getRandomSearchQuery() {
    const queries = [
        'CreepJS GitHub',
        'GitHub CreepJS',
        'CreepJS browser fingerprinting',
        'CreepJS GitHub repository'
    ];
    return queries[getRandomNumber(0, queries.length - 1)];
  }

  async function typeWithRandomSpeed(page, text) {
    for (let char of text.split('')) {
        await page.keyboard.press(char, {delay: getRandomNumber(30, 150)});
    }
  }

  async function getText(page, xpath) {
    const elements = await page.$x(xpath);
    if (elements.length > 0) {
        const text = await page.evaluate(el => el.textContent, elements[0]);
        return text.trim();
    }
    return '';
}

async function getFingerprintHash(page) {
    const fpIdHash = await page.evaluate(() => {
        const fpIdElement = document.querySelector('.fingerprint-header .ellipsis-all');
        let fpIdHash = '';
        if (fpIdElement) {
            const spans = fpIdElement.querySelectorAll('span');
            fpIdHash = Array.from(spans).map(span => span.textContent).join('');
        }
        return fpIdHash;
    });
    return fpIdHash;
}

async function ensureDirectoryExists(directoryPath) {
    try {
        await fs.access(directoryPath);
    } catch (error) {
        await fs.mkdir(directoryPath, { recursive: true });
    }
}

function getRandomUserAgent() {
    const randomIndex = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomIndex];
}

module.exports = {
    fs,
    proxyChain,
    getRandomResidentialProxy,
    wait,
    getRandomNumber,
    getRandomSearchQuery,
    typeWithRandomSpeed,
    getText,
    getFingerprintHash,
    ensureDirectoryExists,
    getRandomUserAgent
};