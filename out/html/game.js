(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // ORIGINAL BG SET FOR CUSTOM MFS

    var _originalSetBg = window.dendryUI.setBg.bind(window.dendryUI);
    window.dendryUI.setBg = function(img) {
      var customBg = localStorage.getItem(TITLE + '_custom_bg');
      if (customBg) {
        document.body.style.backgroundImage = 'url(' + customBg + ')';
      } else {
        _originalSetBg(img);
      }
    };

    // Add your custom code here.
  };

  var TITLE = "Social Fascism: An Alternate Horizon" + '_' + "Gaufenspelt";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.updateSandboxLink = function() {
    var sandboxLink = document.getElementById('sandbox-link');
    if (!sandboxLink) return;
    var sandbox = window.dendryUI.dendryEngine.state.qualities.sandbox;
    sandboxLink.style.display = (sandbox === 1) ? 'inline' : 'none';
  };

  window.showSandbox = function() {
      if (window.dendryUI.dendryEngine.state.sceneId.startsWith('sandbox')) {
          window.dendryUI.dendryEngine.goToScene('backSpecialScene');
      } else {
          window.dendryUI.dendryEngine.goToScene('sandbox');
      }
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showCredits = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('credits')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('credits');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      window.dendryUI.retro_mode = false;
      window.dendryUI.crt_mode = false;
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('crt-mode');
      document.body.classList.remove('retro-mode');
      window.dendryUI.saveSettings();
  };

  window.enableDarkMode = function() {
    window.dendryUI.dark_mode = true;
    window.dendryUI.crt_mode = false; 
    window.dendryUI.retro_mode = false;
    document.body.classList.remove('crt-mode');
    document.body.classList.remove('retro-mode');
    document.body.classList.add('dark-mode');
    window.dendryUI.saveSettings();
  };

  window.enableRetroMode = function() {
    window.dendryUI.retro_mode = true; 
    window.dendryUI.crt_mode = false; 
    window.dendryUI.dark_mode = false;
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('crt-mode');
    document.body.classList.add('retro-mode');
    window.dendryUI.saveSettings();
  };

  window.enableCRTMode = function() {
    window.dendryUI.crt_mode = true;
    window.dendryUI.dark_mode = false;
    window.dendryUI.retro_mode = false;
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('retro-mode');
    document.body.classList.add('crt-mode');
    window.dendryUI.saveSettings();
  };

  // Populates the checkboxes in the options view.
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
    if (window.dendryUI.retro_mode) {
        $('#retro_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
    if (window.dendryUI.crt_mode) {
        $('#crt_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  // This function allows you to modify the text before it's displayed.
  window.displayText = function(text) {
      return text;
  };

  // Refreshes the bottom panel on scene change signals.
  window.handleSignal = function(signal, event, scene_id) {
      if (signal === 'scene-arrival') {
          window.updateBottomPanel();
      }
  };

  // Updates the main sidebar (#qualities) from the current statusTab scene.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  // -----------------------------------------------------------------------
  // BOTTOM PANEL — linked to the 'news' scene (news.scene.dry)
  // -----------------------------------------------------------------------
  var BOTTOM_PANEL_SCENE = 'news';

  window.updateBottomPanel = function() {
      var panel = $('#bottom_panel');
      if (!panel.length) return;

      // Guard: scene must exist before we try to render it.
      var scene = dendryUI.game.scenes[BOTTOM_PANEL_SCENE];
      if (!scene) return;

      panel.empty();
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      panel.append(dendryUI.contentToHTML.convert(displayContent));
  };

  // Tab switching — still 2-arg so existing HTML onclick calls keep working.
  // The optional 3rd arg (target panel selector) is accepted but unused for
  // now since #qualities_2 is left empty.
  window.changeTab = function(newTab, tabId /*, targetPanel */) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (var i = 0; i < tabButtons.length; i++) {
          tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  // Runs on every new page of content.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
    window.updateSandboxLink();
    window.updateBottomPanel();
  };

  // Runs whenever content is displayed.
  window.onDisplayContent = function() {
      window.updateSidebar();
      window.updateBottomPanel();
  };

  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };

  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    if (window.dendryUI.dark_mode)  document.body.classList.add('dark-mode');
    if (window.dendryUI.retro_mode) document.body.classList.add('retro-mode');
    if (window.dendryUI.crt_mode)   document.body.classList.add('crt-mode');
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per x turns.";
    window.updateSandboxLink();
    var savedBg = localStorage.getItem(_BGKEY);
    if (savedBg) {
      $('#bg1').css('background-image', 'url("' + savedBg + '")');
      $('#bg2').css('background-image', 'url("' + savedBg + '")');
    }
    var savedMusic = localStorage.getItem(_MUSICKEY);
    if (savedMusic) {
      var audio = new Audio(savedMusic);
      audio.loop = true;
      audio.volume = 1;
      audio.play();
      window.dendryUI.currentAudio = audio;
      window.dendryUI.currentAudioURL = savedMusic;
    }
    // Restore custom styles
  (function() {
  var saved = window.csLoad ? window.csLoad() : {};
  var colorVars = ['--bg-color','--content-bg-color','--text-color',
                   '--link-color','--border-color','--tab-bg-color'];
  colorVars.forEach(function(v) {
    if (saved[v]) document.body.style.setProperty(v, saved[v]);
  });
  if (saved.fontSize)   document.body.style.fontSize   = saved.fontSize + '%';
  if (saved.fontFamily) document.body.style.fontFamily = saved.fontFamily;
  if (saved.maxWidth)   document.getElementById('page').style.maxWidth = saved.maxWidth + 'px';
  if (saved.overlayOpacity) window._csApplyOverlayOpacityRaw(saved.overlayOpacity);
  if (saved.rawCSS)     window._csInjectRaw(saved.rawCSS);
  })();
  };

 }());



/* =====================================================================
   SUPER EVENT — JS
   ===================================================================== */

const SuperEvent = (() => {
  let _overlay    = null;
  let _video      = null;
  let _leftPanel  = null;
  let _rightPanel = null;
  let _endHandler = null;

  function _init() {
    if (document.getElementById('super-event-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'super-event-overlay';

    // ── FIX 1: innerHTML now includes title, right-body, quote, skip button
    overlay.innerHTML = `
      <div id="super-event-title"></div>
      <div id="super-event-frame">
        <div class="super-event-left"></div>
        <div id="super-event-video-wrap">
          <video preload="auto" playsinline>
            <source src="" type="video/mp4">
          </video>
        </div>
        <div class="super-event-right">
          <div class="super-event-right-body"></div>
          <blockquote class="super-event-quote"></blockquote>
        </div>
      </div>
      <button id="super-event-skip">Skip</button>
    `;

    document.body.appendChild(overlay);

    _overlay    = overlay;
    _video      = overlay.querySelector('video');
    _leftPanel  = overlay.querySelector('.super-event-left');
    _rightPanel = overlay.querySelector('.super-event-right');
  }

  function _close() {
    if (!_overlay) return;

    if (_endHandler) {
      _video.removeEventListener('ended', _endHandler);
      _endHandler = null;
    }

    _video.pause();
    _video.currentTime = 0;

    _overlay.classList.add('fading');

    setTimeout(() => {
      _overlay.classList.remove('active', 'fading');
    }, 600);
  }

  // ── FIX 2: trigger() signature now includes title, quote, quoteCite
  function trigger({ videoSrc, title = '', left = '', right = '', quote = '', quoteCite = '', onClose = null } = {}) {
    _init();

    // ── FIX 3: title element populated before any querySelector calls
    const titleEl = document.getElementById('super-event-title');
    titleEl.textContent  = title;
    titleEl.style.display = title ? '' : 'none';

    // ── FIX 4: left panel set directly, not duplicated
    _leftPanel.innerHTML  = left;
    _leftPanel.style.display = left ? '' : 'none';

    // ── FIX 5: right panel targets inner divs, not _rightPanel itself
    _rightPanel.querySelector('.super-event-right-body').innerHTML = right;
    _rightPanel.style.display = right ? '' : 'none';

    const quoteEl = _rightPanel.querySelector('.super-event-quote');
    quoteEl.innerHTML     = quote ? `${quote}<cite>${quoteCite}</cite>` : '';
    quoteEl.style.display = quote ? '' : 'none';

    // ── FIX 6: skip wired after _init() guarantees the element exists
    document.getElementById('super-event-skip').onclick = () => skip(onClose);

    _video.querySelector('source').src = videoSrc;
    _video.load();

    _overlay.classList.remove('fading');
    _overlay.classList.add('active');

    _video.play().catch(() => {
      console.warn('SuperEvent: autoplay blocked. Waiting for user gesture.');
      _overlay.addEventListener('click', () => _video.play(), { once: true });
    });

    _endHandler = () => {
      setTimeout(() => {
        _close();
        if (typeof onClose === 'function') onClose();
      }, 1000);
    };

    _video.addEventListener('ended', _endHandler, { once: true });
  }

  function skip(onClose = null) {
    _close();
    if (typeof onClose === 'function') {
      setTimeout(onClose, 600);
    }
  }

  return { trigger, skip };

})();



var _BGKEY = 'Social Fascism: An Alternate Horizon_Gaufenspelt_custom_bg';

window.importCustomBg = function(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem(_BGKEY, e.target.result);
    $('#bg1').css('background-image', 'url("' + e.target.result + '")');
    $('#bg2').css('background-image', 'url("' + e.target.result + '")');
    window.dendryUI.disable_bg = false;
    window.dendryUI.saveSettings();
  };
  reader.readAsDataURL(file);
};

window.clearCustomBg = function() {
  localStorage.removeItem(_BGKEY);
  var currentBg = window.dendryUI.dendryEngine.state.bg;
  if (currentBg) {
    window.dendryUI.setBg(currentBg);
  } else {
    document.body.style.backgroundImage = 'none';
  }
  window.dendryUI.saveSettings();
};





var _MUSICKEY = 'Social Fascism: An Alternate Horizon_Gaufenspelt_custom_music';

window.importCustomMusic = function(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var request = indexedDB.open('gaufenspelt_db', 1);
    request.onupgradeneeded = function(e) {
      e.target.result.createObjectStore('assets');
    };
    request.onsuccess = function(e) {
      var db = e.target.result;
      var tx = db.transaction('assets', 'readwrite');
      tx.objectStore('assets').put(e.target.result, 'custom_music');
    };
    // Stop whatever is playing
    if (window.dendryUI.currentAudio) {
      window.dendryUI.currentAudio.pause();
    }
    // Start custom track
    var audio = new Audio(e.target.result);
    audio.loop = true;
    audio.volume = 1;
    audio.play();
    window.dendryUI.currentAudio = audio;
    window.dendryUI.currentAudioURL = e.target.result;
    window.dendryUI.saveSettings();
  };
  reader.readAsDataURL(file);
};

window.clearCustomMusic = function() {
  localStorage.removeItem(_MUSICKEY);
  if (window.dendryUI.currentAudio) {
    window.dendryUI.currentAudio.pause();
    window.dendryUI.currentAudio = null;
  }
  window.dendryUI.saveSettings();
};








// Wait for dendryUI to exist, then patch setBg at the prototype level
var _bgPatchInterval = setInterval(function() {
  if (!window.dendryUI || !window.dendryUI.dendryEngine) return;
  clearInterval(_bgPatchInterval);

  var _originalSetBg = window.dendryUI.setBg.bind(window.dendryUI);
  window.dendryUI.setBg = function(img) {
    var customBg = localStorage.getItem(_BGKEY);
    if (customBg) {
      $('#bg1').css('background-image', 'url("' + customBg + '")');
      $('#bg2').css('background-image', 'url("' + customBg + '")');
    } else {
      _originalSetBg(img);
    }
  };

  var _originalAudio = window.dendryUI.audio.bind(window.dendryUI);
  window.dendryUI.audio = function(audioStr) {
      var customMusic = localStorage.getItem(_MUSICKEY);
      if (customMusic) return; // ignore scene-driven audio changes
      _originalAudio(audioStr);
    };
}, 100);








var _CS_KEY = 'Social Fascism: An Alternate Horizon_Gaufenspelt_custom_style';

var _csDefaults = {
  '--bg-color':          null,
  '--content-bg-color':  null,
  '--text-color':        null,
  '--link-color':        null,
  '--border-color':      null,
  '--tab-bg-color':      null,
  fontSize:              null,
  fontFamily:            null,
  overlayOpacity:        null,
  maxWidth:              null,
  rawCSS:                null,
};

// Reads a CSS variable from the current body style
var _csGetVar = function(varName) {
  return getComputedStyle(document.body).getPropertyValue(varName).trim();
};

window.showCustomStyle = function() {
  window.csPopulate();
  document.getElementById('custom-style').style.display = 'block';
  var el = document.getElementById('custom-style');
  if (!el.onclick) {
    el.onclick = function(evt) {
      if (evt.target === el) window.hideCustomStyle();
    };
  }
};

window.hideCustomStyle = function() {
  document.getElementById('custom-style').style.display = 'none';
};

window.csPopulate = function() {
  var saved = window.csLoad();
  // Color pickers — fall back to computed value if not saved
  var colorMap = {
    'cs_bg_color':      '--bg-color',
    'cs_content_bg':    '--content-bg-color',
    'cs_text_color':    '--text-color',
    'cs_link_color':    '--link-color',
    'cs_border_color':  '--border-color',
    'cs_tab_color':     '--tab-bg-color',
  };
  for (var id in colorMap) {
    var varName = colorMap[id];
    var el = document.getElementById(id);
    if (!el) continue;
    var val = saved[varName] || _csGetVar(varName);
    // color inputs need #rrggbb format
    if (val && !val.startsWith('#')) {
      // skip non-hex values (rgba etc) — leave picker at default
    } else if (val) {
      el.value = val;
    }
    el.onchange = (function(v) {
      return function(e) { window.csApplyVar(v, e.target.value); };
    })(varName);
  }
  // Font size
  if (saved.fontSize) {
    document.getElementById('cs_font_size').value = saved.fontSize;
    document.getElementById('cs_font_size_label').textContent = saved.fontSize + '%';
    document.body.style.fontSize = saved.fontSize + '%';
  }
  // Font family
  if (saved.fontFamily) {
    document.getElementById('cs_font').value = saved.fontFamily;
    document.body.style.fontFamily = saved.fontFamily;
  }
  // Overlay opacity
  if (saved.overlayOpacity) {
    document.getElementById('cs_overlay_opacity').value = saved.overlayOpacity;
    document.getElementById('cs_overlay_opacity_label').textContent = saved.overlayOpacity + '%';
    window._csApplyOverlayOpacityRaw(saved.overlayOpacity);
  }
  // Max width
  if (saved.maxWidth) {
    document.getElementById('cs_max_width').value = saved.maxWidth;
    document.getElementById('cs_max_width_label').textContent = saved.maxWidth + 'px';
    document.getElementById('page').style.maxWidth = saved.maxWidth + 'px';
  }
  // Raw CSS
  if (saved.rawCSS) {
    document.getElementById('cs_raw_css').value = saved.rawCSS;
    window._csInjectRaw(saved.rawCSS);
  }
};

window.csApplyVar = function(varName, value) {
  document.body.style.setProperty(varName, value);
  var saved = window.csLoad();
  saved[varName] = value;
  window.csSave(saved);
};

window.csReset = function(varName) {
  document.body.style.removeProperty(varName);
  var saved = window.csLoad();
  delete saved[varName];
  window.csSave(saved);
  window.csPopulate();
};

window.csApplyFontSize = function(val) {
  document.getElementById('cs_font_size_label').textContent = val + '%';
  document.body.style.fontSize = val + '%';
  var saved = window.csLoad();
  saved.fontSize = val;
  window.csSave(saved);
};

window.csResetFontSize = function() {
  document.body.style.fontSize = '';
  document.getElementById('cs_font_size').value = 100;
  document.getElementById('cs_font_size_label').textContent = '100%';
  var saved = window.csLoad();
  delete saved.fontSize;
  window.csSave(saved);
};

window.csApplyFont = function(val) {
  document.body.style.fontFamily = val || '';
  var saved = window.csLoad();
  saved.fontFamily = val;
  window.csSave(saved);
};

window.csResetFont = function() {
  document.body.style.fontFamily = '';
  document.getElementById('cs_font').value = '';
  var saved = window.csLoad();
  delete saved.fontFamily;
  window.csSave(saved);
};

window._csApplyOverlayOpacityRaw = function(val) {
  var opacity = val / 100;
  var style = document.getElementById('cs-overlay-opacity-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'cs-overlay-opacity-style';
    document.head.appendChild(style);
  }
  style.textContent = '.overlay { background: rgba(0,0,0,' + opacity + ') !important; }';
};

window.csApplyOverlayOpacity = function(val) {
  document.getElementById('cs_overlay_opacity_label').textContent = val + '%';
  window._csApplyOverlayOpacityRaw(val);
  var saved = window.csLoad();
  saved.overlayOpacity = val;
  window.csSave(saved);
};

window.csResetOverlayOpacity = function() {
  var style = document.getElementById('cs-overlay-opacity-style');
  if (style) style.textContent = '';
  document.getElementById('cs_overlay_opacity').value = 88;
  document.getElementById('cs_overlay_opacity_label').textContent = '88%';
  var saved = window.csLoad();
  delete saved.overlayOpacity;
  window.csSave(saved);
};

window.csApplyMaxWidth = function(val) {
  document.getElementById('cs_max_width_label').textContent = val + 'px';
  document.getElementById('page').style.maxWidth = val + 'px';
  var saved = window.csLoad();
  saved.maxWidth = val;
  window.csSave(saved);
};

window.csResetMaxWidth = function() {
  document.getElementById('page').style.maxWidth = '';
  document.getElementById('cs_max_width').value = 1150;
  document.getElementById('cs_max_width_label').textContent = '1150px';
  var saved = window.csLoad();
  delete saved.maxWidth;
  window.csSave(saved);
};

window._csInjectRaw = function(css) {
  var style = document.getElementById('cs-raw-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'cs-raw-style';
    document.head.appendChild(style);
  }
  style.textContent = css;
};

window.csApplyRaw = function() {
  var css = document.getElementById('cs_raw_css').value;
  window._csInjectRaw(css);
  var saved = window.csLoad();
  saved.rawCSS = css;
  window.csSave(saved);
};

window.csResetRaw = function() {
  window._csInjectRaw('');
  document.getElementById('cs_raw_css').value = '';
  var saved = window.csLoad();
  delete saved.rawCSS;
  window.csSave(saved);
};

window.csResetAll = function() {
  localStorage.removeItem(_CS_KEY);
  // Remove inline styles
  ['--bg-color','--content-bg-color','--text-color',
   '--link-color','--border-color','--tab-bg-color'].forEach(function(v) {
    document.body.style.removeProperty(v);
  });
  document.body.style.fontSize   = '';
  document.body.style.fontFamily = '';
  document.getElementById('page').style.maxWidth = '';
  var s1 = document.getElementById('cs-raw-style');
  if (s1) s1.textContent = '';
  var s2 = document.getElementById('cs-overlay-opacity-style');
  if (s2) s2.textContent = '';
  window.csPopulate();
};

window.csSave = function(data) {
  try { localStorage.setItem(_CS_KEY, JSON.stringify(data)); } catch(e) {}
};

window.csLoad = function() {
  try {
    var raw = localStorage.getItem(_CS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
};
