(function (window) {
  'use strict';
  function Helper() {
    var self = this;
    self.isEmpty = function(rect1, rect2) {
      var x1 = Math.max(rect1.x1, rect2.x1);
      var x2 = Math.min(rect1.x2, rect2.x2);
      var y1 = Math.max(rect1.y1, rect2.y1);
      var y2 = Math.min(rect1.y2, rect2.y2);
      return (x1 > x2) || (y1 > y2);
    };
    self.getRandomNumber = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    self.vibrate = function(val){
      if ('vibrate' in navigator) return navigator.vibrate(val);
      if ('oVibrate' in navigator) return navigator.oVibrate(val);
      if ('mozVibrate' in navigator) return navigator.mozVibratio(val);
      if ('webkitVibrate' in navigator) return navigator.webkitVibrate(val);
    };
  }

  window.app = window.app || {};
  window.app.Helper = Helper;
})(window);