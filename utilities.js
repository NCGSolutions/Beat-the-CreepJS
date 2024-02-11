const fs = require('fs').promises;
const proxyChain = require('proxy-chain');
require('dotenv').config();

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
    ensureDirectoryExists
};