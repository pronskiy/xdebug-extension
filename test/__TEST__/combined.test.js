const {
    openPopup,
    openOptions,
    openExamplePage,
} = require('../testUtils.js');


describe('Combined Tests', () => {
    test('Should set and retrieve cookie with special characters on subequent loads', async () => {
        // Arrange
        const specialValue = 'TEST=VALUE;WITH!SPECIAL/CHARS?&%';
        const optionsPage = await openOptions();
        
        // Act
        await optionsPage.locator('#debugtrigger').fill(specialValue);
        await optionsPage.click('button[type="submit"]');
        await optionsPage.close();
        const page = await openExamplePage();
        const popup = await openPopup();
        await popup.click('label[for="debug"]');
        await page.waitForFunction(() => document.cookie);
        await page.reload();
        const popup2 = await openPopup();

        // Assert
        expect(await popup2.$eval('#debug', (radio) => radio.checked)).toBe(true);
        await page.close();
    });
});
