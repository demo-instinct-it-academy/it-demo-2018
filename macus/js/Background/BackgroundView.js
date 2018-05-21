(function (window) {
  'use strict';
  let _model = new WeakMap();
  let _field = new WeakMap();
  let _img = new WeakMap();
  let _coeffs = new WeakMap();
  let _widthImg = new WeakMap();
  let _heightImg = new WeakMap();

  class BackgroundView {
    constructor(widthArea, coeffs, pathImg) {
      _model.set(this, null);
      _field.set(this, null);
      _img.set(this, new Image());
      _coeffs.set(this, coeffs);
      _widthImg.set(this, widthArea);
      _heightImg.set(this, _widthImg.get(this) / _coeffs.get(this).widthToHeight);
      _img.get(this).src = pathImg;
      _img.get(this).width = _widthImg.get(this);
      _img.get(this).height = _heightImg.get(this);
    }
    set newSizes(ratio) {
      _widthImg.set(this, _widthImg.get(this) / ratio);
      _heightImg.set(this, _heightImg.get(this) / ratio);
      _img.get(this).width = _widthImg.get(this);
      _img.get(this).height = _heightImg.get(this);
    }
    draw() {
      let x = _widthImg.get(this) - _model.get(this).getPosX;
      let width = _widthImg.get(this);
      let height = _heightImg.get(this);
      _field.get(this).drawImage(_img.get(this), x, 0, width, height);
      _field.get(this).drawImage(_img.get(this), x - width, 0, width, height);
    }
    start(model, field) {
      _model.set(this, model);
      _field.set(this, field);
    }
    update() {
      this.draw();
    }
  }

  window.app = window.app || {};
  window.app.BackgroundView = BackgroundView;
})(window);