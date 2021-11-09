import * as fs from 'fs';
import { fixPath, objectFill, serializeFilepath } from '../utils/format';
import { FileInfo, FileUndefined } from '../objects/file-info';

/* File work */

export function getFileInfo(filepath: string): Promise<FileInfo> {
    if (!fs.existsSync(filepath)) {
        throw new Error(`File (${filepath}) is not exists`);
    }
    return new Promise((response) => {
        fs.stat(filepath, (err, stat) => {
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
    if (!fs.existsSync(filepath)) {
        throw new Error('File is not exists');
    }
    if (!fs.statSync(filepath)
        .isFile()) {
        throw new Error('Filepath is not a file');
    }
    return new Promise((response) => {
        return response(fs.createReadStream(filepath, opt));
    });
}

export function getFile(filepath: string): Promise<Buffer> {
    if (!fs.existsSync(filepath)) {
        throw new Error('File is not exists');
    }
    if (!fs.statSync(filepath)
        .isFile()) {
        throw new Error('Filepath is not a file');
    }
    return new Promise((resolve) => {
        fs.readFile(filepath, (err, data) => {
            resolve(data);
        });
    });
}

/* Directory work */

export function getDirectory(path: string): Promise<(FileInfo | FileUndefined)[]> {
    if (!fs.existsSync(path)) {
        throw new Error('This path is not exists');
    }
    const statDir = fs.statSync(path);
    if (!statDir.isDirectory()) {
        throw new Error('This path is not a directory');
    }
    return new Promise((resolve) => {
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
