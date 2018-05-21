(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _imgFlag = Symbol('imgFlag');
  const _imgDist = Symbol('imgDist');
  const _imgWorm = Symbol('imgWorm');
  const _imgLifesWrap = Symbol('imgLifesWrap');
  const _imgLifesNum = Symbol('imgLifesNum');
  const _xWorm = Symbol('xWorm');

  class GameView {
    constructor(imgs, coeffs) {
      this[_model] = null;
      this[_field] = null;
      this[_imgFlag] = new Image();
      this[_imgDist] = new Image();
      this[_imgWorm] = new Image();
      this[_imgLifesWrap] = new Image();
      this[_imgLifesNum] = new Image();
      this[_imgFlag].src = imgs.flag;
      this[_imgDist].src = imgs.dist;
      this[_imgWorm].src = imgs.worm;
      this[_imgLifesWrap].src = imgs.lifesWrap;
      this[_imgLifesNum].src = imgs.lifesNum;
      this[_xWorm];
    }
    drawLifes() {
      let x = this[_model].getRectIconLifes().x1;
      let y = this[_model].getRectIconLifes().y1;
      let widthLifes = this[_model].getRectIconLifes().width;
      let heightLifes = this[_model].getRectIconLifes().height;
      this[_field].drawImage(this[_imgLifesWrap], x, y, widthLifes, heightLifes);
      this[_field].drawImage(this[_imgLifesNum], x + x / 4.1 , y + y / 1.6, (widthLifes - widthLifes / 4.2) / 3 * this[_model].numLifes, heightLifes / 1.3);
    }
    drawDistanceIcon() {
      let x = this[_model].getRectIconDist().x1;
      let y = this[_model].getRectIconDist().y1;
      let widthDist = this[_model].getRectIconDist().width;
      let heightDist = this[_model].getRectIconDist().height;
      this[_field].drawImage(this[_imgDist], x, y, widthDist, heightDist);
      this[_field].drawImage(this[_imgWorm], this[_xWorm] += this[_model].speedWorm , y, widthDist / 7, heightDist);
    }
    drawFinish() {
      let x = this[_model].getRectFinish().x1;
      let y = this[_model].getRectFinish().y1;
      let width = this[_model].getRectFinish().width;
      let height = this[_model].getRectFinish().height;
      this[_field].drawImage(this[_imgFlag], x, y - height, width, height);
    }
    set newSizes(ratio) {
      this[_xWorm] /= ratio;
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
      this[_xWorm] = this[_model].posXWorm;
    }
    update() {
      this.drawFinish();
      this.drawDistanceIcon();
      this.drawLifes();
    }
  }

  window.app = window.app || {};
  window.app.GameView = GameView;
})(window);