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

  function spawnWeimarBullshit() {
    const junk = [
        "SOZIALFASCHISMUS", "MONOCLE!", "REVALUATION NOW", "1914 VIBES", 
        "HINDENBURG IS SLEEPING", "CABBAGE", "DADA", "THE KAISER?", 
        "STRESEMANN'S GHOST", "POTATO PRICES ↑", "PUTSCH!", "VOID", "ERROR 1923"
    ];

    setInterval(() => {
        if (Q.april_challenge !== 1) return;

        const el = document.createElement('div');
        el.className = 'debris';
        el.innerText = junk[Math.floor(Math.random() * junk.length)];
        
        // Random positioning
        el.style.left = Math.random() * 90 + "vw";
        el.style.fontSize = (Math.random() * 20 + 10) + "px";
        el.style.color = Math.random() > 0.5 ? "#900" : "#000";
        
        // Random speed
        const duration = Math.random() * 10 + 5;
        el.style.animationDuration = duration + "s";

        document.body.appendChild(el);

        // Cleanup
        setTimeout(() => el.remove(), duration * 1000);
    }, 800); // Spawns a new piece of junk every 0.8 seconds
}

if (Q.april_challenge === 1) {
    spawnWeimarBullshit();
}



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
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
    window.updateSandboxLink();
  };

}());
