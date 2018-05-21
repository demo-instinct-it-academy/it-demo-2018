(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _pendingStopGame = Symbol('pendingStopGame');

  class BallController {
    constructor() {
      this[_model] = null;
      this[_pendingStopGame] = false;
    }
    receiveData(context, data) {
      this[_pendingStopGame] = data.pendingStopGame ? data.pendingStopGame : this[_pendingStopGame];
    }
    start(model) {
      this[_model] = model;
      document.addEventListener('keydown', this.keyDownHandler.bind(this));
      document.addEventListener('keyup', this.keyUpHandler.bind(this));
      document.body.addEventListener('touchstart', this.startTapHandler.bind(this));
      document.body.addEventListener('touchend', this.endTapHandler.bind(this));
    }
    keyDownHandler(e) {
      e = e || window.e;
      if (!this[_pendingStopGame]) {
        if(e.keyCode === 39) {
          this[_model].isPressed = {key: 'right', value: true};
        } else if(e.keyCode === 37) {
          this[_model].isPressed = {key: 'left', value: true};
        } else if (e.keyCode === 38) {
          this[_model].isPressed = {key: 'up', value: true};
        } 
      }
    }
    keyUpHandler(e) {
      e = e || window.e;
      if (!this[_pendingStopGame]) {
        if(e.keyCode === 39) {
          this[_model].isPressed = {key: 'right', value: false};
        } else if(e.keyCode === 37) {
          this[_model].isPressed = {key: 'left', value: false};
        } else if (e.keyCode === 38) {
          this[_model].isPressed = {key: 'up', value: false};
        }
      }
    }
    startTapHandler(e) {
      e = e || window.e;
      if (!this[_pendingStopGame]) {
        if(e.target.className === 'btn-tap-right btn-tap') {
          app.Helper.vibrate(20);
          this[_model].isPressed = {key :'right', value: true};
        } else if(e.target.className === 'btn-tap-left btn-tap') {
          app.Helper.vibrate(20);
          this[_model].isPressed = {key :'left', value: true};
        } else if (e.target.className === 'btn-tap-jump') {
          app.Helper.vibrate(20);
          this[_model].isPressed = {key :'up', value: true};
        }
      }
    }
    endTapHandler(e) {
      e = e || window.e;
      if (!this[_pendingStopGame]) {
        if(e.target.className === 'btn-tap-right btn-tap') {
          this[_model].isPressed = {key :'right', value: false};
        } else if(e.target.className === 'btn-tap-left btn-tap') {
          this[_model].isPressed = {key :'left', value: false};
        } else if (e.target.className === 'btn-tap-jump') {
          this[_model].isPressed = {key :'up', value: false};
        }
      }
    }
  }

  window.app = window.app || {};
  window.app.BallController = BallController;
})(window);