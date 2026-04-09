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
    var savedBg = localStorage.getItem(TITLE + '_custom_bg');
    if (savedBg) {
      document.body.style.backgroundImage = 'url(' + savedBg + ')';
    }
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





window.importCustomBg = function() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      var dataUrl = evt.target.result;
      window.dendryUI.disable_bg = false;
      // Store in localStorage so it persists across sessions
      localStorage.setItem(TITLE + '_custom_bg', dataUrl);
      document.body.style.backgroundImage = 'url(' + dataUrl + ')';
      window.dendryUI.saveSettings();
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

window.clearCustomBg = function() {
  localStorage.removeItem(TITLE + '_custom_bg');
  // Fall back to the game's normal bg system
  window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
  window.dendryUI.saveSettings();
};

window.importCustomBg = function(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem(TITLE + '_custom_bg', e.target.result);
    document.body.style.backgroundImage = 'url(' + e.target.result + ')';
    window.dendryUI.disable_bg = false;
    window.dendryUI.saveSettings();
  };
  reader.readAsDataURL(file);
};

window.clearCustomBg = function() {
  localStorage.removeItem(TITLE + '_custom_bg');
  window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
  window.dendryUI.saveSettings();
};
