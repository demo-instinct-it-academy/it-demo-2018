(function (window) {
  'use strict';
  class Helper {
    static vibrate(val){
      if ('vibrate' in navigator) return navigator.vibrate(val);
      if ('oVibrate' in navigator) return navigator.oVibrate(val);
      if ('mozVibrate' in navigator) return navigator.mozVibratio(val);
      if ('webkitVibrate' in navigator) return navigator.webkitVibrate(val);
    }
    isEmpty(rect1, rect2) {
      let x1 = Math.max(rect1.x1, rect2.x1);
      let x2 = Math.min(rect1.x2, rect2.x2);
      let y1 = Math.max(rect1.y1, rect2.y1);
      let y2 = Math.min(rect1.y2, rect2.y2);
      return (x1 > x2) || (y1 > y2);
    }
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }

  window.app = window.app || {};
  window.app.Helper = Helper;
})(window);