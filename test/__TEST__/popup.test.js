const {
    openPopup,
    openExamplePage,
    findCookie,
    waitForCookieToExist,
    waitForCookieToClear,
} = require('../testUtils.js');

describe('Popup Tests', () => {
    test('Should render popup correctly', async () => {
        // Arrange
        const popup = await openPopup();

        // Assert
        await expect(popup.$('input[type="radio"][value="1"]')).resolves.not.toBeNull(); // Debug
        await expect(popup.$('input[type="radio"][value="2"]')).resolves.not.toBeNull(); // Profile
        await expect(popup.$('input[type="radio"][value="3"]')).resolves.not.toBeNull(); // Trace
        await expect(popup.$('input[type="radio"][value="0"]')).resolves.not.toBeNull(); // Disable
        await expect(popup.$('#options')).resolves.not.toBeNull(); // Options link
    });

    test('Should toggle debug mode and sets XDEBUG_SESSION cookie', async () => {
        // Arrange
        const page = await openExamplePage();
        const popup = await openPopup();

        // Act
        await popup.locator('label[for="debug"]').click();

        // Assert
        await waitForCookieToExist(page);
        const cookies = await browser.cookies(config.examplePage);
        const xdebugSessionCookie = findCookie(cookies, 'XDEBUG_SESSION');
        expect(cookies.length).toBe(1);
        expect(xdebugSessionCookie.value).toBe(config.defaultKey);
    });

    test('Should toggle trace mode and sets XDEBUG_TRACE cookie', async () => {
        // Arrange
        const page = await openExamplePage();
        const popup = await openPopup();

        // Act
        await popup.locator('label[for="trace"]').click();

        // Assert
        await waitForCookieToExist(page);
        const cookies = await browser.cookies(config.examplePage);
        const xdebugTraceCookie = findCookie(cookies, 'XDEBUG_TRACE');
        expect(cookies.length).toBe(1);
        expect(xdebugTraceCookie.value).toBe(config.defaultKey);
    });

    test('Should toggle profile mode and sets XDEBUG_PROFILE cookie', async () => {
        // Arrange
        const page = await openExamplePage();
        const popup = await openPopup();

        // Act
        await popup.locator('label[for="profile"]').click();

        // Assert
        await waitForCookieToExist(page);
        const cookies = await browser.cookies(config.examplePage);
        const xdebugProfileCookie = findCookie(cookies, 'XDEBUG_PROFILE');
        expect(cookies.length).toBe(1);
        expect(xdebugProfileCookie.value).toBe(config.defaultKey);
    });

    test('Should toggle disabled mode and removes all cookies', async () => {
        // Arrange
        const page = await openExamplePage();
        const popup = await openPopup();

        // Act
        await popup.locator('label[for="disable"]').click();

        // Assert
        await waitForCookieToClear(page);
        const cookies = await browser.cookies(config.examplePage);
        expect(cookies.length).toBe(0);
    });

    test('Should open options page in new tab', async () => {
        // Arrange
        const popup = await openPopup();

        // Act
        await popup.click('#options');

        // Assert
        const options = await browser.waitForTarget(target => target.url() === `${extensionPath}/options.html`);
        expect(options).toBeTruthy();
    });
});

