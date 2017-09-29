import { load } from '../../src/index';

// JSON

load('http://localhost:3000/data/test.json')
    .then((response) => {
        console.log('JSON file', response);
    })
    .catch(e => console.log(e));

load('http://localhost:3000/json')
    .then((response) => {
        console.log('JSON REST', response);
    })
    .catch(e => console.log(e));


// YAML

load('http://localhost:3000/data/test.yaml')
    .then((response) => {
        console.log('YAML file', response);
    })
    .catch(e => console.log(e));

load('http://localhost:3000/yaml')
    .then((response) => {
        console.log('YAML REST', response);
    })
    .catch(e => console.log(e));


// BSON

load('http://localhost:3000/data/test.bson')
    .then((response) => {
        console.log('BSON file', response);
    })
    .catch(e => console.log(e));

load('http://localhost:3000/bson')
    .then((response) => {
        console.log('BSON REST', response);
    })
    .catch(e => console.log(e));


// CSON

load('http://localhost:3000/data/test.cson')
    .then((response) => {
        console.log('CSON file', response);
    })
    .catch(e => console.log(e));

load('http://localhost:3000/cson')
    .then((response) => {
        console.log('CSON REST', response);
    })
    .catch(e => console.log(e));

