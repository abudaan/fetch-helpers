// fetch helpers
// import fetch from 'isomorphic-fetch';
import CSON from 'cson-parser';
import YAML from 'yamljs';
import BSON from 'bson';

const bsonInstance = new BSON();

const status = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
};

const json = response => response.json();

const bson = response => response.blob()
    .then(data => Promise.resolve(bsonInstance.deserialize(data)))
    .catch(e => Promise.reject(e));

const cson = response => response.text()
    .then(data => Promise.resolve(CSON.parse(data)))
    .catch(e => Promise.reject(e));

const yaml = response => response.text()
    .then(data => Promise.resolve(YAML.parse(data)))
    .catch(e => Promise.reject(e));

const arrayBuffer = response => response.arrayBuffer();

const checkTypeAndParse = (response) => {
    const type = response.headers.get('content-type');
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
    return Promise.reject(new Error('could not detect type'));
};

const fetchREST = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    // console.log('REST');
    fetch(url)
        .then(status)
        .then(checkTypeAndParse)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const fetchJSON = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
        .then(status)
        .then(json)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const fetchCSON = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
        .then(status)
        .then(cson)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const fetchYAML = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
        .then(status)
        .then(yaml)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const fetchBSON = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
        .then(status)
        .then(bson)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const fetchJSONFiles = urlArray => new Promise((resolve, reject) => {
    const promises = [];
    const errors = [];

    urlArray.forEach((url) => {
        promises.push(fetch(url)
            .then(status)
            .then(json)
            .then(data => data)
            .catch((e) => {
                errors.push(url);
                return null;
            }));
    });

    Promise.all(promises)
        .then(
            (data) => {
                const jsonFiles = data.filter(file => file !== null);
                resolve({ jsonFiles, errors });
            },
            (error) => {
                reject(error);
            },
        );
});

const fetchJSONFiles2 = (object, baseurl) => new Promise((resolve, reject) => {
    const promises = [];
    const errors = [];
    const keys = [];

    Object.entries(object).forEach(([key, url]) => {
        keys.push(key);
        promises.push(fetch(baseurl + url)
            .then(status)
            .then(json)
            .then(data => data)
            .catch((e) => {
                errors.push(url);
                return null;
            }));
    });

    Promise.all(promises)
        .then(
            (data) => {
                const jsonFiles = {};
                data.forEach((file, index) => {
                    if (file !== null) {
                        jsonFiles[keys[index]] = file;
                    }
                });
                resolve({ jsonFiles, errors });
            },
            (error) => {
                reject(error);
            },
        );
});

const fetchArraybuffer = url => new Promise((resolve, reject) => {
    // fetch(url, {
    //   mode: 'no-cors'
    // })
    fetch(url)
        .then(status)
        .then(arrayBuffer)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
});

const load = (file, type = null) => {
    let t = type;
    let parsedJSON;
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
        return Promise.resolve(file);
    }
    if (t === 'json-string') {
        return Promise.resolve(parsedJSON);
    }
    if (t === 'json') {
        return fetchJSON(file, type)
            .then(data => data, e => e);
    }
    if (t === 'yaml') {
        return fetchYAML(file, type)
            .then(data => data, e => e);
    }
    if (t === 'bson') {
        return fetchBSON(file, type)
            .then(data => data, e => e);
    }
    if (t === 'cson') {
        return fetchCSON(file, type)
            .then(data => data, e => e);
    }
    return fetchREST(file)
        .then(data => data, e => e);
};

export {
    load,
    status,
    // parsers
    json,
    bson,
    cson,
    yaml,
    arrayBuffer,
    // fetch helpers
    fetchJSON,
    fetchJSONFiles,
    fetchJSONFiles2,
    fetchBSON,
    fetchCSON,
    fetchYAML,
    fetchREST,
};
