const {
    openOptions,
    waitForStoredValue,
} = require('../testUtils.js');


describe('Options Tests', () => {
    test('Should render options correctly', async () => {
        // Arrange
        const options = await openOptions();

        // Assert
        await expect(options.$('#idekey')).resolves.not.toBeNull(); // IDE Key
        await expect(options.$('#tracetrigger')).resolves.not.toBeNull(); // Trace Trigger
        await expect(options.$('#profiletrigger')).resolves.not.toBeNull(); // Profile Trigger
        await expect(options.$('button[type="reset"]')).resolves.not.toBeNull(); // Clear
        await expect(options.$('button[type="submit"]')).resolves.not.toBeNull(); // Save
        await expect(options.$('#help')).resolves.not.toBeNull(); // Help
    });

    test('Should render default shortcuts correctly', async () => {
        // Arrange
        const options = await openOptions();

        // Assert
        const helpDiv = await options.waitForSelector('#help');
        const pCount = await helpDiv.$$eval('p', e => e.length);
        expect(pCount).toBe(4);
    });

    test('Should set IDE Key correctly and save', async () => {
        // Arrange
        const options = await openOptions();

        // Act
        const key = 'IDE_KEY_TEST';
        await options.locator('#idekey').fill(key);
        await options.locator('button[type="submit"]').click();

        // Assert
        await options.waitForSelector('form.success');
        const storedValue = await waitForStoredValue(options, 'xdebugIdeKey');
        expect(storedValue).toBe(key);
    });

    test('Should set Trace Trigger correctly and save', async () => {
        // Arrange
        const options = await openOptions();

        // Act
        const key = 'TRACE_TRIGGER_TEST';
        await options.locator('#tracetrigger').fill(key);
        await options.locator('button[type="submit"]').click();

        // Assert
        await options.waitForSelector('form.success');
        const storedValue = await waitForStoredValue(options, 'xdebugTraceTrigger');
        expect(storedValue).toBe(key);
    });

    test('Should set Profile Trigger correctly and save', async () => {
        // Arrange
        const options = await openOptions();

        // Act
        const trigger = 'PROFILE_TRIGGER_TEST';
        await options.locator('#profiletrigger').fill(trigger);
        await options.locator('button[type="submit"]').click();

        // Assert
        await options.waitForSelector('form.success');
        const storedValue = await waitForStoredValue(options, 'xdebugProfileTrigger');
        expect(storedValue).toBe(trigger);
    });


    test('Should clear all text inputs when the clear button is clicked', async () => {
        // Arrange
        const options = await openOptions();

        // Act
        await options.type('#idekey', 'foo');
        await options.type('#tracetrigger', 'bar');
        await options.type('#profiletrigger', 'bat');
        await options.click('button[type="reset"]');

        // Assert
        await expect(options.$eval('#idekey', el => el.value)).resolves.toBe('');
        await expect(options.$eval('#tracetrigger', el => el.value)).resolves.toBe('');
        await expect(options.$eval('#profiletrigger', el => el.value)).resolves.toBe('');
    });
});