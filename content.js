(function () {
  'use strict';

  const DEFAULTS = {
    darkMode: false,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    blueLight: 0,
  };

  // Avoid injecting multiple times (e.g., in same-page navigations)
  if (document.getElementById('pdf-master-dark-overlay')) {
    return;
  }

  // --- Main filter overlay ---
  const filterOverlay = document.createElement('div');
  filterOverlay.id = 'pdf-master-dark-overlay';
  filterOverlay.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 2147483647',
    'transition: filter 0.2s, background-color 0.2s, mix-blend-mode 0.2s',
  ].join('; ');

  // --- Blue light filter overlay ---
  const blueLightOverlay = document.createElement('div');
  blueLightOverlay.id = 'pdf-master-bluelight-overlay';
  blueLightOverlay.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 2147483646',
    'background-color: #FF8C00',
    'opacity: 0',
    'transition: opacity 0.2s',
  ].join('; ');

  document.documentElement.appendChild(filterOverlay);
  document.documentElement.appendChild(blueLightOverlay);

  function applySettings(settings) {
    const s = Object.assign({}, DEFAULTS, settings);

    // CSS filter on the main overlay
    filterOverlay.style.filter =
      'brightness(' + s.brightness + '%) ' +
      'contrast(' + s.contrast + '%) ' +
      'grayscale(' + s.grayscale + '%)';

    // Dark mode: mix-blend-mode difference + white background
    if (s.darkMode) {
      filterOverlay.style.mixBlendMode = 'difference';
      filterOverlay.style.backgroundColor = 'white';
    } else {
      filterOverlay.style.mixBlendMode = 'normal';
      filterOverlay.style.backgroundColor = 'transparent';
    }

    // Blue light filter opacity (0–50 mapped to 0–0.5)
    blueLightOverlay.style.opacity = (s.blueLight / 100).toString();
  }

  // Load saved settings and apply immediately
  chrome.storage.local.get(DEFAULTS, function (saved) {
    applySettings(saved);
  });

  // Listen for live updates from the popup
  chrome.runtime.onMessage.addListener(function (message) {
    if (message && message.type === 'UPDATE_FILTERS') {
      applySettings(message.settings);
    }
  });
})();
