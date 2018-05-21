(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _widthArea = Symbol('widthArea');
  const _coeffs = Symbol('coeffs');
  const _radius = Symbol('radius');
  const _imgBall = Symbol('imgBall');
  const _lineWidth = Symbol('lineWidth');

  class BallView {
    constructor(widthArea, pathImg, coeffs) {
      this[_model] = null;
      this[_field] = null;
      this[_widthArea] = widthArea;
      this[_coeffs] = coeffs;
      this[_radius] = this[_widthArea] / this[_coeffs].widthToRadius;
      this[_imgBall] = new Image();
      this[_lineWidth] = this[_radius] / 6;
      this[_imgBall].src = pathImg;
    }
    set newSizes(ratio) {
      this[_radius] /= ratio;
      this[_lineWidth] /= ratio;
    }
    drawBall() {
      let x = this[_model].imgPos.x1;
      let y = this[_model].imgPos.y1;
      let width = this[_model].imgPos.width;
      let height = this[_model].imgPos.height;
      this[_field].save();
      this[_field].translate(this[_model].rect.x1 + this[_radius], this[_model].rect.y1 + this[_radius]);
      this[_field].rotate(Math.PI * this[_model].angleRotate - Math.PI);
      this[_field].drawImage(this[_imgBall], x, y, width, height, -this[_radius], -this[_radius], this[_radius] * 2, this[_radius] * 2);
      this[_field].restore();
    }
    drawScore(fontSizeScore, marginTop) {
      this[_field].font = fontSizeScore + 'px ObelixProRegular';
      this[_field].lineWidth = this[_lineWidth];
      this[_field].textAlign = 'center';
      this[_field].fillStyle = '#ffc107';
      this[_field].strokeStyle = '#de701c';
      this[_field].strokeText(this[_model].score, this[_radius] * 15, marginTop);
      this[_field].fillText(this[_model].score, this[_radius] * 15, marginTop);
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
    }
    update() {
      this[_model].update('right', 'left');
      this.drawBall();
      this.drawScore(this[_radius] * 2, this[_radius] * 2);
    }
  }

  window.app = window.app || {};
  window.app.BallView = BallView;
})(window);