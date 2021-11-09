/*
 Content-Range: <unit> <range-start>-<range-end>/<size>
 Content-Range: <unit> <range-start>-<range-end>/\*
 Content-Range: <unit> *\/<size>
 */

export function validate(header: string): boolean {
    return header.match(/^[a-zA-Z0-9]+ ([0-9]+-[0-9]+|\*)\/([0-9]+|\*)$/gm) !== null;
}

export function parse(header: string): {
    unit: string,
    range: { start: number, end: number } | null,
    size: number | null,
} {
    if (!validate(header)) {
        throw new Error('Invalid form of content range');
    }
    const headerParts = header.split(' ');
    const unit = headerParts[0];
    const contentRaw = headerParts[1];
    const contentParts = contentRaw.split('/');
    const range = contentParts[0] === '*' ? null : [contentParts[0]]
        .map((rangeRaw) => {
            const rangeParts = rangeRaw.split('-');
            return {
                start: Number(rangeParts[0]),
                end: Number(rangeParts[1]),
            };
        })[0];
    const size = contentParts[1] === '*' ? null : Number(contentParts[1]);
    return {
        unit,
        range,
        size,
    };
}

export function stringify(range?: { start: number, end: number }, size?: number, unit: string = 'bytes'): string {
    const ranges = range === undefined ? '*' : [range.start, range.end].join('-');
    return `${unit} ${ranges}/${range !== undefined && size === undefined ? range.end - range.start + 1 : (size || '*')}`;
}
