(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _game = Symbol('game');
  const _isQuit = Symbol('isQuit');

  class SPAController {
    constructor() {
    this[_model] = null;
    this[_field] = null;
    this[_game] = null;
    this[_isQuit] = null;
    this.onChange = new app.Events(this);
    }
    receiveData(context, data) {
      this[_game] = data.game;
    }
    clickToBtn(e) {
      e = e || window.e;
      switch (e.target.className) {
        case 'level level-1':
          this[_model].switchToState({pagename: 'play-level-1'});
          app.Helper.vibrate(20);
          break;
        case 'level level-2':
          this[_model].switchToState({pagename: 'play-level-2'});
          app.Helper.vibrate(20);
          break;
        case 'btn-return':
          $('.pause-menu-outer').removeClass('show');
          this.onChange.notify({gameStatus: 'play'});
          break;
        case 'btn-sound':
        case 'btn-sound sound-off':
          $('.btn-sound').toggleClass('sound-off');
          let vol = e.target.className === 'btn-sound' ? '0.5' : '0';
          this[_model].mainAudioVol = vol;
          app.Helper.vibrate(20);
          break;
        case 'btn-exit':
          this[_isQuit] = confirm('The progress of the game will be lost! Do you really want to leave?');
          if (this[_isQuit]) {
            this[_model].switchToState({pagename: 'main'});
            this[_model].mainAudio = 'pause';
          } else {
            $('.pause-menu-outer').removeClass('show');
            this.onChange.notify({gameStatus: 'play'});
          }
          app.Helper.vibrate(20);
          break;
        case 'btn-back':
          this[_model].switchToState({pagename: 'main'});
          this[_model].mainAudio = 'pause';
          app.Helper.vibrate(20);
          break;
        case 'btn-pause':
          $('.pause-menu-outer').addClass('show');
          this.onChange.notify({gameStatus: 'pause'});
          app.Helper.vibrate(20);
          break;
        case 'menu-btns btn-play':
          this[_model].switchToState({pagename: 'levels'});
          app.Helper.vibrate(20);
          break;
        case 'menu-btns btn-records':
          this[_model].switchToState({pagename: 'records'});
          app.Helper.vibrate(20);
          break; 
        case 'menu-btns btn-about':
          this[_model].switchToState({pagename: 'about'});
          app.Helper.vibrate(20);
          break; 
      }
    }
    hoverOnBtn(e) {
      e = e || window.e;
      if ($(e.target).hasClass('menu-btns')) {
        this.hoverSound.play();
      }
    }
    hashChangeHandler() {
      if (this[_game] === 'start' && !this[_isQuit]) {
        if (confirm('The progress of the game will be lost! Continue?')) {
          this[_model].switchToState({pagename: 'levels'});
          this[_model].switchToStateFromURLHash();
          this[_model].mainAudio = 'pause';
        }
      } else {
        this[_model].switchToStateFromURLHash();
        this[_isQuit] = false;
      }
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
      $(window).on('load', () => {
        this[_model].readFromStorage();
        this[_model].switchToStartPage();
      });
      $(window).on('hashchange', this.hashChangeHandler.bind(this));
      $(this[_field]).on('click', this.clickToBtn.bind(this));
      $(this[_field]).on('mouseover', this.hoverOnBtn.bind(this[_model]));
      window.onbeforeunload = function(e) {
        e = e || window.e;
        e.returnValue = 'All unsaved data will be lost!';
      };
    }
  }

  window.app = window.app || {};
  window.app.SPAController = SPAController;
})(window);