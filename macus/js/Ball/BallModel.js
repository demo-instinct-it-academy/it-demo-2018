(function (window) {
  'use strict';
  const _view = Symbol('view');
  const _isPressed = Symbol('isPressed');
  const _coeffs = Symbol('coeffs');
  const _widthArea = Symbol('widthArea');
  const _numLifes = Symbol('numLifes');
  const _widthFaceBall = Symbol('widthFaceBall');
  const _whichFace = Symbol('whichFace');
  const _scoreResult = Symbol('scoreResult');
  const _secondsCounter = Symbol('secondsCounter');
  const _angleRotate = Symbol('angleRotate');
  const _radius = Symbol('radius');
  const _groundLevel = Symbol('groundLevel');
  const _currentSpeedX = Symbol('currentSpeedX');
  const _accelX = Symbol('accelX');
  const _maxSpeedX = Symbol('maxSpeedX');
  const _currentSpeedY = Symbol('currentSpeedY');
  const _maxSpeedY = Symbol('maxSpeedY');
  const _accelY = Symbol('accelY');
  const _startPosY = Symbol('startPosY');
  const _posY = Symbol('posY');
  const _posX = Symbol('posX');
  const _rightBorder = Symbol('rightBorder');
  const _coeffsDecreaseRotate = Symbol('coeffsDecreaseRotate');
  const _coeffForDecreaseRightBorder = Symbol('coeffForDecreaseRightBorder');
  const _pendingStopGame = Symbol('pendingStopGame');
  const _getRandomNumber = Symbol('getRandomNumber');
  const _isEmpty = Symbol('isEmpty');
  const _sound1Bounce = Symbol('sound1Bounce');
  const _sound2Bounce = Symbol('sound2Bounce');

  class BallModel {
    constructor(widthArea, coeffs) {
      this[_view] = null;
      this[_isPressed] = {
        right: false,
        left: false,
        up: false,
        lastBtn: null,
        flyUp: true
      };
      this[_coeffs] = coeffs;
      this[_widthArea] = widthArea;
      this[_numLifes] = 3;
      this[_widthFaceBall] = 170;
      this[_whichFace] = 0;
      this[_scoreResult] = 0;
      this[_secondsCounter] = 0;
      this[_angleRotate] = 1;
      this[_radius] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_groundLevel] = this[_widthArea] / this[_coeffs].widthToGroundLevel - this[_radius];
      this[_currentSpeedX] = 0;
      this[_accelX] = this[_widthArea] / this[_coeffs].widthToAccelX;
      this[_maxSpeedX] = this[_widthArea] / this[_coeffs].widthToMaxSpeedX;
      this[_currentSpeedY] = this[_widthArea] / this[_coeffs].widthToCurrentSpeedY;
      this[_maxSpeedY] = this[_widthArea] / this[_coeffs].widthToMaxSpeedY;
      this[_accelY] = this[_widthArea] / this[_coeffs].widthToAccelY;
      this[_startPosY] = this[_groundLevel];
      this[_posY] = this[_groundLevel];
      this[_posX] = this[_widthArea] / this[_coeffs].widthToPosX;
      this[_rightBorder] = this[_widthArea] / this[_coeffs].widthToRightBorder;
      this[_coeffsDecreaseRotate] = this[_widthArea] / this[_coeffs].widthToAngleRotate;
      this[_coeffForDecreaseRightBorder] = this[_radius] / this[_coeffs].radiusToDecreaseRightBorder;
      this[_pendingStopGame] = false;
      this[_getRandomNumber] = new app.Helper().getRandomNumber;
      this[_isEmpty] = new app.Helper().isEmpty;
      this.onChange = new app.Events(this);
      this[_sound1Bounce] = new Audio();
      this[_sound2Bounce] = new Audio();
      this[_sound1Bounce].src = 'audio/mp3_format/bounce_1.mp3';
      this[_sound1Bounce].src = 'audio/ogg_format/bounce_1.ogg';
      this[_sound2Bounce].src = 'audio/mp3_format/bounce_2.mp3';
      this[_sound2Bounce].src = 'audio/ogg_format/bounce_2.ogg';
    }
    get imgPos() {
      return {
        x1: this[_widthFaceBall] * this[_whichFace],
        y1: 0,
        width: this[_widthFaceBall],
        height: this[_widthFaceBall]
      };
    }
    set newSizes(ratio) {
      this[_widthArea] /= ratio;
      this[_angleRotate] /= ratio;
      this[_radius] /= ratio;
      this[_groundLevel] /= ratio;
      this[_currentSpeedX] /= ratio;
      this[_accelX] /= ratio;
      this[_maxSpeedX] /= ratio;
      this[_currentSpeedY] /= ratio;
      this[_maxSpeedY] /= ratio;
      this[_accelY] /= ratio;
      this[_startPosY] /= ratio;
      this[_posY] /= ratio;
      this[_posX] /= ratio;
      this[_rightBorder] /= ratio;
      this[_coeffsDecreaseRotate] /= ratio;
      this[_coeffForDecreaseRightBorder] /= ratio;
    }
    start(view) {
      this[_view] = view;
    }
    updateView () {
      if (this[_view]) {
         this[_view].update();
      }
    }
    get score() {
      return this[_scoreResult];
    }
    get currentSpeedX() {
      return this[_currentSpeedX];
    }
    get rect() {
      return {
        x1: this[_posX] - this[_radius],
        x2: this[_posX] + this[_radius],
        y1: this[_posY] - this[_radius],
        y2: this[_posY] + this[_radius],
        radius: this[_radius]
      };
    }
    get angleRotate() {
      return this[_angleRotate];
    }
    get isPressed() {
      return this[_isPressed];
    }
    set isPressed(obj) {
      this[_isPressed][obj.key] = obj.value;
    }
    speedLimit() {
      if (this[_isPressed].right && this[_isPressed].lastBtn !== 'right' || this[_isPressed].left && this[_isPressed].lastBtn !== 'left') {
        this[_currentSpeedX] = 1;
      }
      this[_currentSpeedX] = (this[_currentSpeedX] > this[_maxSpeedX]) ? this[_maxSpeedX] : this[_currentSpeedX]; 
    }
    touchBordersArea(widthArea) {
      if (this[_posX] >= this[_rightBorder]) {
        this[_posX] = this[_rightBorder];
      } else if (this[_posX] < this[_radius]) {
        this[_posX] = this[_radius];
      }
      if (this[_isPressed].right && this[_rightBorder] > this[_widthArea] / 2) {
        this[_rightBorder] -= this[_coeffForDecreaseRightBorder];
      }
    }
    calcAccelX() {
      if (!this[_isPressed].right && !this[_isPressed].left && this[_currentSpeedX] > this[_accelX]) {
        this[_currentSpeedX] -= this[_accelX];
      } else if (this[_isPressed].right || this[_isPressed].left) {
        this[_currentSpeedX] += this[_accelX];
      } else {
        this[_currentSpeedX] = 0;
      }
      this[_posX] = (this[_isPressed].lastBtn === 'right') ? (this[_posX] + this[_currentSpeedX]) : (this[_posX] - this[_currentSpeedX]);
    }
    calcPosY() {
      if (this[_isPressed].up && this[_currentSpeedY] > 0 && this[_isPressed].flyUp) {
        this.calcAccelY(this[_isPressed].flyUp);
      } else if (this[_posY] < this[_startPosY]) {
        this[_isPressed].flyUp = false;
        this.calcAccelY(this[_isPressed].flyUp);
        this[_posY] = (this[_posY] > this[_startPosY]) ? this[_startPosY] : this[_posY];
      } else if (this[_isPressed].up && !this[_isPressed].flyUp) {
        this[_getRandomNumber](1, 2) === 1 ? this[_sound1Bounce].play() : this[_sound2Bounce].play();
        this[_currentSpeedY] = this[_maxSpeedY];
        this[_isPressed].flyUp = true;
      } 
      this[_startPosY] = this[_groundLevel];
    }
    calcAccelY(flyUp) {
      this[_currentSpeedY] = flyUp ? this[_currentSpeedY] - this[_accelY] : this[_currentSpeedY] + this[_accelY];
      this[_posY] = flyUp && this[_currentSpeedY] > this[_accelY] ? this[_posY] - this[_currentSpeedY] : this[_posY] + this[_currentSpeedY];
    }
    calcAngleRotate(coeffsDecreaseRotate) {
      let accelRotate = this[_currentSpeedX] / this[_coeffsDecreaseRotate];
      if (this[_isPressed].right) {
        this[_angleRotate] += accelRotate;
      } else if (this[_currentSpeedX] > 0 && this[_isPressed].lastBtn === 'right') {
        this[_angleRotate] += accelRotate;
      } else if (this[_currentSpeedX] > 0 && this[_isPressed].lastBtn === 'left') {
        this[_angleRotate] -= accelRotate;
      }
    }
    shiftFace(delay, duration) {
      if (this[_secondsCounter] >= 60 * delay && this[_secondsCounter] <= 60 * (delay + duration)) {
        this[_whichFace] = 1;
      } else if (this[_secondsCounter] > 60 * (delay + duration)) {
        this[_whichFace] = 0;
        this[_secondsCounter] = 1;
      }
    }
    update(right, left) {
      this[_secondsCounter]++;
      if (!this[_pendingStopGame]) {
        this.shiftFace(2, 0.1);
      }
      this.calcAccelX();
      this.calcPosY();
      this.calcAngleRotate(this[_coeffsDecreaseRotate]);
      this.speedLimit();
      this.touchBordersArea(this[_widthArea]);
      this[_isPressed].lastBtn = this[_isPressed].right ? right : (this[_isPressed].left ? left : this[_isPressed].lastBtn);
      this.onChange.notify({
        speedX: this[_currentSpeedX], 
        isPressed: this[_isPressed], 
        rect: {
          x1: this[_posX] - this[_radius],
          x2: this[_posX] + this[_radius],
          y1: this[_posY] - this[_radius],
          y2: this[_posY] + this[_radius],
        },
        rightBorder: this[_rightBorder],
        score: this[_scoreResult],
        numLifes: this[_numLifes]
      });
    }
    receiveData(context, data) {
      this[_posX] = data.posX ? data.posX : this[_posX];
      this[_rightBorder] = data.rightBorder ? data.rightBorder : this[_rightBorder];
      this[_scoreResult] = data.score ? this[_scoreResult] + data.score : this[_scoreResult];
      this[_startPosY] = data.startPosYBall ? data.startPosYBall : this[_startPosY];
      this[_currentSpeedX] = data.speedX === 0 ? data.speedX : this[_currentSpeedX];
      this[_isPressed] = data.isPressed ? data.isPressed : this[_isPressed];
      this[_numLifes] = data.numLifes || data.numLifes === 0 ? data.numLifes : this[_numLifes];
      this[_whichFace] = data.isHit ? 2 : 0;
      this[_pendingStopGame] = data.pendingStopGame ? data.pendingStopGame : this[_pendingStopGame];
      this[_whichFace] = data.pendingStopGame && !this[_numLifes] ? 3 : this[_whichFace];
    }
  }
 
  window.app = window.app || {};
  window.app.BallModel = BallModel;
})(window);