import * as fs from 'fs';
import { fixPath, objectFill, serializeFilepath } from '../utils/format';
import { FileInfo, FileUndefined } from '../objects/file-info';

/* File work */

export function getFileInfo(filepath: string): Promise<FileInfo> {
    return new Promise((response, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                return reject(err);
            }
            let res: { [key: string]: any } = {};
            res = objectFill(res, stat);
            res = objectFill(res, serializeFilepath(filepath));
            res.isDir = stat.isDirectory();
            res.mime = (require('mime-types')).lookup(filepath);
            response(res as FileInfo);
        });
    });
}

export function getFileStream(
    filepath: string,
    opt?: { start: number, end: number },
): Promise<fs.ReadStream> {
    return new Promise(async (response, reject) => {
        if (!fs.existsSync(filepath)) {
            reject('File is not exists');
        }
        if (!fs.statSync(filepath).isFile()) {
            reject('Path is not reference to file');
        }
        return response(fs.createReadStream(filepath, opt));
    });
}

export function getFile(filepath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filepath)) {
            reject('File is not exists');
        }
        if (!fs.statSync(filepath)
            .isFile()) {
            reject('Filepath is not a file');
        }
        fs.readFile(filepath, (err, data) => {
            resolve(data);
        });
    });
}

export function createFile(filepath: string, content?: NodeJS.ArrayBufferView): Promise<string> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filepath)) {
            reject('File is already exist');
        }
        fs.writeFile(filepath, content ?? '', (err) => {
            if (err) {
                reject(err);
            }
            resolve(filepath);
        });
    });
}

export function writeStream(filepath: string, content: NodeJS.ArrayBufferView, range?: { start: number, end: number }): Promise<fs.WriteStream> {
    return new Promise((resolve, reject) => {

    });
}

export function writeFile(filepath: string, content: NodeJS.ArrayBufferView, byte: number): Promise<number> {
    return new Promise((resolve, reject) => {

    });
}

/* Directory work */

export function getDirectory(path: string): Promise<(FileInfo | FileUndefined)[]> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            reject('This path is not exists');
        }
        const statDir = fs.statSync(path);
        if (!statDir.isDirectory()) {
            reject('This path is not a directory');
        }
        const array: (FileInfo | FileUndefined)[] = [];
        fs.readdir(path, async (err, list) => {
            let processed = 0;
            for (const file of list) {
                const filepath = fixPath([path, file].join('/'));
                let info: FileUndefined | FileInfo = {
                    path: filepath,
                    name: filepath.split('/').slice(-1)[0],
                    ext: null,
                } as FileUndefined;
                try {
                    info = await getFileInfo(fixPath([path, file].join('/')));
                } catch (e) {
                    console.log('Failed to get info from' + filepath);
                }
                array.push(info);
                if (++processed === list.length) {
                    resolve(array);
                }
            }
        });
    });
}
