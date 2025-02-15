const puppeteer = require('puppeteer-core');

/**
 * Launches a browser instance with the extension loaded and assigns it to `browser`.
 * @returns {Promise<void>} A Promise that resolves when the browser is launched.
 * @throws {Error} If the browser fails to launch
 */
async function launchBrowser() {
    browser = await puppeteer.launch({
        executablePath: config.browserPath,
        headless: config.headless,
        slowMo: config.slowMo,
        devtools: config.devtools,
        args: [
            '--window-name=Xdebug Extension Tests',
            '--window-size=800,600',
            '--no-first-run',
            `--disable-extensions-except=${config.extensionDir}`,
            `--load-extension=${config.extensionDir}`
        ],
        timeout: config.timeout
    });
}

/**
 * Waits for the extension's service worker and returns the worker instance.
 * @param {puppeteer.Browser} browser The Puppeteer browser instance.
 * @returns {Promise<puppeteer.Worker>} A Promise that resolves to the service worker instance.
 * @throws {Error} If the service worker is not found.
 */
async function getExtensionServiceWorker() {
    const workerTarget = await browser.waitForTarget(
        target =>
            target.type() === 'service_worker' &&
            target.url().endsWith('service_worker.js'),
    );

    return await workerTarget.worker();
}


/**
 * Retrieves the extension's path by inspecting the service worker.
 * @returns {Promise<void>} A Promise that resolves when the extension path is determined.
 * @throws {Error} If the extension path cannot be determined
 */
async function getExtensionPath() {
    const page = await openExamplePage();
    const worker = await getExtensionServiceWorker();
    const extensionId = await worker.evaluate(() => chrome.runtime.id);
    extensionPath = `chrome-extension://${extensionId}`;

    await page.close();
}

/**
 * Opens the extension's popup.
 * 
 * @returns {Promise<puppeteer.Page>} A Promise that resolves with the Puppeteer Page object representing the opened popup.
 * @throws {Error} If the service worker or popup page are not found within a reasonable timeout.
 */
async function openPopup() {
    const worker = await getExtensionServiceWorker();
    await worker.evaluate('chrome.action.openPopup();');
    const popupTarget = await browser.waitForTarget(target => target.type() === 'page' && target.url().endsWith('popup.html'));

    return popupTarget.asPage();
}

/**
 * Opens the extension's options.
 * 
 * @returns {Promise<puppeteer.Page>} A Promise that resolves with the Puppeteer Page object representing the opened options.
 * @throws {Error} If the options page is not found within a reasonable timeout.
 */
async function openOptions() {
    const page = await browser.newPage();
    await page.goto(`${extensionPath}/options.html`);

    return page;
}

/**
 * Opens the config.examplePage
 * @returns {Promise<puppeteer.Page>} A Promise that resolves with the Puppeteer Page object representing the example page.
 * @throws {Error} If the example page is not found within a reasonable timeout.
 */
async function openExamplePage() {
    const page = await browser.newPage();
    await page.goto(config.examplePage);

    return page;
}


/**
 * Finds a specific cookie by name.
 * @param {Array<object>} cookies An array of cookie objects.
 * @param {string} cookieName The name of the cookie (e.g., 'XDEBUG_SESSION').
 * @returns {object | undefined} The cookie object if found, or `undefined` if not found.
 */
function findCookie(cookies, cookieName) {
    return cookies.find(cookie => cookie.name === cookieName);
}

/**
 * Waits for a cookie to be set (i.e., document.cookie to be non-empty).
 * @param {puppeteer.Page} page The Puppeteer page object
 * @returns {Promise<void>} A Promise that resolves when a cookie is detected.
 */
async function waitForCookieToExist(page) {
    return await page.waitForFunction(async () => document.cookie);
}

/**
 * Waits for all cookies to be cleared (i.e., document.cookie to be empty).
 * @param {puppeteer.Page} page The Puppeteer page object
 * @returns {Promise<void>} A Promise that resolves when all cookies are cleared.
 */
async function waitForCookieToClear(page) {
    return await page.waitForFunction(async () => !document.cookie);
}

/**
 * Retrieves a value from `chrome.storage.local`.
 * @param {puppeteer.Page} page The Puppeteer Page object representing the extension's page.
 * @param {string} key The key under which the value is stored in `chrome.storage.local`.
 * @returns {Promise<any>} A Promise that resolves with the stored value. Resolves with `undefined` if the key is not found.
 * @throws {Error} If there's an issue accessing `chrome.storage.local` or if the promise within `page.evaluate` rejects.
 */
async function waitForStoredValue(page, key) {
    const storedValue = await page.evaluate((k) => {
        return new Promise((resolve) => {
            chrome.storage.local.get(k, (result) => {
                resolve(result[k]);
            });
        });
    }, key);

    return storedValue;
}

module.exports = {
    launchBrowser,
    getExtensionPath,
    openPopup,
    openOptions,
    openExamplePage,
    findCookie,
    waitForCookieToExist,
    waitForCookieToClear,
    waitForStoredValue,
};