(function (window) {
  'use strict';
  const _model = Symbol('model');
  const _field = Symbol('field');
  const _options = Symbol('options');
  const _img = Symbol('img');

  class EnemyView {
    constructor(options) {
      this[_model] = null;
      this[_field] = null;
      this[_options] = options;
      this[_img] = new Image();
      this[_img].src = this[_options].img;
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
      this[_field].drawImage(this[_img], x1, y1, width1, height1, x2, y2, width2, height2);
    }
    start(model, field) {
      this[_model] = model;
      this[_field] = field;
    }
    update() {
      this.draw();
    }
  }

  window.app = window.app || {};
  window.app.EnemyView = EnemyView;
})(window);