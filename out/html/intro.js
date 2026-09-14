window.IntroScreen = (function () {

  var _config = {
    slides: [
      { title: 'Welcome', text: 'This is the default intro slide. Call IntroScreen.configure() to customize it.' }
    ],
    onComplete: null,        // fn() called when intro finishes / is skipped
    allowSkipAll: true,      // show a "Skip" link that jumps straight to end
    autoAdvanceDefault: false,
    autoAdvanceDelayDefault: 4000 // ms
  };

  /* ── Independent settings (own storage key) ─────────────────────── */
  var _SETTINGS_KEY = 'intro_screen_settings_v1';
  var _settings = {
    animate: true,
    showImages: true,
    autoAdvance: _config.autoAdvanceDefault,
    autoAdvanceDelay: _config.autoAdvanceDelayDefault,
    seen: false
  };

  function _loadSettings() {
    try {
      var raw = localStorage.getItem(_SETTINGS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        for (var k in parsed) {
          if (Object.prototype.hasOwnProperty.call(_settings, k)) {
            _settings[k] = parsed[k];
          }
        }
      }
    } catch (e) { /* ignore corrupt storage */ }
  }

  function _saveSettings() {
    try {
      localStorage.setItem(_SETTINGS_KEY, JSON.stringify(_settings));
    } catch (e) { /* ignore quota errors */ }
  }

  /* ── State ───────────────────────────────────────────────────────── */
  var _el = null;              // root overlay element
  var _currentIdx = 0;
  var _autoTimer = null;
  var _built = false;

  /* ── DOM construction (built once, lazily) ──────────────────────── */
  function _ensureDom() {
    if (_built) return;
    _built = true;

    _el = document.createElement('div');
    _el.id = 'intro-screen-overlay';
    _el.className = 'intro-screen-overlay';
    _el.style.display = 'none';

    _el.innerHTML =
      '<div class="intro-screen-backdrop"></div>' +
      '<div class="intro-screen-frame">' +
        '<div class="intro-screen-image-wrap">' +
          '<img class="intro-screen-image" id="intro-screen-image" alt="" style="display:none;">' +
        '</div>' +
        '<div class="intro-screen-text-wrap">' +
          '<h1 class="intro-screen-title" id="intro-screen-title" style="display:none;"></h1>' +
          '<p class="intro-screen-text" id="intro-screen-text"></p>' +
        '</div>' +
        '<div class="intro-screen-progress" id="intro-screen-progress"></div>' +
        '<div class="intro-screen-controls">' +
          '<button type="button" class="intro-screen-btn intro-screen-settings-btn" id="intro-screen-settings-btn" title="Settings">&#9881;</button>' +
          '<div class="intro-screen-controls-right">' +
            '<button type="button" class="intro-screen-btn intro-screen-skip-btn" id="intro-screen-skip-btn">Skip</button>' +
            '<button type="button" class="intro-screen-btn intro-screen-next-btn" id="intro-screen-next-btn">Continue</button>' +
          '</div>' +
        '</div>' +
        '<div class="intro-screen-settings-panel" id="intro-screen-settings-panel" style="display:none;">' +
          '<table>' +
            '<tr><td>Transitions:</td>' +
              '<td><label><input type="checkbox" id="intro-set-animate"> Enabled</label></td></tr>' +
            '<tr><td>Images:</td>' +
              '<td><label><input type="checkbox" id="intro-set-images"> Shown</label></td></tr>' +
            '<tr><td>Auto-advance:</td>' +
              '<td><label><input type="checkbox" id="intro-set-auto"> Enabled</label></td></tr>' +
            '<tr><td>Delay (sec):</td>' +
              '<td><input type="range" id="intro-set-delay" min="1" max="12" step="0.5">' +
                  '<span id="intro-set-delay-label"></span></td></tr>' +
          '</table>' +
        '</div>' +
      '</div>';

    document.body.appendChild(_el);

    // Click backdrop -> does nothing by default (intro shouldn't be
    // dismissed accidentally); Skip/Continue are the intended exits.

    document.getElementById('intro-screen-next-btn').onclick = function () { _advance(); };
    document.getElementById('intro-screen-skip-btn').onclick = function () { _finish(); };
    document.getElementById('intro-screen-settings-btn').onclick = function () { _toggleSettingsPanel(); };

    document.getElementById('intro-set-animate').onchange = function (e) {
      _settings.animate = e.target.checked; _saveSettings();
    };
    document.getElementById('intro-set-images').onchange = function (e) {
      _settings.showImages = e.target.checked; _saveSettings();
      _renderSlide(); // re-render to reflect toggle immediately
    };
    document.getElementById('intro-set-auto').onchange = function (e) {
      _settings.autoAdvance = e.target.checked; _saveSettings();
      _resetAutoTimer();
    };
    document.getElementById('intro-set-delay').oninput = function (e) {
      _settings.autoAdvanceDelay = Math.round(parseFloat(e.target.value) * 1000);
      document.getElementById('intro-set-delay-label').textContent = e.target.value + 's';
      _saveSettings();
      _resetAutoTimer();
    };
  }

  function _toggleSettingsPanel() {
    var panel = document.getElementById('intro-screen-settings-panel');
    if (!panel) return;
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
  }

  function _populateSettingsPanel() {
    document.getElementById('intro-set-animate').checked = _settings.animate;
    document.getElementById('intro-set-images').checked = _settings.showImages;
    document.getElementById('intro-set-auto').checked = _settings.autoAdvance;
    var delayVal = (_settings.autoAdvanceDelay / 1000);
    document.getElementById('intro-set-delay').value = delayVal;
    document.getElementById('intro-set-delay-label').textContent = delayVal + 's';
  }

  /* ── Slide rendering ─────────────────────────────────────────────── */
  function _renderSlide() {
    var slides = _config.slides || [];
    if (_currentIdx >= slides.length) { _finish(); return; }
    var slide = slides[_currentIdx] || {};

    var imgEl   = document.getElementById('intro-screen-image');
    var titleEl = document.getElementById('intro-screen-title');
    var textEl  = document.getElementById('intro-screen-text');
    var nextBtn = document.getElementById('intro-screen-next-btn');
    var progEl  = document.getElementById('intro-screen-progress');

    var frame = _el.querySelector('.intro-screen-frame');
    var doFade = _settings.animate;

    function applyContent() {
      if (slide.image && _settings.showImages) {
        imgEl.src = slide.image;
        imgEl.style.display = 'block';
        imgEl.onerror = function () { imgEl.style.display = 'none'; };
      } else {
        imgEl.style.display = 'none';
        imgEl.removeAttribute('src');
      }

      if (slide.title) {
        titleEl.textContent = slide.title;
        titleEl.style.display = 'block';
      } else {
        titleEl.style.display = 'none';
      }

      textEl.textContent = slide.text || '';

      var isLast = (_currentIdx === slides.length - 1);
      nextBtn.textContent = isLast ? 'Begin' : 'Continue';

      progEl.innerHTML = '';
      for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement('span');
        dot.className = 'intro-screen-dot' + (i === _currentIdx ? ' active' : '');
        progEl.appendChild(dot);
      }

      if (doFade) {
        frame.classList.remove('intro-fade-in');
        void frame.offsetWidth; // force reflow to restart animation
        frame.classList.add('intro-fade-in');
      }
    }

    if (doFade && _currentIdx > 0) {
      frame.classList.add('intro-fade-out');
      setTimeout(function () {
        frame.classList.remove('intro-fade-out');
        applyContent();
      }, 220);
    } else {
      applyContent();
    }

    _resetAutoTimer();
  }

  function _resetAutoTimer() {
    if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
    if (_settings.autoAdvance) {
      _autoTimer = setTimeout(function () { _advance(); }, _settings.autoAdvanceDelay);
    }
  }

  function _advance() {
    _currentIdx++;
    var slides = _config.slides || [];
    if (_currentIdx >= slides.length) {
      _finish();
    } else {
      _renderSlide();
    }
  }

  function _finish() {
    if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
    _settings.seen = true;
    _saveSettings();
    if (_el) _el.style.display = 'none';
    document.body.classList.remove('intro-screen-open');
    if (typeof _config.onComplete === 'function') {
      _config.onComplete();
    }
  }

  /* ── Public API ──────────────────────────────────────────────────── */
  function configure(opts) {
    opts = opts || {};
    if (opts.slides && opts.slides.length) _config.slides = opts.slides;
    if (typeof opts.onComplete === 'function') _config.onComplete = opts.onComplete;
    if (typeof opts.allowSkipAll === 'boolean') _config.allowSkipAll = opts.allowSkipAll;
    if (typeof opts.autoAdvanceDefault === 'boolean') {
      _config.autoAdvanceDefault = opts.autoAdvanceDefault;
      if (!_settingsLoadedOnce) _settings.autoAdvance = opts.autoAdvanceDefault;
    }
    if (typeof opts.autoAdvanceDelayDefault === 'number') {
      _config.autoAdvanceDelayDefault = opts.autoAdvanceDelayDefault;
      if (!_settingsLoadedOnce) _settings.autoAdvanceDelay = opts.autoAdvanceDelayDefault;
    }
  }

  var _settingsLoadedOnce = false;

  function show(opts) {
    opts = opts || {};
    _ensureDom();
    if (!_settingsLoadedOnce) { _loadSettings(); _settingsLoadedOnce = true; }

    if (_settings.seen && !opts.force) {
      // Already seen and not forced — treat as an immediate no-op completion.
      if (typeof _config.onComplete === 'function') _config.onComplete();
      return;
    }

    _currentIdx = (typeof opts.startAt === 'number') ? opts.startAt : 0;

    var skipBtn = document.getElementById('intro-screen-skip-btn');
    if (skipBtn) skipBtn.style.display = _config.allowSkipAll ? 'inline-block' : 'none';

    document.getElementById('intro-screen-settings-panel').style.display = 'none';
    _populateSettingsPanel();

    _el.style.display = 'block';
    document.body.classList.add('intro-screen-open');
    _renderSlide();
  }

  function hasBeenSeen() {
    if (!_settingsLoadedOnce) { _loadSettings(); _settingsLoadedOnce = true; }
    return !!_settings.seen;
  }

  function resetSeen() {
    if (!_settingsLoadedOnce) { _loadSettings(); _settingsLoadedOnce = true; }
    _settings.seen = false;
    _saveSettings();
  }

  return {
    configure:   configure,
    show:        show,
    hasBeenSeen: hasBeenSeen,
    resetSeen:   resetSeen
  };

})();

// Single-call trigger, per the requested "on function" interface.
window.showIntro = function (opts) {
  window.IntroScreen.show(opts);
};
