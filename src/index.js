// fetch helpers
// import fetch from 'isomorphic-fetch';
import CSON from 'cson-parser';
import YAML from 'yamljs';
import BSON from 'bson';

const bsonInstance = new BSON();

export function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
}

export function json(response) {
    return response.json();
}

export function bson(response) {
    return response.blob()
        .then(data => Promise.resolve(bsonInstance.deserialize(data)))
        .catch(e => Promise.reject(e));
}

export function cson(response) {
    return response.text()
        .then(data => Promise.resolve(CSON.parse(data)))
        .catch(e => Promise.reject(e));
}

export function yaml(response) {
    return response.text()
        .then(data => Promise.resolve(YAML.parse(data)))
        .catch(e => Promise.reject(e));
}

export function arrayBuffer(response) {
    return response.arrayBuffer();
}


export function fetchJSON(url) {
    return new Promise((resolve, reject) => {
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
}

export function fetchCSON(url) {
    return new Promise((resolve, reject) => {
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
}

export function fetchYAML(url) {
    return new Promise((resolve, reject) => {
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
}

export function fetchBSON(url) {
    return new Promise((resolve, reject) => {
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
}

export function fetchJSONFiles(urlArray) {
    return new Promise((resolve, reject) => {
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
}

export function fetchJSONFiles2(object, baseurl) {
    return new Promise((resolve, reject) => {
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
}

export function fetchArraybuffer(url) {
    return new Promise((resolve, reject) => {
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
}


export const load = (file, type = null) => {
    let t = type;
    let parsedJSON;
    if (t === null) {
        if (typeof file !== 'string') {
            t = 'object';
        } else if (file.search(/.ya?ml/) !== -1) {
            t = 'yaml';
        } else if (file.search(/.json/) !== -1) {
            t = 'json';
        } else if (file.search(/.bson/) !== -1) {
            t = 'bson';
        } else if (file.search(/.cson/) !== -1) {
            t = 'cson';
        } else {
            try {
                parsedJSON = JSON.parse(file, type);
                t = 'json_string';
            } catch (e) {
                t = null;
            }
        }
    }

    if (t === 'object') {
        return Promise.resolve(file);
    }
    if (t === 'json_string') {
        return Promise.resolve(parsedJSON);
    }
    if (t === 'json') {
        return fetchJSON(file, type)
            .then(data => data, () => null)
            .catch(() => null);
    }
    if (t === 'yaml') {
        return fetchYAML(file, type)
            .then(data => data, () => null)
            .catch(() => null);
    }
    if (t === 'bson') {
        return fetchBSON(file, type)
            .then(data => data, () => null)
            .catch(() => null);
    }
    if (t === 'cson') {
        return fetchCSON(file, type)
            .then(data => data, () => null)
            .catch(() => null);
    }
    return Promise.reject(new Error('not a supported type'));
};
