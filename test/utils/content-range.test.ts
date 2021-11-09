import { ContentRange, Range } from '../../src/utils';

describe('Content-Range', () => {
    describe('parse', () => {
        test('#1 default case', () => {
            expect(ContentRange.parse('bytes 0-0/0'))
                .toEqual({
                    unit: 'bytes',
                    range: {
                        start: 0,
                        end: 0,
                    },
                    size: 0,
                });
        });
        test('#2 without size', () => {
            expect(ContentRange.parse('bytes 0-0/*'))
                .toEqual({
                    unit: 'bytes',
                    range: {
                        start: 0,
                        end: 0,
                    },
                    size: null,
                });
        });
        test('#3 without range', () => {
            expect(ContentRange.parse('bytes */0'))
                .toEqual({
                    unit: 'bytes',
                    range: null,
                    size: 0,
                });
        });
        test('#4 without range and size', () => {
            expect(ContentRange.parse('bytes */*'))
                .toEqual({
                    unit: 'bytes',
                    range: null,
                    size: null,
                });
        });
        // ToDo: rewrite this shit cuz of #18 uncovered line >:(
        test('#5 invalid form', () => {
            let r;
            try {
                r = Range.parse('bytes * /*');
            } catch (e) {
                r = e;
            }
            expect(r)
                .toBeInstanceOf(Error);
        });
    });
    describe('stringify', () => {
        test('#1 default case', () => {
            expect(ContentRange.stringify({
                start: 0,
                end: 1,
            }))
                .toEqual('bytes 0-1/2');
        });
        test('#2 with size', () => {
            expect(ContentRange.stringify({
                start: 0,
                end: 1,
            }, 3))
                .toEqual('bytes 0-1/3');
        });
        test('#3 without size', () => {
            expect(ContentRange.stringify({
                start: 0,
                end: 1,
            }, 0))
                .toEqual('bytes 0-1/*');
        });
        test('#4 without range', () => {
            expect(ContentRange.stringify(undefined))
                .toEqual('bytes */*');
        });
        test('#5 without range and size', () => {
            expect(ContentRange.stringify(undefined, 0))
                .toEqual('bytes */*');
        });
    });
});
