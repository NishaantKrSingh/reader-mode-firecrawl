// popup.js
document.getElementById('activateReader').addEventListener('click', () => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        // Execute the content script in the active tab
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
        });
    });
});