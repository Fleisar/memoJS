/*
 Range: <unit>=<range-start>-
 Range: <unit>=<range-start>-<range-end>
 Range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>
 Range: <unit>=<range-start>-<range-end>, <range-start>-<range-end>, <range-start>-<range-end>
 Range: <unit>=-<suffix-length>
 */
export function validate(header: string): boolean {
    return header.match(/^[a-zA-Z0-9]+=([0-9]+-[0-9]+, )*(([0-9]+)?-([0-9]+)?)$/gm) !== null;
}

export function parse(header: string, size: number = 0): {
    unit: string | 'bytes',
    ranges: { start: number, end: number }[],
} {
    if (!validate(header)) {
        throw new Error('Invalid form of range');
    }
    const stringParts = header.split('=');
    const unit = stringParts[0];
    const rangeRaw = stringParts[1];
    const ranges = rangeRaw.split(', ')
        .map((range) => {
            const rangeParts = range.split('-')
                .map((part) => (part === '' ? null : Number(part)));
            let start = rangeParts[0] ?? 0,
                end = rangeParts[1] ?? size;
            if (rangeParts[0] === null) {
                start = size - end;
                end = size - 1;
                start = start < 0 ? 0 : start;
            }
            return {
                start,
                end,
            };
        });
    return {
        unit,
        ranges,
    };
}

export function stringify(ranges: { start: number | null, end: number | null }[], unit: string = 'bytes'): string {
    const rangeRaw = ranges.map((range) => {
        const {
            start,
            end,
        } = range;
        if ((start || 0) > (end || 0)) {
            throw new Error('Range start more than range end');
        }
        return `${start === null ? '' : start}-${end === null ? '' : end}`;
    })
        .join(', ');
    return `${unit}=${rangeRaw}`;
}
