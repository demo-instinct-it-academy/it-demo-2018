(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _coeffs = Symbol('coeffs');
  const _widthArea = Symbol('widthArea');
  const _heightArea = Symbol('heightArea');
  const _mainAudio = Symbol('mainAudio');

  class SPAView {
    constructor(widthArea, coeffs) {
      this[_model] = null;
      this[_field] = null;
      this[_coeffs] = coeffs;
      this[_widthArea] = widthArea;
      this[_heightArea] = this[_widthArea] / this[_coeffs].widthToHeight;
      this[_mainAudio] = new Audio();
      this[_mainAudio].src = 'audio/mp3_format/main_melody.mp3';
      this[_mainAudio].src = 'audio/ogg_format/main_melody.ogg';
      this[_mainAudio].loop = true;
      this[_mainAudio].volume = '0.5';
      this.onChange = new app.Events(this);
    }
    receiveData(context, data) {
      if (data.playMainAudio === false) {
        this[_mainAudio].pause();
        this[_mainAudio].currentTime = 0;
      }
    }
    renderPage() {
      if (this[_model].SPAState.pagename) {
        switch (this[_model].SPAState.pagename) {
          case 'levels':
            this[_field].textContent = '';
            this[_field].appendChild(this.createLevelsMenu());
            this[_model].switchToState({pagename: 'levels'});
            this.onChange.notify({game: 'stop'});
            break;
          case 'play-level-1':
            this[_field].textContent = '';
            this[_field].appendChild(this.createGameArea());
            this[_model].switchToState({pagename: 'play-level-1'});
            this[_mainAudio].play();
            this[_mainAudio].volume = '0.5';
            this.onChange.notify({game: 'start', level: 1});
            break;
          case 'play-level-2':
            this[_field].textContent = '';
            this[_field].appendChild(this.createGameArea());
            this[_model].switchToState({pagename: 'play-level-2'});
            this[_mainAudio].play();
            this[_mainAudio].volume = '0.5';
            this.onChange.notify({game: 'start', level: 2});
            break;
          case 'main':
            this[_field].textContent = '';
            this[_field].appendChild(this.createMenu(this[_model].buttonsCls));
            this[_model].switchToState({pagename: 'main'});
            this.onChange.notify({game: 'stop'});
            break;
          case 'records':
            this[_field].textContent = '';
            this[_field].appendChild(this.createRecords(this[_model].storage));
            this[_model].switchToState({pagename: 'records'});
            break;
          case 'about':
            this[_field].textContent = '';
            this[_field].appendChild(this.createAbout(this[_model].text));
            this[_model].switchToState({pagename: 'about'});
            break;
          default:
            this[_model].switchToState({pagename: 'main'});
            this.onChange.notify({game: 'stop'});
        }
      }
    }
    createMenuWireframe() {
      let menuWrap = document.createElement('div');
      let caption = document.createElement('div');
      let menu = document.createElement('div');
      $(menuWrap).addClass('menu-wrap');
      $(caption).addClass('menu-caption').appendTo(menu);
      $(menu).addClass('menu').appendTo(menuWrap);
      return menuWrap;
    }
    createMenu(buttonsCls) {
      let menuWrap = this.createMenuWireframe();
      let ul = document.createElement('ul');
      for (let i = 0; i < buttonsCls.length; i++) {
        $('<li></li>').addClass('menu-btns ' + buttonsCls[i]).appendTo(ul);
      }
      $(menuWrap).find('.menu').addClass('menu-main').append(ul);
      return menuWrap;
    }
    createLevelsMenu() {
      let menuWrap = document.createElement('div');
      let menuLevels = document.createElement('div');
      $(menuWrap).addClass('menu-wrap').append(menuLevels);
      $(menuLevels).addClass('menu-level').append($('<div></div>').addClass('level level-1'))
                                          .append($('<div></div>').addClass('level level-2'));
      $(menuLevels).append($('<div></div>').addClass('btn-back'));
      return menuWrap;
    }
    createRecords(arr) {
      let menuWrap = this.createMenuWireframe();
      let ul = document.createElement('ul');
      if (arr.records.length) {
        for (let k = 0; k < arr.records.length; k++) {
          $('<li></li>').text(arr.records[k].name + ' : ' + arr.records[k].score).appendTo(ul);
        }
      }
      $(menuWrap).find('.menu').addClass('menu-records');
      $(menuWrap).find('.menu').append(ul).append($('<div></div>').addClass('btn-back'));
      return menuWrap;
    }
    createAbout() {
      let menuWrap = this.createMenuWireframe();
      let ul = document.createElement('ul');
      for (let j = 1; j <= 6; j++) {
        $('<li></li>').append($('<div></div>').addClass('crystal crystal-val-' + (j * 10)))
                      .append($('<span></span>').text(' = ' + (j * 10)))
                      .appendTo(ul);
      }
      $('<li></li>').addClass('text-monster').append($('<div></div>')).append($('<span> = 100</span>')).appendTo(ul);
      $(menuWrap).find('.menu').addClass('menu-about').append(ul).append($('<div></div>').addClass('btn-back'));
      return menuWrap;
    }
    createGameArea() {
      let canvasWrap = document.createElement('div');
      let canvas = $('<canvas></canvas>').attr('id', 'game-canvas');
      let controlsWrap = $('<div></div>').addClass('controls-wrap');
      let controlsMoveWrap = $('<div></div>').addClass('ctrl-btn-move-wrap').appendTo(controlsWrap);

      $('<div></div>').addClass('btn-tap-jump').appendTo(controlsWrap);
      $('<div></div>').addClass('btn-tap-left btn-tap').appendTo(controlsMoveWrap);
      $('<div></div>').addClass('btn-tap-right btn-tap').appendTo(controlsMoveWrap);

      canvas.width = this[_widthArea];
      canvas.height = this[_heightArea];

      $(canvasWrap).addClass('canvas-wrap')
                   .append(canvas)
                   .append($('<div></div>').addClass('btn-pause'))
                   .append(this.createPauseMenu())
                   .append(controlsWrap);
      return canvasWrap;
    }
    createPauseMenu() {
      let pauseMenuOuter = document.createElement('div');
      let pauseMenuInner = $('<div></div>').addClass('pause-menu-inner');
      let pauseMenu = $('<div></div>').addClass('pause-menu').appendTo(pauseMenuInner);
      $('<div></div>').addClass('btn-return').appendTo(pauseMenu);
      $('<div></div>').addClass('btn-sound').appendTo(pauseMenu);
      $('<div></div>').addClass('btn-exit').appendTo(pauseMenu);
      $(pauseMenuOuter).addClass('pause-menu-outer').append(pauseMenuInner);
      return pauseMenuOuter;
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
    }
    updatePage() {
      this.renderPage();
    }
    updateAudio() {
      this[_mainAudio].volume = this[_model].mainAudioVol;
      if (this[_model].mainAudio === 'pause') {
        this[_mainAudio].pause();
        this[_mainAudio].currentTime = 0;
      }
    }
  }

  window.app = window.app || {};
  window.app.SPAView = SPAView;
})(window);