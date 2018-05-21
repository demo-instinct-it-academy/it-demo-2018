(function (window) {
  'use strict';
  function SPAModel() {
    var self = this;
    var myView = null;
    var URLHash = null;

    var ajaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
    var storageName = 'SOPACH_WOODBOOMBUGS_RECORDS';
    var storage = {records: [
      {name: 'Dima', score: 20},
      {name: 'Roma', score: 20},
      {name: 'Vasia', score: 50},
      {name: 'Alex', score: 50},
      {name: 'Dan', score: 100}]};
    var updatePassword;
    var numLifes;
    self.menuBtnCls = ['play', 'records', 'about'];
    self.SPAState = '';
    var stateJSON = '';
    self.receiveData = function(context, data) {
      numLifes = data.numLifes;
      data.user ? self.sendToStorage(data.user) : false;
    };
    self.getStorage = function() {
      return storage;
    };
    var errorHandler = function(jqXHR, statusStr, errorStr) {
     alert(statusStr + ' ' + errorStr);
    };
    var successHandler = function(data) {
      storage = JSON.parse(data.result) || {records: []};
    };
    self.readFromStorage = function() {
      $.ajax(
        {
          url: ajaxHandlerScript,
          type: 'POST',
          data: {f: 'READ', n: storageName},
          cache: false,
          success: successHandler,
          error: errorHandler
        }
      );
    };
    self.sendToStorage = function(data) {
      if (storage.records) {
        storage.records.push(data);
      } else {
        storage.records = [];
        storage.records.push(data);
      }
      updatePassword = Math.random(); 
      $.ajax(
        {
          url: ajaxHandlerScript,
          type: 'POST',
          data: {
            f: 'LOCKGET', 
            n: storageName,
            p: updatePassword
          },
          cache: false,
          success: self.lockGetReady,
          error: errorHandler
        }
      );
    };
    self.lockGetReady = function() {
      $.ajax(
        {
          url: ajaxHandlerScript,
          type: 'POST',
          data: {
            f: 'UPDATE', 
            n: storageName,
            v: JSON.stringify(storage), 
            p: updatePassword
          },
          cache: false,
          error: errorHandler
        }
      );
    };
    self.start = function(view) {
      myView = view;
    };
    self.updateView = function() {
      if (myView) {
         myView.update();
      }
    };
    self.switchToStateFromURLHash = function() {
      URLHash = window.location.hash;
      try {
        stateJSON = JSON.parse(decodeURIComponent(URLHash.substr(1)));
      } catch(e) {
        stateJSON = '';
      }
      self.SPAState = stateJSON !== '' ? stateJSON : {pagename: 'main'};
      self.updateView();
    };
    self.switchToStartPage = function() {
      URLHash = window.location.hash;
      try {
        stateJSON = JSON.parse(decodeURIComponent(URLHash.substr(1)));
      } catch(e) {
        stateJSON = '';
      }
      self.SPAState = stateJSON !== '' ? stateJSON : {pagename: 'main'};
      self.updateView();
    };
    self.switchToState = function(newState) {
      location.hash = encodeURIComponent(JSON.stringify(newState));
    };
    self.vibrate = function(val){
      if ('vibrate' in navigator) return navigator.vibrate(val);
      if ('oVibrate' in navigator) return navigator.oVibrate(val);
      if ('mozVibrate' in navigator) return navigator.mozVibratio(val);
      if ('webkitVibrate' in navigator) return navigator.webkitVibrate(val);
    };
  }

  window.app = window.app || {};
  window.app.SPAModel = SPAModel;
})(window);