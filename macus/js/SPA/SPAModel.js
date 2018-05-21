(function (window) {
  'use strict';
  const _view = Symbol('view');
  const _URLHash = Symbol('URLHash');
  const _stateJSON = Symbol('stateJSON');
  const _mainAudioVol = Symbol('mainAudioVol');
  const _mainAudioState = Symbol('mainAudioState');
  const _ajaxHandlerScript = Symbol('ajaxHandlerScript');
  const _storageName = Symbol('storageName');
  const _storage = Symbol('storage');
  const _numLifes = Symbol('numLifes');
  const _buttonsCls = Symbol('buttonsCls');
  const _SPAState = Symbol('SPAState');
  const _hoverSound = Symbol('hoverSound');

  class SPAModel {
    constructor() {
      this[_view] = null;
      this[_URLHash] = null;
      this[_stateJSON] = '';
      this[_mainAudioVol] = '0.5';
      this[_mainAudioState] = 'play';
      this[_ajaxHandlerScript] = 'https://fe.it-academy.by/AjaxStringStorage2.php';
      this[_storageName] = 'MAKUS_RED_BALL';
      this[_storage] = {records: []};
      this[_numLifes];
      this[_buttonsCls] = ['btn-play', 'btn-records', 'btn-about'];
      this[_SPAState] = '';
      this[_hoverSound] = new Audio();
      this[_hoverSound].src = 'audio/mp3_format/hover_sound.mp3';
      this[_hoverSound].src = 'audio/ogg_format/hover_sound.ogg';
    }
    receiveData(context, data) {
      this[_numLifes] = data.numLifes;
      if (data.user) {
        this[_storage] = this.limitRecordsNumber(this[_storage], data.user);
        this.sendToStorage(this[_storage]);
      }
    }
    limitRecordsNumber(arr, data) {
      if (arr.records && data) {
        arr.records.push(data);
        arr.records.sort((a, b) => b.score - a.score);
        if (arr.records.length > 10) {
          arr.records.pop();
        }
        return arr;
      }
    }
    get hoverSound() {
      return this[_hoverSound];
    }
    get storage() {
      return this[_storage];
    }
    get SPAState() {
      return this[_SPAState];
    }
    get buttonsCls() {
      return this[_buttonsCls];
    }
    set mainAudio(state) {
      this[_mainAudioState] = state;
      this.updateAudio();
    }
    get mainAudio() {
      return this[_mainAudioState];
    }
    set mainAudioVol(volume) {
      this[_mainAudioVol] = volume;
      this.updateAudio();
    }
    get mainAudioVol() {
      return this[_mainAudioVol];
    }
    switchToStateFromURLHash() {
      this[_URLHash] = window.location.hash;
      try {
        this[_stateJSON] = JSON.parse(decodeURIComponent(this[_URLHash].substr(1)));
      } catch(e) {
        this[_stateJSON] = '';
      }
      this[_SPAState] = this[_stateJSON] !== '' ? this[_stateJSON] : {pagename: 'main'};
      this.updateView();
    }
    switchToStartPage() {
      this[_SPAState] = {pagename: 'main'};
      this.updateView();
    }
    switchToState(newState) {
      location.hash = encodeURIComponent(JSON.stringify(newState));
    }
    errorHandler(jqXHR, statusStr, errorStr) {
     alert(statusStr + ' ' + errorStr);
    }
    successHandler(data) {
      this[_storage] = JSON.parse(data.result) || {records: []};
    }
    readFromStorage() {
      $.ajax(
        {
          url: this[_ajaxHandlerScript],
          type: 'POST',
          data: {f: 'READ', n: this[_storageName]},
          cache: false,
          success: this.successHandler.bind(this),
          error: this.errorHandler.bind(this)
        }
      );
    }
    sendToStorage() {
      this._updatePassword = Math.random(); 
      $.ajax(
        {
          url: this[_ajaxHandlerScript],
          type: 'POST',
          data: {
            f: 'LOCKGET', 
            n: this[_storageName],
            p: this._updatePassword
          },
          cache: false,
          success: this.lockGetReady.bind(this),
          error: this.errorHandler.bind(this)
        }
      );
    }
    lockGetReady() {
      $.ajax(
        {
          url: this[_ajaxHandlerScript],
          type: 'POST',
          data: {
            f: 'UPDATE', 
            n: this[_storageName],
            v: JSON.stringify(this[_storage]), 
            p: this._updatePassword
          },
          cache: false,
          error: this.errorHandler.bind(this)
        }
      );
    }
    start(view) {
      this[_view] = view;
    }
    updateView() {
      if (this[_view]) {
         this[_view].updatePage();
      }
    }
    updateAudio() {
      if (this[_view]) {
         this[_view].updateAudio();
      }
    }
  }

  window.app = window.app || {};
  window.app.SPAModel = SPAModel;
})(window);