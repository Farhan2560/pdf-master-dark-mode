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

const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const grayscaleValue = document.getElementById('grayscaleValue');
const blueLightValue = document.getElementById('blueLightValue');

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

  brightnessValue.textContent = settings.brightness + '%';
  contrastValue.textContent = settings.contrast + '%';
  grayscaleValue.textContent = settings.grayscale + '%';
  blueLightValue.textContent = settings.blueLight + '%';
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

function onSettingsChange() {
  const settings = getSettings();
  chrome.storage.local.set(settings);
  sendToActiveTab(settings);
}

// Load saved settings on popup open
chrome.storage.local.get(DEFAULTS, function (saved) {
  applySettingsToUI(saved);
});

// Attach event listeners
darkModeToggle.addEventListener('change', onSettingsChange);

brightnessSlider.addEventListener('input', function () {
  brightnessValue.textContent = brightnessSlider.value + '%';
  onSettingsChange();
});

contrastSlider.addEventListener('input', function () {
  contrastValue.textContent = contrastSlider.value + '%';
  onSettingsChange();
});

grayscaleSlider.addEventListener('input', function () {
  grayscaleValue.textContent = grayscaleSlider.value + '%';
  onSettingsChange();
});

blueLightSlider.addEventListener('input', function () {
  blueLightValue.textContent = blueLightSlider.value + '%';
  onSettingsChange();
});
