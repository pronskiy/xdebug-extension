const { launchBrowser, getExtensionPath } = require('./testUtils.js');

beforeEach(async () => {
    await launchBrowser();
    await getExtensionPath();
});

afterEach(async () => {
    try {
        if (browser) {
            await browser.close();
        }
    } finally {
        browser = null;
    }
});