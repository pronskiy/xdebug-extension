document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_IDE_KEY = 'XDEBUG_ECLIPSE';
    const ideKeyInput = document.getElementById('idekey');
    const traceTriggerInput = document.getElementById('tracetrigger');
    const profileTriggerInput = document.getElementById('profiletrigger');
    const saveButton = document.getElementById('save');

    chrome.storage.local.get({
        xdebugIdeKey: DEFAULT_IDE_KEY,
        xdebugTraceTrigger: DEFAULT_IDE_KEY,
        xdebugProfileTrigger: DEFAULT_IDE_KEY
    }, (settings) => {
        ideKeyInput.value = settings.xdebugIdeKey;
        traceTriggerInput.value = settings.xdebugTraceTrigger;
        profileTriggerInput.value = settings.xdebugProfileTrigger;
    });

    saveButton.addEventListener('click', () => {
        chrome.storage.local.set({
            xdebugIdeKey: ideKeyInput.value,
            xdebugTraceTrigger: traceTriggerInput.value,
            xdebugProfileTrigger: profileTriggerInput.value,
        });
    });
});