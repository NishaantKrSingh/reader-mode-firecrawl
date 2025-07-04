// content.js

if (typeof readerActivated === "undefined") {
  var readerActivated = true;

  const BACKEND_URL = "http://localhost:3000/scrape";

  function injectCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
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

      // Load local marked.js script
      await injectScript(chrome.runtime.getURL("libs/marked.min.js"));

      const htmlContent = marked.parse(markdownContent);
      renderReaderView(htmlContent);
    } catch (error) {
      console.error("Failed to activate reader mode:", error);
      document.body.innerHTML = `<div id="fire-reader-error">
        <h2>Failed to load content.</h2>
        <p>Please try again or on a different page.</p>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>`;
    }
  }

  function renderReaderView(htmlContent) {
    const readerContainer = document.createElement("div");
    readerContainer.id = "fire-reader-container";

    readerContainer.innerHTML = `
      <div id="fire-reader-controls">
        <button id="theme-toggle">Toggle Dark Mode</button>
        <button id="font-decrease">A-</button>
        <button id="font-increase">A+</button>
        <button id="close-reader">Exit Reader</button>
      </div>
      <div id="fire-reader-content">${htmlContent}</div>
    `;

    document.body.innerHTML = "";
    document.body.appendChild(readerContainer);
    document.body.classList.add("fire-reader-active");

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("font-decrease").addEventListener("click", () => adjustFontSize(-1));
    document.getElementById("font-increase").addEventListener("click", () => adjustFontSize(1));
    document.getElementById("close-reader").addEventListener("click", () => window.location.reload());

    loadPreferences();
  }

  function toggleTheme() {
    const container = document.getElementById("fire-reader-container");
    container.classList.toggle("dark-mode");
    chrome.storage.sync.set({
      theme: container.classList.contains("dark-mode") ? "dark" : "light",
    });
  }

  function adjustFontSize(change) {
    const content = document.getElementById("fire-reader-content");
    let currentSize = parseInt(window.getComputedStyle(content).fontSize);
    let newSize = currentSize + change;
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

  function addBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #fire-reader-loading, #fire-reader-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
        font-size: 2em;
      }
    `;
    document.head.appendChild(style);
  }

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  // Start reader mode
  activateReaderMode();
}
