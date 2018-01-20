'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchREST = exports.fetchYAML = exports.fetchCSON = exports.fetchBSON = exports.fetchJSONFiles2 = exports.fetchJSONFiles = exports.fetchJSON = exports.arrayBuffer = exports.yaml = exports.cson = exports.bson = exports.json = exports.status = exports.load = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _csonParser = require('cson-parser');

var _csonParser2 = _interopRequireDefault(_csonParser);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _bson = require('bson');

var _bson2 = _interopRequireDefault(_bson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// about fetch reject, see:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful


var bsonInstance = new _bson2.default(); // fetch helpers
// import fetch from 'isomorphic-fetch';


var status = function status(response) {
    if (response.ok) {
        return response;
    }
    throw new Error(response.statusText);
    // if (response.status >= 200 && response.status < 300) {
    //     return Promise.resolve(response);
    // }
    // return Promise.reject(new Error(response.statusText));
};

var json = function json(response) {
    return response.json();
};

var bson = function bson(response) {
    return response.blob().then(function (data) {
        return _promise2.default.resolve(bsonInstance.deserialize(data));
    }).catch(function (e) {
        return _promise2.default.reject(e);
    });
};

var cson = function cson(response) {
    return response.text().then(function (data) {
        return _promise2.default.resolve(_csonParser2.default.parse(data));
    }).catch(function (e) {
        return _promise2.default.reject(e);
    });
};

var yaml = function yaml(response) {
    return response.text().then(function (data) {
        return _promise2.default.resolve(_yamljs2.default.parse(data));
    }).catch(function (e) {
        return _promise2.default.reject(e);
    });
};

var arrayBuffer = function arrayBuffer(response) {
    return response.arrayBuffer();
};

var checkTypeAndParse = function checkTypeAndParse(response) {
    var type = response.headers.get('content-type');
    if (type.indexOf('application/json') === 0) {
        return json(response);
    }
    if (type.indexOf('text/yaml') === 0) {
        return yaml(response);
    }
    if (type.indexOf('application/bson') === 0) {
        return bson(response);
    }
    if (type.indexOf('text/cson') === 0) {
        return cson(response);
    }
    return _promise2.default.reject(new Error('could not detect type'));
};

var fetchREST = function fetchREST(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        // console.log('REST');
        fetch(url).then(status).then(checkTypeAndParse).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var fetchJSON = function fetchJSON(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        fetch(url).then(status).then(json).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var fetchCSON = function fetchCSON(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        fetch(url).then(status).then(cson).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var fetchYAML = function fetchYAML(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        fetch(url).then(status).then(yaml).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var fetchBSON = function fetchBSON(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        fetch(url).then(status).then(bson).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var fetchJSONFiles = function fetchJSONFiles(urlArray) {
    return new _promise2.default(function (resolve, reject) {
        var promises = [];
        var errors = [];

        urlArray.forEach(function (url) {
            promises.push(fetch(url).then(status).then(json).then(function (data) {
                return data;
            }).catch(function (e) {
                errors.push(url);
                return null;
            }));
        });

        _promise2.default.all(promises).then(function (data) {
            var jsonFiles = data.filter(function (file) {
                return file !== null;
            });
            resolve({ jsonFiles: jsonFiles, errors: errors });
        }, function (error) {
            reject(error);
        });
    });
};

var fetchJSONFiles2 = function fetchJSONFiles2(object, baseurl) {
    return new _promise2.default(function (resolve, reject) {
        var promises = [];
        var errors = [];
        var keys = [];

        (0, _entries2.default)(object).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
                key = _ref2[0],
                url = _ref2[1];

            keys.push(key);
            promises.push(fetch(baseurl + url).then(status).then(json).then(function (data) {
                return data;
            }).catch(function (e) {
                errors.push(url);
                return null;
            }));
        });

        _promise2.default.all(promises).then(function (data) {
            var jsonFiles = {};
            data.forEach(function (file, index) {
                if (file !== null) {
                    jsonFiles[keys[index]] = file;
                }
            });
            resolve({ jsonFiles: jsonFiles, errors: errors });
        }, function (error) {
            reject(error);
        });
    });
};

var fetchArraybuffer = function fetchArraybuffer(url) {
    return new _promise2.default(function (resolve, reject) {
        // fetch(url, {
        //   mode: 'no-cors'
        // })
        fetch(url).then(status).then(arrayBuffer).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(e);
        });
    });
};

var load = function load(file) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var t = type;
    var parsedJSON = void 0;
    if (t === null) {
        if (typeof file !== 'string') {
            t = 'object';
        } else if (file.search(/\.ya?ml/) !== -1) {
            t = 'yaml';
        } else if (file.search(/\.json/) !== -1) {
            t = 'json';
        } else if (file.search(/\.bson/) !== -1) {
            t = 'bson';
        } else if (file.search(/\.cson/) !== -1) {
            t = 'cson';
        } else {
            try {
                parsedJSON = JSON.parse(file, type);
                t = 'json-string';
            } catch (e) {
                t = null;
            }
        }
    }

    if (t === 'object') {
        return _promise2.default.resolve(file);
    }
    if (t === 'json-string') {
        return _promise2.default.resolve(parsedJSON);
    }
    if (t === 'json') {
        return fetchJSON(file, type).then(function (data) {
            return data;
        }, function (e) {
            return e;
        });
    }
    if (t === 'yaml') {
        return fetchYAML(file, type).then(function (data) {
            return data;
        }, function (e) {
            return e;
        });
    }
    if (t === 'bson') {
        return fetchBSON(file, type).then(function (data) {
            return data;
        }, function (e) {
            return e;
        });
    }
    if (t === 'cson') {
        return fetchCSON(file, type).then(function (data) {
            return data;
        }, function (e) {
            return e;
        });
    }
    return fetchREST(file).then(function (data) {
        return data;
    }, function (e) {
        return e;
    });
};

exports.load = load;
exports.status = status;
exports.json = json;
exports.bson = bson;
exports.cson = cson;
exports.yaml = yaml;
exports.arrayBuffer = arrayBuffer;
exports.fetchJSON = fetchJSON;
exports.fetchJSONFiles = fetchJSONFiles;
exports.fetchJSONFiles2 = fetchJSONFiles2;
exports.fetchBSON = fetchBSON;
exports.fetchCSON = fetchCSON;
exports.fetchYAML = fetchYAML;
exports.fetchREST = fetchREST;