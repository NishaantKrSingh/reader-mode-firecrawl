// content.js

// This guard prevents the script from running multiple times if the button is clicked again.
if (typeof readerActivated === "undefined") {
  var readerActivated = true;

  const BACKEND_URL = "http://localhost:3000/scrape";

  // Injects the stylesheet for the reader view.
  function injectCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    // chrome.runtime.getURL is needed for files in web_accessible_resources
    link.href = chrome.runtime.getURL("reader.css");
    document.head.appendChild(link);
  }

  async function activateReaderMode() {
    injectCSS();
    const currentUrl = window.location.href;

    // Show loading UI
    document.body.innerHTML = `<div id="fire-reader-loading">Loading Content...</div>`;
    addBaseStyles();

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const markdownContent = data.content;

      // 'marked' is now available directly because it was injected by popup.js
      // The 'injectScript' helper is no longer needed.
      const htmlContent = marked.parse(markdownContent);
      
      renderReaderView(htmlContent);

    } catch (error) {
      console.error("Failed to activate reader mode:", error);
      document.body.innerHTML = `<div id="fire-reader-error">
        <h2>Failed to load content.</h2>
        <p>This can happen on pages that are not publicly accessible (like localhost or behind a login). Please try again or on a different page.</p>
        <button id="reload-button">Reload Original Page</button>
      </div>`;
      document.getElementById("reload-button").onclick = () => window.location.reload();
    }
  }

  function renderReaderView(htmlContent) {
    const readerContainer = document.createElement("div");
    readerContainer.id = "fire-reader-container";

    readerContainer.innerHTML = `
      <div id="fire-reader-controls">
        <button id="theme-toggle" title="Toggle Theme">🌙/☀️</button>
        <button id="font-decrease" title="Decrease Font Size">A-</button>
        <button id="font-increase" title="Increase Font Size">A+</button>
        <button id="close-reader" title="Exit Reader Mode">✕</button>
      </div>
      <div id="fire-reader-content">${htmlContent}</div>
    `;

    document.body.innerHTML = ""; // Clear the body
    document.body.appendChild(readerContainer);
    document.body.classList.add("fire-reader-active");

    // Add event listeners
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("font-decrease").addEventListener("click", () => adjustFontSize(-1));
    document.getElementById("font-increase").addEventListener("click", () => adjustFontSize(1));
    document.getElementById("close-reader").addEventListener("click", () => window.location.reload());

    // Apply saved user preferences
    loadPreferences();
  }

  function toggleTheme() {
    const container = document.getElementById("fire-reader-container");
    container.classList.toggle("dark-mode");
    // Save the preference
    chrome.storage.sync.set({
      theme: container.classList.contains("dark-mode") ? "dark" : "light",
    });
  }

  function adjustFontSize(change) {
    const content = document.getElementById("fire-reader-content");
    let currentSize = parseInt(window.getComputedStyle(content).fontSize);
    let newSize = currentSize + change;
    // Set reasonable limits for font size
    if (newSize >= 12 && newSize <= 32) {
      content.style.fontSize = `${newSize}px`;
      chrome.storage.sync.set({ fontSize: newSize });
    }
  }

  function loadPreferences() {
    chrome.storage.sync.get(["theme", "fontSize"], (prefs) => {
      if (prefs.theme === "dark") {
        document.getElementById("fire-reader-container").classList.add("dark-mode");
      }
      if (prefs.fontSize) {
        document.getElementById("fire-reader-content").style.fontSize = `${prefs.fontSize}px`;
      }
    });
  }

  // Adds temporary styles for the loading/error messages
  function addBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
      body {
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
      }
      #fire-reader-loading, #fire-reader-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
        text-align: center;
        font-size: 1.5em;
        color: #444;
      }
      #fire-reader-error h2 {
        font-size: 1.2em;
        margin-bottom: 10px;
      }
      #fire-reader-error p {
        font-size: 0.7em;
        max-width: 600px;
        line-height: 1.6;
        color: #666;
      }
      #fire-reader-error button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 0.8em;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f0f0f0;
      }
    `;
    document.head.appendChild(style);
  }

  // --- Start the process ---
  activateReaderMode();
}