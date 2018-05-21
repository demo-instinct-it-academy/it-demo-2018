(function (window) {

  function Events(sender) {
    this._sender = sender;
    this._listeners = [];
    this.attach = function(listener) {
      this._listeners.push(listener)
    };
    this.notify = function(args) {
      this._listeners.forEach(function(v, i, a) {
        a[i](this._sender, args)
      })
    };
  }

  window.app = window.app || {};
  window.app.Events = Events;
})(window);