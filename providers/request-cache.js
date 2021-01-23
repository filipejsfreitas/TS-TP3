class RequestCache {
    _data = [];

    constructor() {}

    addRequest(code, callback) {
        this._data.push({ code, callback });
    }

    doesRequestExist(code) {
        return this._data.find(v => v.code === code) !== undefined;
    }

    processRequest(inCode) {
        const i = this._data.findIndex(v => v.code === inCode);
        const { code, callback } = this._data[i];

        if(!callback) {
            return false;
        }

        delete this._data[i];

        return callback();
    }
}

module.exports = RequestCache;
