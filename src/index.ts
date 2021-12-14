import express from 'express';
import { Storage } from './modules';
import { Range, ContentRange } from './utils';
import { Dictionary } from './objects/Dictionary';
import { fixPath, getUriLevel } from './utils/format';

const config = {
    port: 3000, // Default port
    sizeLimit: 2 ** 16,
};

const mime = require('mime-types');

const app = express();

app.get('/file/*', async (req, res) => {
    const path = getUriLevel(req.url, 1);
    Storage.getFileInfo(path).then((fileInfo) => {
        if (fileInfo.isDir) {
            Storage.getDirectory(fixPath(path + '/')).then((list) => {
                const content = Buffer.from(JSON.stringify(list));
                const head: Dictionary<any> = {
                    'Content-Type': 'application/json',
                    'Content-Length': content.length,
                    'Access-Control-Allow-Origin': '*',
                };
                res.writeHead(200, head);
                res.end(content);
            });
        } else {
            const range = {
                start: 0,
                end: fileInfo.size - 1,
            };
            if (req.headers.range !== undefined) {
                const parse = Range.parse(req.headers.range, fileInfo.size);
                if (parse.unit !== 'bytes') {
                    throw new Error('Unsupported range type');
                }
                range.start = parse.ranges[0].start === null
                    ? range.start
                    : Number(parse.ranges[0].start);
                range.end = parse.ranges[0].end === null
                    ? range.end
                    : Number(parse.ranges[0].end);
            }
            const head: Dictionary<any> = {
                'Content-Type': mime.lookup(path),
                'Content-Length': range.end - range.start + 1,
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Origin': '*',
            };
            if (req.headers.range !== undefined) {
                if (range.end - range.start > config.sizeLimit) {
                    range.end = range.start + config.sizeLimit - 1;
                }
                if (range.end >= fileInfo.size) {
                    range.end = fileInfo.size - 1;
                }
                Storage.getFileStream(path, range).then((stream) => {
                    stream.on('open', () => {
                        head['Content-Range'] = ContentRange.stringify(range, fileInfo.size);
                        head['Content-Length'] = range.end - range.start + 1;
                        res.writeHead(206, head);
                        stream.pipe(res);
                    });
                });
            } else {
                Storage.getFileStream(path).then((stream) => {
                    res.writeHead(200, head);
                    stream.pipe(res);
                    stream.on('end', () => {
                        stream.close();
                        res.end();
                    });
                });
            }
        }
    });
});

app.listen(config.port, () => {
    console.log(`Server started at http://localhost:${config.port}`);
});
