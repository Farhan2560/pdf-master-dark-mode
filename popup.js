const DEFAULTS = {
  darkMode: false,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  blueLight: 0,
};

const darkModeToggle = document.getElementById('darkModeToggle');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const grayscaleSlider = document.getElementById('grayscaleSlider');
const blueLightSlider = document.getElementById('blueLightSlider');
const resetButton = document.getElementById('resetButton');

const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const grayscaleValue = document.getElementById('grayscaleValue');
const blueLightValue = document.getElementById('blueLightValue');
const fileWarning = document.getElementById('fileWarning');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const controls = document.querySelector('.controls');

function updateSliderVisual(sliderEl) {
  const min = Number(sliderEl.min);
  const max = Number(sliderEl.max);
  const value = Number(sliderEl.value);
  const range = max - min;
  const pct = range > 0 ? ((value - min) / range) * 100 : 0;
  sliderEl.style.setProperty('--pct', pct + '%');
  
  const row = sliderEl.closest('.control-row');
  if (row) {
    row.style.setProperty('--pct-val', pct);
  }
}

function updateToggleVisual() {
  const row = darkModeToggle.closest('.control-row');
  if (row) {
    row.style.setProperty('--pct-val', darkModeToggle.checked ? 100 : 0);
  }
}

function updateAllSliderVisuals() {
  updateSliderVisual(brightnessSlider);
  updateSliderVisual(contrastSlider);
  updateSliderVisual(grayscaleSlider);
  updateSliderVisual(blueLightSlider);
  updateToggleVisual();
}

function getSettings() {
  return {
    darkMode: darkModeToggle.checked,
    brightness: parseInt(brightnessSlider.value, 10),
    contrast: parseInt(contrastSlider.value, 10),
    grayscale: parseInt(grayscaleSlider.value, 10),
    blueLight: parseInt(blueLightSlider.value, 10),
  };
}

function applySettingsToUI(settings) {
  darkModeToggle.checked = settings.darkMode;
  brightnessSlider.value = settings.brightness;
  contrastSlider.value = settings.contrast;
  grayscaleSlider.value = settings.grayscale;
  blueLightSlider.value = settings.blueLight;

  // This part updates the actual text next to the sliders!
  document.getElementById('brightnessValue').textContent = settings.brightness + '%';
  document.getElementById('contrastValue').textContent = settings.contrast + '%';
  document.getElementById('grayscaleValue').textContent = settings.grayscale + '%';
  document.getElementById('blueLightValue').textContent = settings.blueLight + '%';

  updateAllSliderVisuals();
}

function sendToActiveTab(settings) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].id != null) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_FILTERS', settings }, function () {
        // Ignore errors if the content script is not loaded on this tab
        void chrome.runtime.lastError;
      });
    }
  });
}

// 1. Unified function to pull the correct data
async function loadSettingsForCurrentSite() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url) return;
  const domain = new URL(tab.url).hostname;

  chrome.storage.local.get(null, (allData) => {
    // Check if this specific domain exists in our storage
    const siteSettings = allData[domain] || DEFAULTS;
    
    // FORCE the UI to match the storage
    applySettingsToUI(siteSettings);
    console.log(`Loaded settings for ${domain}:`, siteSettings);
  });
}

// 2. Update the save function to use the same logic
async function onSettingsChange() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;
  const domain = new URL(tab.url).hostname;
  const settings = getSettings();

  chrome.storage.local.get(null, (allData) => {
    allData[domain] = settings;
    chrome.storage.local.set(allData);
    sendToActiveTab(settings);
  });
}

document.addEventListener('DOMContentLoaded', loadSettingsForCurrentSite);

function updateFileAccessWarning() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs && tabs[0];
    const isLocalFile = !!(activeTab && typeof activeTab.url === 'string' && activeTab.url.startsWith('file:///'));

    if (!isLocalFile) {
      if (fileWarning) {
        fileWarning.style.display = 'none';
      }
      if (controls) {
        controls.style.opacity = '';
        controls.style.pointerEvents = '';
      }
      return;
    }

    chrome.extension.isAllowedFileSchemeAccess(function (isAllowed) {
      if (!fileWarning || !controls) {
        return;
      }

      if (isAllowed) {
        fileWarning.style.display = 'none';
        controls.style.opacity = '';
        controls.style.pointerEvents = '';
      } else {
        fileWarning.style.display = 'block';
        controls.style.opacity = '0.3';
        controls.style.pointerEvents = 'none';
      }
    });
  });
}

// Load saved settings on popup open
chrome.storage.local.get(DEFAULTS, function (saved) {
  applySettingsToUI(saved);
  updateFileAccessWarning();
});

// Step buttons functionality
document.querySelectorAll('.icon-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const slider = document.getElementById(targetId);
    if (!slider) return;
    
    const step = this.classList.contains('plus-btn') ? 5 : -5;
    const min = parseInt(slider.min, 10);
    const max = parseInt(slider.max, 10);
    let val = parseInt(slider.value, 10);
    
    val += step;
    if (val > max) val = max;
    if (val < min) val = min;
    
    slider.value = val;
    slider.dispatchEvent(new Event('input'));
  });
});

// Attach event listeners
darkModeToggle.addEventListener('change', function() {
  updateToggleVisual();
  onSettingsChange();
});

brightnessSlider.addEventListener('input', function () {
  updateSliderVisual(brightnessSlider);
  brightnessValue.textContent = brightnessSlider.value + '%';
  onSettingsChange();
});

contrastSlider.addEventListener('input', function () {
  updateSliderVisual(contrastSlider);
  contrastValue.textContent = contrastSlider.value + '%';
  onSettingsChange();
});

grayscaleSlider.addEventListener('input', function () {
  updateSliderVisual(grayscaleSlider);
  grayscaleValue.textContent = grayscaleSlider.value + '%';
  onSettingsChange();
});

blueLightSlider.addEventListener('input', function () {
  updateSliderVisual(blueLightSlider);
  blueLightValue.textContent = blueLightSlider.value + '%';
  onSettingsChange();
});

// Add this click listener for the reset button
resetButton.addEventListener('click', function () {
  // 1. Move all the UI sliders and toggles back to default values
  applySettingsToUI(DEFAULTS);
  // 2. Save the defaults to storage and instantly update the active PDF
  onSettingsChange();
});


// Listen for changes made in the background (like keyboard shortcuts)
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'local' && changes.darkMode) {
    // Update the toggle UI to match the new background state
    darkModeToggle.checked = changes.darkMode.newValue;
    updateToggleVisual();
  }
});

// Help the user find the settings page
if (openSettingsBtn) {
  openSettingsBtn.addEventListener('click', function () {
    chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
  });
}