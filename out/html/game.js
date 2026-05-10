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

    // TAG LIMITATIONS PART STARTS -------------

    // Tag limits for hand
    var TAG_LIMITS = {
        party_affairs: 3,
        govt_affairs: 3
    };

    var originalDrawCard = dendryUI.dendryEngine.drawCard.bind(dendryUI.dendryEngine);
    dendryUI.dendryEngine.drawCard = function(deckId) {
        var engine = dendryUI.dendryEngine;
        var currentSceneId = engine.state.sceneId;
        var currentHand = engine.state.currentHands[currentSceneId] || [];

        // Get the card that would be drawn
        var card = engine._drawFromDeck(deckId);
        if (!card) return {id: null, title: 'no_card_in_deck'};

        // Check tag limits
        for (var tag in TAG_LIMITS) {
            var taggedIds = game.tagLookup[tag];
            if (taggedIds && taggedIds[card.id]) {
                var count = currentHand.filter(function(c) {
                    return taggedIds[c.id];
                }).length;
                if (count >= TAG_LIMITS[tag]) {
                    return {id: null, title: 'no_space_for_tag'};
                }
            }
        }

        return originalDrawCard(deckId);
    };

    var originalDisplayHand = dendryUI.displayHand.bind(dendryUI);
    dendryUI.displayHand = function(hand, maxCards) {
    originalDisplayHand(hand, maxCards);
    
    var handItems = document.querySelectorAll('.card-in-hand');
    handItems.forEach(function(item) {
        var cardLink = item.querySelector('a.card');
        if (!cardLink) return;
        var cardId = cardLink.getAttribute('card-id');
        if (!cardId) return;
        
        var tags = game.tagLookup;
        item.classList.remove('tag-party_affairs', 'tag-govt_affairs', 'tag-other');
        if (tags.party_affairs && tags.party_affairs[cardId]) {
            item.classList.add('tag-party_affairs');
        } else if (tags.govt_affairs && tags.govt_affairs[cardId]) {
            item.classList.add('tag-govt_affairs');
        } else {
            item.classList.add('tag-other');
        }
    });
   };
  // TAG LIMITATIONS PART ENDED HERE.

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
    var keywords = {

        // ── German Reichstag parties ──────────────────────────────
        'KPD':   '#8B0000',
        'SPD':   '#E3000F',
        'DDP':   '#DCCA4A',
        'DVP':   '#D5AC27',
        'DNVP':  '#3F7BC1',
        'NSDAP': '#954B00',
        'SAPD':  '#C40000',
        'ASPD':  '#B22222',
        'SRPD':  '#FF6B6B',
        'WP':    '#808080',
        'CNBL':  '#5D4E37',
        'CSRP':  '#FFCCFF',
        'VRP':   '#69413C',
        'CSVD':  '#5E76FF',
        'BB':    '#36FF64',
        'DHP':   '#518A60',
        'HL':    '#2E8B57',
        'SL':    '#005B96',
        'VNR':   '#4B5320',
        'DVFP':  '#7A5C12',
        'KVP':   '#6699FF',
        'LB':    '#6B0000',
        'RDP':   '#B8B000',
        'CVP':   '#555555',
        'SLS':   '#4A7C59',
        'DTSP':  '#3B1A00',
        'KPO':   '#990000',

        // Centre Party (Z) — avoid single-letter match, use full name below
        'Zentrum': '#333333',
        'BVP':   '#69A2BE',

        // ── Austrian Nationalrat parties ──────────────────────────
        'SDAPÖ': '#C0392B',
        'SDAPO': '#C0392B',
        'KPÖ':   '#8B0000',
        'KPOE':  '#8B0000',
        'CS':    '#2E4F9E',
        'GDVP':  '#1A6B4A',
        'Landbund':   '#8B6914',
        'Heimatblock': '#7D3C98',
        'DNSAP': '#2C2C2C',

        // ── Ideology & movements ──────────────────────────────────
        // Socialism / left
        'socialism':     '#E3000F',
        'socialist':     '#E3000F',
        'socialists':    '#E3000F',
        'Socialism':     '#E3000F',
        'Socialist':     '#E3000F',
        'Socialists':    '#E3000F',
        'communism':     '#8B0000',
        'communist':     '#8B0000',
        'communists':    '#8B0000',
        'Communism':     '#8B0000',
        'Communist':     '#8B0000',
        'Communists':    '#8B0000',
        'Bolshevik':     '#8B0000',
        'Bolsheviks':    '#8B0000',
        'bolshevik':     '#8B0000',
        'Marxism':       '#C0392B',
        'Marxist':       '#C0392B',
        'marxism':       '#C0392B',
        'marxist':       '#C0392B',
        'proletariat':   '#E3000F',
        'Proletariat':   '#E3000F',
        'workers':       '#E3000F',
        'Workers':       '#E3000F',
        'labour':        '#E3000F',
        'Labour':        '#E3000F',
        'trade union':   '#E3000F',
        'Trade Union':   '#E3000F',

        // Nationalism / right
        'nationalism':   '#954B00',
        'nationalist':   '#954B00',
        'nationalists':  '#954B00',
        'Nationalism':   '#954B00',
        'Nationalist':   '#954B00',
        'Nationalists':  '#954B00',
        'fascism':       '#7A3B00',
        'fascist':       '#7A3B00',
        'fascists':      '#7A3B00',
        'Fascism':       '#7A3B00',
        'Fascist':       '#7A3B00',
        'Fascists':      '#7A3B00',
        'Nazi':          '#954B00',
        'Nazis':         '#954B00',
        'nazi':          '#954B00',
        'Putsch':        '#7A3B00',
        'putsch':        '#7A3B00',
        'coup':          '#7A3B00',
        'Coup':          '#7A3B00',
        'reactionary':   '#3F7BC1',
        'Reactionary':   '#3F7BC1',
        'conservative':  '#3F7BC1',
        'Conservative':  '#3F7BC1',

        // Liberalism / centre
        'liberal':       '#DCCA4A',
        'Liberal':       '#DCCA4A',
        'liberalism':    '#DCCA4A',
        'Liberalism':    '#DCCA4A',
        'democracy':     '#D5AC27',
        'Democracy':     '#D5AC27',
        'democratic':    '#D5AC27',
        'Democratic':    '#D5AC27',

        // Republic — German tricolor: black / red / gold
        // Three separate styled words via a chained trick isn't possible per-word,
        // so we color "Republic" in the gold of the Weimar flag and add a subtle glow
        'Republic':      '#DCCA4A',
        'republic':      '#DCCA4A',
        'Weimar':        '#DCCA4A',
        'weimar':        '#DCCA4A',
        'Reichstag':     '#D5AC27',
        'reichstag':     '#D5AC27',
        'Reich':         '#C0392B',
        'reich':         '#C0392B',

        // Government / institutions
        'Chancellor':    '#B8B000',
        'chancellor':    '#B8B000',
        'President':     '#B8B000',
        'president':     '#B8B000',
        'Reichswehr':    '#4B5320',
        'reichswehr':    '#4B5320',
        'Stormtroopers': '#954B00',
        'stormtroopers': '#954B00',
        'SA':            '#954B00',
        'SS':            '#1a1a1a',
        'Gestapo':       '#1a1a1a',
        'Freikorps':     '#3F7BC1',
        'freikorps':     '#3F7BC1',

        // Economics
        'inflation':     '#FF6B00',
        'Inflation':     '#FF6B00',
        'depression':    '#808080',
        'Depression':    '#808080',
        'unemployment':  '#808080',
        'Unemployment':  '#808080',
        'strike':        '#E3000F',
        'Strike':        '#E3000F',
        'capital':       '#D5AC27',
        'Capital':       '#D5AC27',
        'capitalism':    '#D5AC27',
        'Capitalism':    '#D5AC27',

        // War & revolution
        'revolution':    '#8B0000',
        'Revolution':    '#8B0000',
        'war':           '#4B5320',
        'War':           '#4B5320',
        'Armistice':     '#518A60',
        'armistice':     '#518A60',
        'Versailles':    '#808080',
    };

    // Sort by length descending so longer matches (e.g. "NSDAP") win over shorter ones
    var sorted = Object.keys(keywords).sort(function(a, b) {
        return b.length - a.length;
    });

    sorted.forEach(function(word) {
        var color = keywords[word];
        // Escape special regex chars in the keyword
        var escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Word boundary — but allow spaces inside multi-word phrases
        var regex = new RegExp('(?<![\\w-])(' + escaped + ')(?![\\w-])', 'g');
        text = text.replace(regex,
            '<span style="color:' + color + ';font-weight:600;text-shadow:0 0 8px ' + color + '33;">' + '$1' + '</span>'
        );
    });

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
   SUPER EVENT — JS  v2.1
   ===================================================================== */

const SuperEvent = (() => {

  /* ── Private state ──────────────────────────────────────────────── */
  let _overlay      = null;
  let _video        = null;
  let _leftPanel    = null;
  let _rightPanel   = null;
  let _videoWrap    = null;
  let _endHandler   = null;
  let _staticCanvas = null;
  let _staticRAF    = null;
  let _active       = false;
  let _audio        = null;
  let _imageDurTimer = null;

  /* ── Queue state ────────────────────────────────────────────────── */
  let _queue        = [];
  let _queueRunning = false;

  /* ── DOM init ───────────────────────────────────────────────────── */
  function _init() {
    if (document.getElementById('super-event-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'super-event-overlay';

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
    _videoWrap  = overlay.querySelector('#super-event-video-wrap');
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function _clearClasses(el, prefix) {
    [...el.classList].filter(c => c.startsWith(prefix)).forEach(c => el.classList.remove(c));
  }

  function _setOrHide(el, value, html = false) {
    if (value) {
      if (html) el.innerHTML = value;
      else el.textContent = value;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }

  /* ── Static canvas effect ───────────────────────────────────────── */
  function _startStatic() {
    if (_staticCanvas) return;
    const c = document.createElement('canvas');
    c.id = 'se-static-canvas';
    c.width  = 320;
    c.height = 240;
    _videoWrap.appendChild(c);
    _staticCanvas = c;

    const ctx = c.getContext('2d');
    function draw() {
      const img = ctx.createImageData(c.width, c.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() > 0.5 ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      _staticRAF = requestAnimationFrame(draw);
    }
    draw();
  }

  function _stopStatic() {
    if (_staticRAF) { cancelAnimationFrame(_staticRAF); _staticRAF = null; }
    if (_staticCanvas) { _staticCanvas.remove(); _staticCanvas = null; }
  }

  /* ── Audio helpers ──────────────────────────────────────────────── */
  function _startAudio({ audioSrc, audioVolume = 1, audioLoop = false }) {
    _stopAudio();
    if (!audioSrc) return;
    _audio = new Audio(audioSrc);
    _audio.volume = Math.min(1, Math.max(0, audioVolume));
    _audio.loop   = audioLoop;
    _audio.play().catch(() => {
      console.warn('SuperEvent: audio autoplay blocked — waiting for gesture.');
      _overlay.addEventListener('click', () => _audio?.play(), { once: true });
    });
  }

  function _stopAudio() {
    if (_audio) {
      _audio.pause();
      _audio.currentTime = 0;
      _audio = null;
    }
  }

  /* ── Shatter effect ─────────────────────────────────────────────── */
  function _triggerShatter(cb) {
    const cols = 6, rows = 4;
    const grid = document.createElement('div');
    grid.id = 'se-shatter-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;
    _videoWrap.appendChild(grid);

    const tiles = [];
    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement('div');
      tile.className = 'se-shatter-tile';
      tile.style.setProperty('--se-tile-rot', `${(Math.random() * 60 - 30).toFixed(1)}deg`);
      grid.appendChild(tile);
      tiles.push(tile);
    }

    // Stagger break
    tiles.forEach((t, i) => {
      setTimeout(() => t.classList.add('breaking'), i * 28 + Math.random() * 40);
    });

    setTimeout(() => {
      grid.remove();
      if (typeof cb === 'function') cb();
    }, 800);
  }

  /* ── Close ──────────────────────────────────────────────────────── */
  function _close(effect) {
    if (!_overlay || !_active) return;
    _active = false;

    if (_endHandler) {
      _video.removeEventListener('ended', _endHandler);
      _endHandler = null;
    }

    if (_imageDurTimer) {
      clearTimeout(_imageDurTimer);
      _imageDurTimer = null;
    }

    _stopAudio();
    _video.pause();
    _video.currentTime = 0;

    if (effect === 'shatter') {
      _triggerShatter(() => {
        _overlay.classList.add('fading');
        setTimeout(() => {
          _overlay.classList.remove('active', 'fading');
          _stopStatic();
        }, 600);
      });
    } else {
      _overlay.classList.add('fading');
      setTimeout(() => {
        _overlay.classList.remove('active', 'fading');
        _stopStatic();
      }, 600);
    }
  }

  /* ── Trigger ────────────────────────────────────────────────────── */
  function trigger(opts = {}) {
    const {
      // Media
      videoSrc    = '',
      imageSrc    = null,
      imageCaption = null,
      posterSrc   = null,
      leftImage   = null,
      rightImage  = null,

      // Content
      title       = '',
      left        = '',
      right       = '',
      quote       = '',
      quoteCite   = '',

      // Layout
      size        = 'md',       // 'sm' | 'md' | 'lg' | 'full'
      layout      = 'default',  // 'default' | 'video-only' | 'left-only' | 'right-only' | 'centered'
      videoRatio  = '16:9',     // '16:9' | '4:3' | '1:1' | '21:9'

      // Effects
      effect      = 'none',     // 'none' | 'glitch' | 'cinematic' | 'static' | 'shatter'
      scanlines   = false,
      vignette    = false,
      ambientColor = null,

      // Playback
      muted       = false,
      loop        = false,
      autoClose   = true,
      startAt     = 0,

      // Audio
      audioSrc    = null,
      audioVolume = 1,
      audioLoop   = false,

      // Image duration
      duration    = null,   // ms — auto-close delay for imageSrc (null = stay open)

      // Visibility
      showSkip    = true,
      showTitle   = true,
      showQuote   = true,

      // Hooks
      onOpen      = null,
      onClose     = null,
      onSkip      = null,
    } = opts;

    return new Promise(resolve => {
      _init();

      // Guard: remove stale end handler on rapid re-trigger
      if (_endHandler) {
        _video.removeEventListener('ended', _endHandler);
        _endHandler = null;
      }

      /* ── Reset overlay classes ──────────────────────────────────── */
      _clearClasses(_overlay, 'size-');
      _clearClasses(_overlay, 'layout-');
      _clearClasses(_overlay, 'effect-');
      _clearClasses(_overlay, 'ratio-');
      _overlay.classList.remove('scanlines', 'vignette', 'ambient-glow');

      /* ── Apply config classes ───────────────────────────────────── */
      _overlay.classList.add(`size-${size}`);
      if (layout !== 'default') _overlay.classList.add(`layout-${layout}`);
      if (effect !== 'none')    _overlay.classList.add(`effect-${effect}`);
      if (scanlines)            _overlay.classList.add('scanlines');
      if (vignette)             _overlay.classList.add('vignette');

      if (ambientColor) {
        _overlay.classList.add('ambient-glow');
        _overlay.style.setProperty('--se-ambient-color', ambientColor);
      }

      /* ── Ratio ──────────────────────────────────────────────────── */
      _clearClasses(_videoWrap, 'ratio-');
      const ratioClass = 'ratio-' + videoRatio.replace(':', '-');
      _videoWrap.classList.add(ratioClass);

      /* ── Title ──────────────────────────────────────────────────── */
      const titleEl = document.getElementById('super-event-title');
      if (showTitle && title) {
        titleEl.textContent = title;
        titleEl.style.display = '';
      } else {
        titleEl.style.display = 'none';
      }

      /* ── Media: image or video ──────────────────────────────────── */
      // Remove any previous injected image
      const prevImg = _videoWrap.querySelector('img.se-hero-image');
      if (prevImg) prevImg.remove();
      const prevCap = _videoWrap.querySelector('.se-image-caption');
      if (prevCap) prevCap.remove();

      if (imageSrc) {
        _video.style.display = 'none';
        const img = document.createElement('img');
        img.className = 'se-hero-image';
        img.src = imageSrc;
        img.alt = title || '';
        _videoWrap.insertBefore(img, _videoWrap.firstChild);

        if (imageCaption) {
          const cap = document.createElement('div');
          cap.className = 'se-image-caption';
          cap.textContent = imageCaption;
          _videoWrap.appendChild(cap);
        }
      } else {
        _video.style.display = '';
        const src = _video.querySelector('source');
        src.src = videoSrc;
        if (posterSrc) _video.poster = posterSrc;
        _video.muted      = muted;
        _video.loop       = loop;
        _video.currentTime = 0;
        _video.load();

        if (startAt > 0) {
          _video.addEventListener('loadedmetadata', () => {
            _video.currentTime = startAt;
          }, { once: true });
        }
      }

      /* ── Left panel ─────────────────────────────────────────────── */
      let leftContent = left;
      if (leftImage) leftContent = `<img src="${leftImage}" style="width:100%;display:block;margin-bottom:0.5rem;" alt="">` + left;
      _setOrHide(_leftPanel, leftContent, true);

      /* ── Right panel ────────────────────────────────────────────── */
      let rightContent = right;
      if (rightImage) rightContent = `<img src="${rightImage}" style="width:100%;display:block;margin-bottom:0.5rem;" alt="">` + right;
      _rightPanel.querySelector('.super-event-right-body').innerHTML = rightContent || '';
      _rightPanel.style.display = (right || rightImage || (showQuote && quote)) ? '' : 'none';

      const quoteEl = _rightPanel.querySelector('.super-event-quote');
      if (showQuote && quote) {
        quoteEl.innerHTML = `${quote}<cite>${quoteCite}</cite>`;
        quoteEl.style.display = '';
      } else {
        quoteEl.style.display = 'none';
      }

      /* ── Skip button ────────────────────────────────────────────── */
      const skipBtn = document.getElementById('super-event-skip');
      skipBtn.style.display = showSkip ? '' : 'none';
      skipBtn.onclick = () => {
        _close(effect);
        if (typeof onSkip === 'function') onSkip();
        setTimeout(() => {
          if (typeof onClose === 'function') onClose();
          resolve();
        }, 600);
      };

      /* ── Static effect ──────────────────────────────────────────── */
      _stopStatic();
      if (effect === 'static') _startStatic();

      /* ── Show overlay ───────────────────────────────────────────── */
      _overlay.classList.remove('fading');
      _overlay.classList.add('active');
      _active = true;

      if (typeof onOpen === 'function') onOpen();

      /* ── Audio ──────────────────────────────────────────────────── */
      _startAudio({ audioSrc, audioVolume, audioLoop });

      /* ── Autoplay ───────────────────────────────────────────────── */
      if (!imageSrc) {
        _video.play().catch(() => {
          console.warn('SuperEvent: autoplay blocked — waiting for gesture.');
          _overlay.addEventListener('click', () => _video.play(), { once: true });
        });
      }

      /* ── End handler ────────────────────────────────────────────── */
      if (!imageSrc && !loop) {
        _endHandler = () => {
          if (!autoClose) return;
          setTimeout(() => {
            _close(effect);
            setTimeout(() => {
              if (typeof onClose === 'function') onClose();
              resolve();
            }, 600);
          }, 1000);
        };
        _video.addEventListener('ended', _endHandler, { once: true });
      }

      // Image: auto-close after duration if set
      if (imageSrc && autoClose && duration != null) {
        _imageDurTimer = setTimeout(() => {
          _close(effect);
          setTimeout(() => {
            if (typeof onClose === 'function') onClose();
            resolve();
          }, 600);
        }, duration);
      }
    });
  }

  /* ── Queue ──────────────────────────────────────────────────────── */
  function queue(events = []) {
    _queue = [...events];
    if (!_queueRunning) _runQueue();
  }

  function _runQueue() {
    if (_queue.length === 0) { _queueRunning = false; return; }
    _queueRunning = true;
    const next = _queue.shift();
    const original = next.onClose;
    trigger({
      ...next,
      onClose: () => {
        if (typeof original === 'function') original();
        _runQueue();
      }
    });
  }

  /* ── Skip (public) ──────────────────────────────────────────────── */
  function skip(onCloseCb = null) {
    const effect = _overlay
      ? [..._overlay.classList].find(c => c.startsWith('effect-'))?.replace('effect-', '') || 'none'
      : 'none';
    _close(effect);
    if (typeof onCloseCb === 'function') {
      setTimeout(onCloseCb, 600);
    }
  }

  /* ── Close (public) ─────────────────────────────────────────────── */
  function close(onCloseCb = null) {
    skip(onCloseCb);
  }

  /* ── isActive ───────────────────────────────────────────────────── */
  function isActive() {
    return _active;
  }

  return { trigger, skip, close, queue, isActive };

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
