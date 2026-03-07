# PDF Master Dark Mode

A Chrome Extension (Manifest V3) that applies dark mode and visual filters to both online and local PDF files.

## Features

- **Dark Mode Toggle** – Inverts PDF colors using `mix-blend-mode: difference` for a true dark-mode experience.
- **Brightness Slider** – Adjusts brightness between 50% and 150% (default 100%).
- **Contrast Slider** – Adjusts contrast between 50% and 150% (default 100%).
- **Grayscale Slider** – Converts the PDF to grayscale, 0%–100% (default 0%).
- **Blue Light Filter** – Applies a warm orange tint with adjustable opacity 0%–50% (default 0%) to reduce eye strain.
- **Persistent Settings** – All slider values are saved with `chrome.storage.local` and restored automatically on every PDF page.
- **Live Updates** – Slider changes take effect instantly without reloading the page.
- **Local PDF Support** – Works on PDFs opened from your hard drive via `file:///` URLs.

## Installation

1. Download or clone this repository.
2. Open **Chrome** and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root folder of this repository.
5. The extension icon will appear in the Chrome toolbar.

### Enabling Local File Access

To use the extension on PDFs opened from your computer (`file:///` URLs):

1. Go to `chrome://extensions`.
2. Find **PDF Master Dark Mode** and click **Details**.
3. Enable **Allow access to file URLs**.

## Usage

1. Open any PDF in Chrome (online or local).
2. Click the **PDF Master Dark Mode** icon in the toolbar.
3. Adjust the controls to your preference – changes apply instantly.
4. Settings are automatically saved and restored the next time you view a PDF.

## File Overview

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `popup.html` | Extension popup UI |
| `popup.css` | Dark-themed popup styles |
| `popup.js` | Popup logic – load/save settings, send messages |
| `content.js` | Content script – creates overlays, applies filters |
