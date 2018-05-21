(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _angleRotate = Symbol('angleRotate');
  const _options = Symbol('options');
  const _imgMain = Symbol('imgMain');
  const _imgBack = Symbol('imgBack');

  class ObjectForCollectView {
    constructor(options) {
      this[_model] = null;
      this[_field] = null;
      this[_angleRotate] = 1;
      this[_options] = options;
      this[_imgMain] = new Image();
      this[_imgBack] = new Image();
      this[_imgMain].src = this[_options].imgMain;
      this[_imgBack].src = this[_options].imgBack;
    }
    draw() {
      let x1 = this[_options].imgToCopy[0];
      let y1 = this[_options].imgToCopy[1];
      let width1 = this[_options].imgToCopy[2];
      let height1 = this[_options].imgToCopy[3];
      let x2 = this[_model].getRect().x1;
      let y2 = this[_model].getRect().y1;
      let width2 = this[_model].getRect().width;
      let height2 = this[_model].getRect().height;
      this[_angleRotate] = (6 === Number(this[_angleRotate].toFixed(2))) ? 1 : this[_angleRotate];
      this[_field].save();
      this[_field].translate(x2 + width2 / 2, y2 + height2 / 2);
      this[_field].rotate(Math.PI * this[_angleRotate]);
      this[_field].drawImage(this[_imgBack], 0 - width2 * 2, 0 - height2 * 2, width2 * 4, height2 * 4);
      this[_field].restore();
      this[_field].drawImage(this[_imgMain], x1, y1, width1, height1, x2, y2, width2, height2);
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
    }
    update() {
      this[_angleRotate] += 0.01;
      this.draw();
    }
  }
  
  window.app = window.app || {};
  window.app.ObjectForCollectView = ObjectForCollectView;
})(window);