const path = require('path');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { fs, proxyChain, getRandomResidentialProxy, wait, getRandomNumber, getRandomSearchQuery, typeWithRandomSpeed, ensureDirectoryExists, getText, getFingerprintHash, getRandomUserAgent } = require('./utilities');
puppeteer.use(pluginStealth());

async function setupBrowser() {
    const proxyUrl = await proxyChain.anonymizeProxy(getRandomResidentialProxy());
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        defaultViewport: null,
        slowMo: 100,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars', 
            '--disable-extensions',
            //`--user-agent=${getRandomUserAgent()}`, Disabling since it lowers score
            '--auto-open-devtools-for-tabs',
            `--proxy-server=${proxyUrl}`,
]});
    const page = (await browser.pages())[0];
    return { browser, page, proxyUrl };
}

async function searchForCreepJS(page) {
    await wait(getRandomNumber(1000, 3000)); // Random wait before actions
  
    // Navigate to Google and ensure the search input has focus
    await page.goto('https://www.bing.com');
    await wait(getRandomNumber(500, 2000)); // Wait a bit after focusing the input
  
    // Generate a random search query and type it with variable speed
    const searchQuery = getRandomSearchQuery();
    await typeWithRandomSpeed(page, searchQuery);
    await page.keyboard.press('Enter'); // Press 'Enter' to submit the search
    await page.waitForNavigation(); // Wait for search results
  
    // Wait and click on the CreepJS link
    const selector = 'a[href*="abrahamjuliot.github.io/creepjs"]';
    await page.waitForSelector(selector);
    await wait(getRandomNumber(1000, 3000)); // Random wait before clicking
    await page.click(selector); // Click the link

    await wait(10000);
  
  }

async function scrapeAndSave(page, runNumber) {
    const pdfDirectory = path.join(__dirname, 'pdfs'); // Directory for PDFs
    const dataDirectory = path.join(__dirname, 'data'); // Directory for JSON data

    // Ensure directories exist
    await ensureDirectoryExists(pdfDirectory);
    await ensureDirectoryExists(dataDirectory);

    const pdfPath = path.join(pdfDirectory, `url_${runNumber}.pdf`);
    const jsonPath = path.join(dataDirectory, `data_${runNumber}.json`);

    const pdfConfig = {
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '2.54cm',
            bottom: '2.54cm',
            left: '2.54cm',
            right: '2.54cm'
        }
    };
    await page.emulateMediaType('screen');
    await page.pdf(pdfConfig);

    let data = {
        trustScore: await getText(page, '//*[@id="fingerprint-data"]/div[2]/div/div[1]/div[1]/span'),
        lies: (await getText(page, '//*[@id="fingerprint-data"]/div[2]/div/div[2]/div[2]')).split(": ")[1],
        bot: (await getText(page, '//*[@id="fingerprint-data"]/div[2]/div/div[2]/div[5]/div[2]/div[1]')).split(": ")[1].split(":")[0],
        fpId: await getFingerprintHash(page),
    };
  
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${jsonPath} successfully.`);
}

async function main() {
    for (let i = 1; i <= 3; i++) {
        let browser, page, proxyUrl;
        try {
            console.log(`Running scrape #${i}`);
            // Setup browser for each run
            ({ browser, page, proxyUrl } = await setupBrowser());
            await searchForCreepJS(page);
            await scrapeAndSave(page, i);
            // Close the anonymized proxy after each run
            await proxyChain.closeAnonymizedProxy(proxyUrl, true);
        } catch (error) {
            console.error(`An error occurred during scrape #${i}:`, error);
        } finally {
            // Ensure the browser is closed after each run
            if (browser) {
                await browser.close();
            }
        }
    }
}

main();
