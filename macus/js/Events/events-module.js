(function (window) {
  'use strict';
  const _sender = Symbol('sender');
  const _listeners = Symbol('listeners');

  class Events {
    constructor(sender) {
      this[_sender] = sender;
      this[_listeners] = [];
    }
    attach(listener) {
      this[_listeners].push(listener);
    }
    notify(args) {
      this[_listeners].forEach((listener, index) => {
        this[_listeners][index](this[_sender], args);
      })
    }
  }

  window.app = window.app || {};
  window.app.Events = Events;
})(window);