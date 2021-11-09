export function fixPath(path: string) {
    const arr = path.split(/[\\/]/gm);
    return arr.filter((v, i) => (i !== 0 && i !== arr.length - 1 ? v : !0))
        .join('/');
}

export function serializeFilepath(filepath: string) {
    const path = fixPath(filepath);
    const name = path.split('/')
        .slice(-1)
        .join();
    let ext: string | null = null;
    if (path.match(/\.[^./]+$/)) {
        ext = path.split('.')
            .slice(-1)
            .join();
    }
    return {
        path,
        name,
        ext,
    };
}

export function objectFill(base: { [key: string]: any }, add: { [key: string]: any }): object {
    const result = base;
    Object.keys(add)
        .forEach((key) => {
            result[key] = add[key];
        });
    return result;
}

export function getUriLevel(path: string, level: number = 0): string {
    return decodeURI(path.split('/')
        .slice(1 + level)
        .join('/'));
}
