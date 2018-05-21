(function (window) {
  'use strict';
  const _view = Symbol('view');
  const _widthArea = Symbol('widthArea');
  const _options = Symbol('options');
  const _coeffs = Symbol('coeffs');
  const _width = Symbol('width');
  const _height = Symbol('height');
  const _posX = Symbol('posX');
  const _posY = Symbol('posY');
  const _speedX = Symbol('speedX');
  const _isPressed = Symbol('isPressed');
  const _rect = Symbol('rect');
  const _isExist = Symbol('isExist');
  const _isEmpty = Symbol('isEmpty');
  const _soundCollectCrystal = Symbol('soundCollectCrystal');

  class ObjectForCollectModel {
    constructor(widthArea, options, coeffs) {
      this[_view] = null;
      this[_widthArea] = widthArea;
      this[_options] = options;
      this[_coeffs] = coeffs;
      this[_width] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_height] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_posX] = this[_widthArea] * this[_coeffs].widthToDistance / 100 * this[_options].distance;
      this[_posY] = this[_widthArea] / this[_coeffs].widthToRadius * this[_options].vLoc;
      this[_speedX] = 0;
      this[_isPressed] = {};
      this[_rect];
      this[_isExist] = true;
      this[_isEmpty] = new app.Helper().isEmpty;
      this.onChange = new app.Events(this);
      this[_soundCollectCrystal] = new Audio();
      this[_soundCollectCrystal].src = 'audio/mp3_format/collected_crystal.mp3';
      this[_soundCollectCrystal].src = 'audio/ogg_format/collected_crystal.ogg';
    }
    set newSizes(ratio) {
      this[_width] /= ratio;
      this[_height] /= ratio;
      this[_posY] /= ratio;
      this[_posX] /= ratio;
    }
    getRect() {
      return {
        x1: this[_posX],
        x2: this[_posX] + this[_width],
        y1: this[_posY],
        y2: this[_posY] + this[_height],
        width: this[_width],
        height: this[_height]
      };
    }
    receiveData(context, data) {
      this[_rect] = data.rect;
      this[_speedX] = data.speedX;
      this[_isPressed] = data.isPressed;
    }
    interactionWithBall() {
      if (this[_rect] && !this[_isEmpty](this[_rect], this.getRect())) {
        this[_soundCollectCrystal].play();
        this.onChange.notify({score: this[_options].val});
        this[_isExist] = false; 
      }
    }
    calcPosX() {
      if (this[_isPressed].right || this[_isPressed].lastBtn === 'right') {
        this[_posX] -= this[_speedX];
      }
    }
    start(view) {
      this[_view] = view;
    }
    updateView() {
      if (this[_view] && this[_isExist]) {
        this.interactionWithBall();
        this.calcPosX();
        this[_view].update();
      }
    }
  }

  window.app = window.app || {};
  window.app.ObjectForCollectModel = ObjectForCollectModel;
})(window);