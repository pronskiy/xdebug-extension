module.exports = {
    verbose: true,
    globals: {
        config: {
            extensionDir: '../src',
            browserPath: process.env.BROWSER_PATH || '/snap/bin/chromium',
            examplePage: process.env.EXAMPLE_PAGE || 'https://example.com/',
            defaultKey: process.env.DEFAULT_KEY || 'XDEBUG_ECLIPSE',
            timeout: process.env.TIMEOUT || 3000,
            slowMo: process.env.SLOW_MO || 0,
            devtools: process.env.DEV_TOOLS || false,
        }
    }
};