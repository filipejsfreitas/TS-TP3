class RequestCache {
  constructor() {
    this._data = [];
  }

  addRequest(code, callback) {
    return this._data.push({ code, callback }) - 1;
  }

  doesRequestExist(code) {
    return this._data.length > 0 && this._data.find(v => v.code === code) !== undefined;
  }

  processRequest(inCode) {
    if (this._data.length === 0) {
      return null;
    }

    const i = this._data.findIndex(v => v.code === inCode);
    const { callback } = this._data[i];

    this._data.splice(i, 1);

    return callback();
  }

  deleteRequest(code) {
    if (this._data.length === 0) {
      return;
    }

    const i = this._data.findIndex(v => v.code === code)

    this._data.splice(i, 1)
  }
}

module.exports = RequestCache;
