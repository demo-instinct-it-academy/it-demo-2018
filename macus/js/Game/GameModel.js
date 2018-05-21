(function (window) {
  'use strict';
  const _view = Symbol('view');
  const _widthArea = Symbol('widthArea');
  const _distance = Symbol('distance');
  const _coeffs = Symbol('coeffs');
  const _widthFlag = Symbol('widthFlag');
  const _heightFlag = Symbol('heightFlag');
  const _widthIconDist = Symbol('widthIconDist');
  const _heightIconDist = Symbol('heightIconDist');
  const _x1IconDist = Symbol('x1IconDist');
  const _x1IconWorm = Symbol('x1IconWorm');
  const _y1IconDist = Symbol('y1IconDist');
  const _widthIconLifes = Symbol('widthIconLifes');
  const _heightIconLifes = Symbol('heightIconLifes');
  const _x1IconLifes = Symbol('x1IconLifes');
  const _y1IconLifes = Symbol('y1IconLifes');
  const _posX = Symbol('posX');
  const _posY = Symbol('posY');
  const _radiusBall = Symbol('radiusBall');
  const _isGameRunning = Symbol('isGameRunning');
  const _rect = Symbol('rect');
  const _score = Symbol('score');
  const _numLifes = Symbol('numLifes');
  const _speedX = Symbol('speedX');
  const _isPressed = Symbol('isPressed');
  const _soundLevelWin = Symbol('soundLevelWin');
  const _soundLose = Symbol('soundLose');

  class GameModel {
    constructor(widthArea, distance, coeffs) {
      this[_view] = null;
      this[_widthArea] = widthArea;
      this[_distance] = distance;
      this[_coeffs] = coeffs;
      this[_widthFlag] = this[_widthArea] / this[_coeffs].widthToRadius * 2;
      this[_heightFlag] = this[_widthArea] / this[_coeffs].widthToRadius * 4;
      this[_widthIconDist] = this[_widthArea] / 3;
      this[_heightIconDist] = this[_widthArea] / 35;
      this[_x1IconDist] = this[_widthArea] / 1.7;
      this[_x1IconWorm] = this[_x1IconDist];
      this[_y1IconDist] = this[_widthArea] / 130;
      this[_widthIconLifes] = this[_widthArea] / 6;
      this[_heightIconLifes] = this[_widthArea] / 30;
      this[_x1IconLifes] = this[_widthArea] / 6;
      this[_y1IconLifes] = this[_widthArea] / 130;
      this[_posX] = this[_widthArea] * this[_distance];
      this[_posY] = this[_widthArea] / this[_coeffs].widthToGroundLevel;
      this[_radiusBall] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_isGameRunning] = true;
      this[_rect] = {};
      this[_score] = 0;
      this[_numLifes] = 0;
      this[_speedX] = 0;
      this[_isPressed] = {};
      this[_soundLevelWin] = new Audio();
      this[_soundLose] = new Audio();
      this[_soundLevelWin].src = 'audio/mp3_format/win_level.mp3';
      this[_soundLevelWin].src = 'audio/ogg_format/win_level.ogg';
      this[_soundLose].src = 'audio/mp3_format/lose_sound.mp3';
      this[_soundLose].src = 'audio/ogg_format/lose_sound.ogg';
      this.onChange = new app.Events(this);
    }
    get posXWorm() {
      return this[_x1IconWorm];
    }
    getRectFinish() {
      return {
        x1: this[_posX],
        x2: this[_posX] + this[_widthFlag],
        y1: this[_posY],
        y2: this[_posY] + this._height,
        width: this[_widthFlag],
        height: this[_heightFlag]
      };
    }
    getRectIconDist() {
      return {
        x1: this[_x1IconDist],
        y1: this[_y1IconDist],
        width: this[_widthIconDist],
        height: this[_heightIconDist]
      };
    }
    getRectIconLifes() {
      return {
        x1: this[_x1IconLifes],
        y1: this[_y1IconLifes],
        width: this[_widthIconLifes],
        height: this[_heightIconLifes]
      };
    }
    get speedWorm() {
      return this[_speedX] = (this[_isPressed].lastBtn === 'right' && this[_speedX] > 0) ? (this[_speedX] / (this[_distance] - 0.3) / 3) : 0;
    }
    receiveData(context, data) {
      this[_rect] = data.rect;
      this[_speedX] = data.speedX;
      this[_isPressed] = data.isPressed;
      this[_score] = data.score;
      this[_numLifes] = data.numLifes;
    }
    get numLifes() {
      return this[_numLifes];
    }
    set newSizes(ratio) {
      this[_widthFlag] /= ratio;
      this[_heightFlag] /= ratio;
      this[_posY] /= ratio;
      this[_posX] /= ratio;
      this[_radiusBall] /= ratio;
      this[_widthIconDist] /= ratio;
      this[_heightIconDist] /= ratio;
      this[_x1IconDist] /= ratio;
      this[_y1IconDist] /= ratio;
      this[_widthIconLifes] /= ratio;
      this[_heightIconLifes] /= ratio;
      this[_x1IconLifes] /= ratio;
      this[_y1IconLifes] /= ratio;
    }
    interactionWithBall() {
      if (this[_rect].x1 >= this.getRectFinish().x1 && this[_isGameRunning]) {
        let self = this;
        this[_isPressed] = {right: false, left: false, up: false, lastBtn: null, flyUp: true};
        this.onChange.notify({playMainAudio: false, pendingStopGame: true, speedX: 0, isPressed: this[_isPressed]});
        this[_soundLevelWin].play();
        this[_isGameRunning] = false;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          let userName = prompt(`You win! Your score: ${self[_score]}! Input your name: `, 'your_name');
          let user = userName ? {name: userName, score: self[_score]} : null;
          location.hash = encodeURIComponent(JSON.stringify({pagename: 'levels'}));
          self.onChange.notify({user: user, game: 'stop'});
        } else {
          this[_soundLevelWin].addEventListener('ended', function() {
            let userName = prompt(`You win! Your score: ${self[_score]}! Input your name: `, 'your_name');
            let user = userName ? {name: userName, score: self[_score]} : null;
            location.hash = encodeURIComponent(JSON.stringify({pagename: 'levels'}));
            self.onChange.notify({user: user, game: 'stop'});
          });
        }
      }
    }
    calcPosX() {
      if (this[_isPressed].right || this[_isPressed].lastBtn === 'right') {
        this[_posX] -= this[_speedX];
      }
    }
    gameState() {
      if (this[_numLifes] === 0 && this[_isGameRunning]) {
        let self = this;
        this[_isPressed] = {right: false, left: false, up: false, lastBtn: null, flyUp: true};
        this.onChange.notify({playMainAudio: false, pendingStopGame: true, speedX: 0, isPressed: this[_isPressed]});
        this[_soundLose].play();
        this[_isGameRunning] = false;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          alert(`Game over! You can try again =)`);
          location.hash = encodeURIComponent(JSON.stringify({pagename: 'levels'}));
          self.onChange.notify({game: 'stop'});
        } else {
          this[_soundLose].addEventListener('ended', function() {
            alert(`Game over! You can try again =)`);
            location.hash = encodeURIComponent(JSON.stringify({pagename: 'levels'}));
            self.onChange.notify({game: 'stop'});
          });
        }
      }
    }
    start(view) {
      this[_view] = view;
    }
    updateView() {
      this.calcPosX();
      this.interactionWithBall();
      this.gameState();
      if (this[_view]) {
         this[_view].update();
      }
    }
  }

  window.app = window.app || {};
  window.app.GameModel = GameModel;
})(window);