(function (window) {
  'use strict';
  let _view = new WeakMap();
  let _imgWidth = new WeakMap();
  let _layoutSpeed = new WeakMap();
  let _posX = new WeakMap();
  let _speedX = new WeakMap();
  let _isPressed = new WeakMap();

  class BackgroundModel {
    constructor(widthArea, layoutSpeed) {
      _view.set(this, null);
      _imgWidth.set(this, widthArea);
      _layoutSpeed.set(this, layoutSpeed);
      _posX.set(this, 0);
      _speedX.set(this, 0);
      _isPressed.set(this, {});
    }
    receiveData(context, data) { 
      _speedX.set(this, data.speedX);
      _isPressed.set(this, data.isPressed);
    }
    calcPosX(layoutSpeed) {
      if (_isPressed.get(this).right || _isPressed.get(this).lastBtn === 'right') {
        _posX.set(this, _posX.get(this) > _imgWidth.get(this) ? 0 : _posX.get(this));
        _posX.set(this, _posX.get(this) + _speedX.get(this) * layoutSpeed);
      }
    }
    set newSizes(ratio) {
      _imgWidth.set(this, _imgWidth.get(this) / ratio);
    }
    get getPosX() {
      return _posX.get(this);
    }
    start(view) {
      _view.set(this, view);
    }
    updateView() {
      this.calcPosX(_layoutSpeed.get(this));
      if (_view.get(this)) {
         _view.get(this).update();
      }
    }
  }

  window.app = window.app || {};
  window.app.BackgroundModel = BackgroundModel;
})(window);
