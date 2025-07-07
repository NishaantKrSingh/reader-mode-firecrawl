// popup.js
document.getElementById('activateReader').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Inject both scripts. 'marked.min.js' will run first,
        // making the 'marked' object available to 'content.js'.
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['libs/marked.min.js', 'content.js']
        });
    });
});