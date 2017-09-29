import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import cors from 'koa-cors';
import logger from 'koa-logger';
import createRouter from 'koa-router';

const getFile = file => new Promise(((resolve, reject) => {
    fs.stat(file, (err, stat) => {
        if (err) {
            reject(err);
        } else {
            resolve(stat);
        }
    });
}));

const serveYaml = async (ctx) => {
    // console.log(ctx.path);
    // const fpath = path.join(__dirname, ctx.path);
    const fpath = path.join(__dirname, '/data/test.yaml');
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.body = fs.createReadStream(fpath);
    }
};

const serveJson = async (ctx) => {
    const fpath = path.join(__dirname, '/data/test.json');
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.body = fs.createReadStream(fpath);
    }
};

const serveCson = async (ctx) => {
    const fpath = path.join(__dirname, '/data/test.cson');
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.set('Content-Type', 'text/cson');
        ctx.body = fs.createReadStream(fpath);
    }
};

const serveBson = async (ctx) => {
    const fpath = path.join(__dirname, '/data/test.bson');
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.set('Content-Type', 'application/bson');
        ctx.body = fs.createReadStream(fpath);
    }
};

const serveTestSpec = async (ctx) => {
    const fpath = path.join(__dirname, '/data/spec-test.yaml');
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.body = fs.createReadStream(fpath);
    }
};

const serveSpec = async (ctx, id) => {
    const file = id === 1 ? '/data/spec6a.json' : '/data/spec6b.yaml';
    const fpath = path.join(__dirname, file);
    const fstat = await getFile(fpath);

    if (fstat.isFile()) {
        ctx.type = path.extname(fpath);
        ctx.body = fs.createReadStream(fpath);
    }
};

const app = new Koa();
app.use(cors());

const router = createRouter();
router.get('/yaml', serveYaml);
router.get('/json', serveJson);
router.get('/cson', serveCson);
router.get('/bson', serveBson);
router.get('/test-spec', serveTestSpec);
router.get('/specs/1', ctx => serveSpec(ctx, 1));
router.get('/specs/2', ctx => serveSpec(ctx, 2));
app.use(router.routes());

app.use(serve('.'));
app.listen(3000);

/*
curl -X HEAD -I http://localhost:3000/json
curl -X HEAD -I http://localhost:3000/bson
curl -X HEAD -I http://localhost:3000/cson
curl -X HEAD -I http://localhost:3000/yaml
*/
