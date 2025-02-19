const { getBrowser, getExtensionId } = require('./testUtils.js');

beforeEach(async () => {
    global.browser = await getBrowser();
    global.extensionId = await getExtensionId();
    global.extensionPath = `chrome-extension://${global.extensionId}`;
});

afterEach(async () => {
    try {
        if (global.browser) {
            await global.browser.close();
        }
    } finally {
        global.browser = null;
        global.extensionId = null;
        global.extensionPath = null;
    }
});