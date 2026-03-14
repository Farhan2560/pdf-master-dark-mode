# Total Eclipse

A Chrome Extension (Manifest V3) that applies true dark mode and visual filters to the entire internet—including local PDF files—using Chrome's native document rendering.

## What's New in Version 1.1
* **Universal Web Support:** Expanded from a PDF-only tool to work seamlessly across all websites (`<all_urls>`).
* **Smart Media & Logo Protection:** Custom CSS injection automatically protects standard images and videos from being color-inverted, while a "fuzzy matching" algorithm specifically rescues branding SVGs/logos without breaking essential navigation UI icons. 

## Core Features

- **Dark Mode Toggle** – Inverts website colors using native CSS `invert` and `hue-rotate` for a true dark-mode experience that preserves image colors.
- **Always Auto-Enable** – Automatically applies Dark Mode to any newly opened tab or PDF document.
- **Brightness Slider** – Adjusts brightness between 50% and 150% (default 100%).
- **Contrast Slider** – Adjusts contrast between 50% and 150% (default 100%).
- **Grayscale Slider** – Converts the page to grayscale, 0%–100% (default 0%).
- **Blue Light Filter** – Applies a warm orange tint with adjustable opacity 0%–50% (default 0%) to reduce eye strain.
- **Persistent Settings** – All slider values are saved locally and restored automatically across all your tabs.
- **Live Updates** – Slider changes take effect instantly without reloading the page.
- **Local PDF Support** – Still works perfectly on PDFs opened from your hard drive via `file:///` URLs.

## Installation (Developer Mode)

1. Download or clone this repository.
2. Open **Chrome** and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root folder of this repository.
5. Click the puzzle piece icon in your Chrome toolbar and **Pin** the extension.

### Enabling Local File Access
To use the extension on offline PDFs:
1. Go to `chrome://extensions`.
2. Find **Total-Eclipse** and click **Details**.
3. Enable **Allow access to file URLs**.

## Usage & Shortcuts

1. Open any website or PDF in Chrome.
2. Click the extension icon to open the control panel and adjust your sliders.
3. **Keyboard Shortcut:** Press `Alt+Shift+D` (Windows/Linux) or `Ctrl+Shift+D` (Mac) to quickly toggle Dark Mode on or off without opening the menu.
4. Click **Reset to Default** to instantly clear all applied filters.

## File Overview

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (Manifest V3) defining global `<all_urls>` permissions and shortcuts |
| `background.js` | Service worker managing the keyboard shortcuts |
| `popup.html` | Extension popup UI (sliders, toggles, reset button) |
| `popup.css` | Dark-themed styling for the control panel |
| `popup.js` | Logic for loading/saving settings and sending live updates |
| `content.js` | Injects native CSS filters, the blue light overlay, and the smart media/logo protections into the page |
| `icon16.png` | 16x16 Favicon |
| `icon48.png` |
