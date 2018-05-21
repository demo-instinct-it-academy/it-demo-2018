(function (window) {
  'use strict';
  const _view = Symbol('view');
  const _widthArea = Symbol('widthArea');
  const _coeffs = Symbol('coeffs');
  const _options = Symbol('options');
  const _width = Symbol('width');
  const _height = Symbol('height');
  const _posX = Symbol('posX');
  const _posY = Symbol('posY');
  const _radiusBall = Symbol('radiusBall');
  const _maxSpeedYBall = Symbol('maxSpeedYBall');
  const _groundLevel = Symbol('groundLevel');
  const _rightBorder = Symbol('rightBorder');
  const _posXBall = Symbol('posXBall');
  const _speedXBall = Symbol('speedXBall');
  const _startPosYBall = Symbol('startPosYBall');
  const _rect = Symbol('rect');
  const _speedX = Symbol('speedX');
  const _isPressed = Symbol('isPressed');

  class StaticBarrierModel {
    constructor(widthArea, options, coeffs) {
      this[_view] = null;
      this[_widthArea] = widthArea;
      this[_coeffs] = coeffs;
      this[_options] = options;
      this[_width] = this[_widthArea] / this[_coeffs].widthToRadius * this[_options].width;
      this[_height] = this[_widthArea] / this[_coeffs].widthToRadius * this[_options].height;
      this[_posX] = (this[_widthArea] * this[_coeffs].widthToDistance) / 100 * this[_options].distance;
      this[_posY] = this[_widthArea] / this[_coeffs].widthToGroundLevel - this[_height];
      this[_radiusBall] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_maxSpeedYBall] = this[_widthArea] / this[_coeffs].widthToMaxSpeedY;
      this[_groundLevel] = this[_widthArea] / this[_coeffs].widthToGroundLevel - this[_radiusBall];
      this[_rightBorder];
      this[_posXBall];
      this[_speedXBall];
      this[_startPosYBall];
      this[_rect] = {};
      this[_speedX] = 0;
      this[_isPressed] = {};
      this.onChange = new app.Events(this);
    }
    receiveData(context, data) {
      this[_rect] = data.rect;
      this[_speedX] = data.speedX;
      this[_isPressed] = data.isPressed;
      this[_rightBorder] = data.rightBorder;
    }
    calcPosX() {
      if (this[_rect].x2 > this.getRect().x1 && this[_rect].x1 < this.getRect().x2) {
        this.interactionWithBall();
      }
      if (this[_isPressed].right || this[_isPressed].lastBtn === 'right') {
        this[_posX] -= this[_speedX];
      }
    }
    interactionWithBall() {
      if (this[_rect].x2 >= this.getRect().x1 && this[_rect].x2 - this[_radiusBall] < this.getRect().x2 && this[_rect].y2 > this.getRect().y1) {
        this[_posXBall] = this.getRect().x1 - this[_radiusBall];
        this[_speedXBall] = 0;
        this[_startPosYBall] = undefined;
      } else if (this[_rect].x2 - this[_radiusBall] >= this.getRect().x2 && this[_rect].x1 <= this.getRect().x2 && this[_rect].y2 >= this.getRect().y1) {
        this[_rightBorder] = this[_rightBorder] <= this[_widthArea] / 2 ? this[_rightBorder] + this[_radiusBall] : this[_rightBorder];
        this[_posXBall] = this.getRect().x2 + this[_radiusBall];
        this[_startPosYBall] = undefined;
      } else if (this[_rect].x2 - this[_radiusBall] <= this.getRect().x1 && this[_rect].x2 >= this.getRect().x1 && this[_rect].y2 >= this.getRect().y1) {
        this[_startPosYBall] = this[_groundLevel];
        this[_posXBall] = undefined;
      } else {
        this[_speedXBall] = this[_posXBall] = undefined;
        this[_startPosYBall] = this.getRect().y1 - this[_radiusBall];
      }
      this.onChange.notify({speedX: this[_speedXBall], posX: this[_posXBall], rightBorder: this[_rightBorder], startPosYBall: this[_startPosYBall]});
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
    set newSizes(ratio) {
      this[_width] /= ratio;
      this[_height] /= ratio;
      this[_posX] /= ratio;
      this[_posY] /= ratio;
      this[_maxSpeedYBall] /= ratio;
      this[_radiusBall] /= ratio;
      this[_groundLevel] /= ratio;
      this[_rightBorder] /= ratio;
      this[_widthArea] /= ratio;
    }
    start(view) {
      this[_view] = view;
    }
    updateView() {
      this.calcPosX();
      if (this[_view]) {
         this[_view].update();
      }
    }
  }

  window.app = window.app || {};
  window.app.StaticBarrierModel = StaticBarrierModel;
})(window);