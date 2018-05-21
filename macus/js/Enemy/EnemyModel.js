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
  const _widthPrevObj = Symbol('widthPrevObj');
  const _leftX = Symbol('leftX');
  const _rightX = Symbol('rightX');
  const _speedX = Symbol('speedX');
  const _isExist = Symbol('isExist');
  const _numLifes = Symbol('numLifes');
  const _isHit = Symbol('isHit');
  const _posXBall = Symbol('posXBall');
  const _speedXBall = Symbol('speedXBall');
  const _startPosYBall = Symbol('startPosYBall');
  const _rightBorder = Symbol('rightBorder');
  const _score = Symbol('score');
  const _ballSpeedX = Symbol('ballSpeedX');
  const _isPressed = Symbol('isPressed');
  const _rect = Symbol('rect');
  const _pendingStopGame = Symbol('pendingStopGame');
  const _gameStatus = Symbol('gameStatus');
  const _soundHitEnemy = Symbol('soundHitEnemy');
  const _soundKillMonster = Symbol('soundKillMonster');

  class EnemyModel {
    constructor(widthArea, options, coeffs) {
      this[_view] = null;
      this[_widthArea] = widthArea;
      this[_coeffs] = coeffs;
      this[_options] = options;
      this[_width] = this[_widthArea] / this[_coeffs].widthToRadius * this[_options].width;
      this[_height] = this[_widthArea] / this[_coeffs].widthToRadius * this[_options].height;
      this[_posX] = this[_widthArea] * this[_coeffs].widthToDistance / 100 * this[_options].distance;
      this[_posY] = this[_widthArea] / this[_coeffs].widthToGroundLevel - this[_height];
      this[_radiusBall] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_maxSpeedYBall] = this[_widthArea] / this[_coeffs].widthToMaxSpeedY;
      this[_groundLevel] = this[_widthArea] / this[_coeffs].widthToGroundLevel - this[_radiusBall];
      this[_widthPrevObj] = this[_options].widthPrevObj;
      this[_leftX] = this[_widthArea] * this[_coeffs].widthToDistance / 100 * this[_options].leftX + this[_widthPrevObj];
      this[_rightX] = this[_widthArea] * this[_coeffs].widthToDistance / 100 * this[_options].rightX - this[_width];
      this[_speedX] = this[_widthArea] / this[_coeffs].widthToSpeedEnemy * this[_options].speed;
      this[_isExist] = true;
      this[_numLifes];
      this[_isHit];
      this[_posXBall];
      this[_speedXBall];
      this[_startPosYBall];
      this[_rightBorder];
      this[_score] = 0;
      this[_ballSpeedX] = 0;
      this[_isPressed] = {};
      this[_rect] = {};
      this[_pendingStopGame] = false;
      this[_gameStatus] = 'play';
      this[_soundHitEnemy] = new Audio();
      this[_soundKillMonster] = new Audio();
      this[_soundHitEnemy].src = 'audio/mp3_format/hit_enemy.mp3';
      this[_soundHitEnemy].src = 'audio/ogg_format/hit_enemy.ogg';
      this[_soundKillMonster].src = 'audio/mp3_format/kill_monster.mp3';
      this[_soundKillMonster].src = 'audio/ogg_format/kill_monster.ogg';
      this.onChange = new app.Events(this);
    }
    receiveData(context, data) {
      this[_rect] = data.rect || {};
      this[_isPressed] = data.isPressed || {};
      this[_ballSpeedX] = data.speedX;
      this[_numLifes] = data.numLifes;
      this[_score] = data.score;
      this[_gameStatus] = data.gameStatus ? data.gameStatus : this[_gameStatus];
      this[_pendingStopGame] = data.pendingStopGame ? data.pendingStopGame : this[_pendingStopGame];
    }
    calcPosX() {
       if (this[_gameStatus] === 'play' && !this[_pendingStopGame]) {
        if (this[_rect].x2 > this.getRect().x1 && this[_rect].x1 < this.getRect().x2  && this[_rect].y2 >= this.getRect().y1) {
         this.interactionWithBall();
        }
        if (this[_isPressed].right || this[_isPressed].lastBtn === 'right') {
          this[_posX] -= this[_ballSpeedX];
          this[_rightX] -= this[_ballSpeedX];
          this[_leftX] -= this[_ballSpeedX];
        }
        this[_speedX] = this[_posX] >= this[_rightX] || this[_posX] <= this[_leftX] ? -this[_speedX] : this[_speedX];
        this[_posX] += this[_speedX];
      }
    }
    interactionWithBall() {
      if (this[_rect].x2 - this[_radiusBall] >= this.getRect().x1 && this[_rect].x2 - this[_radiusBall] <= this.getRect().x2) {
        this[_score] = this[_options].val;
        this[_soundKillMonster].play();
        this[_isExist] = this[_isHit] = false;
      } else if (this[_rect].x2 >= this.getRect().x1 && this[_rect].x2 < this.getRect().x2) {
        this[_posXBall] = this.getRect().x1 - this[_radiusBall];
        this[_speedXBall] = 0;
        this[_numLifes] -= 1;
        this[_isExist] = false;
        this[_startPosYBall] = undefined;
        this[_score] = 0;
        app.Helper.vibrate(100);
        this[_isHit] = true;
        this[_soundHitEnemy].play();
      } else if (this[_rect].x2 - this[_radiusBall] >= this.getRect().x2 && this[_rect].x1 <= this.getRect().x2) {
        this[_rightBorder] = this[_speedX] < this[_maxSpeedYBall] / 2 && this[_rightBorder] <= this[_widthArea] / 2 ? this[_rightBorder] + this[_radiusBall] : this[_rightBorder];
        this[_posXBall] = this.getRect().x2 + this[_radiusBall];
        this[_numLifes] -= 1;
        this[_isExist] = false;
        this[_startPosYBall] = undefined;
        this[_score] = 0;
        app.Helper.vibrate(100);
        this[_isHit] = true;
        this[_soundHitEnemy].play();
      } else if (this[_rect].x2 - this[_radiusBall] <= this.getRect().x1 && this[_rect].x2 >= this.getRect().x1) {
        this[_startPosYBall] = this[_groundLevel];
        this[_posXBall] = undefined;
        app.Helper.vibrate(100);
        this[_isHit] = true;
        this[_soundHitEnemy].play();
      } else {
        this[_speedXBall] = this[_posXBall] = undefined;
        this[_startPosYBall] = this.getRect().y1 - this[_radiusBall];
        this[_score] = 0;
        this[_isHit] = false;
      }
      this.onChange.notify({
        speedX: this[_speedXBall], 
        posX: this[_posXBall], 
        rightBorder: this[_rightBorder], 
        startPosYBall: this[_startPosYBall],
        numLifes: this[_numLifes],
        score: this[_score],
        isHit: this[_isHit]
      });
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
      this[_leftX] /= ratio;
      this[_rightX] /= ratio;
      this[_speedX] /= ratio;
      this[_maxSpeedYBall] /= ratio;
      this[_radiusBall] /= ratio;
      this[_groundLevel] /= ratio;
    }
    start(view) {
      this[_view] = view;
    }
    updateView() {
      if (this[_view] && this[_isExist]) {
        this.calcPosX();
        this[_view].update();
      }
    }    
  }

  window.app = window.app || {};
  window.app.EnemyModel = EnemyModel;
})(window);