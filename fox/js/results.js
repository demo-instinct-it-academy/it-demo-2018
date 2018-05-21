'use strict';

class ResultsStorage {
  constructor(address) {
    this._AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
    this._address = address;
  }
  getStorageInfo() {
    return $.ajax({
      url: this._AjaxHandlerScript,
      type: 'POST',
      data: {
        f: 'READ',
        n: this._address
      },
      cache: false,
      error: this.errorHandler
    })
      .then(response => {
        try {
          return JSON.parse(response.result);
        } catch(error) {
          console.error('cannot get the results. '. error);
          return {};
        }
      });
  }
  addValue(name, info) {
    return this.getAndLockStorage()
      .then(storeObj => {
        return this.setStorageValue(storeObj, name, info);    
      });
  }
  getAndLockStorage() {
    const pswd = Math.random();
    return $.ajax({
      url: this._AjaxHandlerScript,
      type: 'POST',
      data: {
        f: 'LOCKGET',
        n: this._address,
        p: pswd,
      },
      cache: false,
    }).then(response => {
      let result = {};
      if (response.result) {
        result = JSON.parse(response.result);
      }
      return {
        pswd: pswd,
        store: result,
      };
    });
  }
  setStorageValue(storeObj, name, value) {
    return $.ajax({
      url: this._AjaxHandlerScript,
      type: 'POST',
      data: {
        f: 'UPDATE',
        n: this._address,
        p: storeObj.pswd,
        v: JSON.stringify(Object.assign({}, storeObj.store, {[name]: value})),
      },
      cache: false,
      error: this.errorHandler
    });
  }
  errorHandler() {
    throw new Error('Error');
  }
}

