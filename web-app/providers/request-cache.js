class RequestCache {
    constructor() {
        this._data = [];
    }

    addRequest(code, callback) {
        return this._data.push({ code, callback }) - 1;
    }

    doesRequestExist(code) {
        return this._data.find(v => v.code === code) !== undefined;
    }

    processRequest(inCode) {
        const i = this._data.findIndex(v => v.code === inCode);
        const { callback } = this._data[i];

        delete this._data[i];

        return callback();
    }

    deleteRequest(code) {
        const i = this._data.findIndex(v => v.code === code)
        
        delete this._data[i]
    }
}

module.exports = RequestCache;
