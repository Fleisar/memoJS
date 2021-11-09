import { Range } from '../../src/utils';

describe('Range', () => {
    describe('parse', () => {
        test('#1 only start', () => {
            expect(Range.parse('bytes=0-'))
                .toEqual({
                    unit: 'bytes',
                    ranges: [
                        {
                            start: 0,
                            end: 0,
                        },
                    ],
                });
        });
        test('#2 default case with 1 range', () => {
            expect(Range.parse('bytes=0-1'))
                .toEqual({
                    unit: 'bytes',
                    ranges: [
                        {
                            start: 0,
                            end: 1,
                        },
                    ],
                });
        });
        test('#3 case with 2 ranges', () => {
            expect(Range.parse('bytes=0-1, 2-3'))
                .toEqual({
                    unit: 'bytes',
                    ranges: [
                        {
                            start: 0,
                            end: 1,
                        },
                        {
                            start: 2,
                            end: 3,
                        },
                    ],
                });
        });
        test('#4 only end', () => {
            expect(Range.parse('bytes=-5', 15))
                .toEqual({
                    unit: 'bytes',
                    ranges: [
                        {
                            start: 10,
                            end: 14,
                        },
                    ],
                });
        });
        test('#5 invalid form', () => {
            let r;
            try {
                r = Range.parse('bytes=5');
            } catch (e) {
                r = e;
            }
            expect(r)
                .toBeInstanceOf(Error);
        });
        test('#5 negative start range', () => {
            expect(Range.parse('bytes=-50', 15))
              .toEqual({
                  unit: 'bytes',
                  ranges: [
                      {
                          start: 0,
                          end: 14,
                      },
                  ],
              });
        });
    });
    describe('stringify', () => {
        test('#1 only start', () => {
            expect(Range.stringify([
                {
                    start: 0,
                    end: null,
                },
            ]))
                .toEqual('bytes=0-');
        });
        test('#2 default case with 1 range', () => {
            expect(Range.stringify([
                {
                    start: 0,
                    end: 1,
                },
            ]))
                .toEqual('bytes=0-1');
        });
        test('#3 case with 2 ranges', () => {
            expect(Range.stringify([
                {
                    start: 0,
                    end: 1,
                },
                {
                    start: 2,
                    end: 3,
                },
            ]))
                .toEqual('bytes=0-1, 2-3');
        });
        test('#4 only end', () => {
            expect(Range.stringify([
                {
                    start: null,
                    end: 5,
                },
            ]))
                .toEqual('bytes=-5');
        });
        test('#5 rage proportion error', () => {
            try {
                Range.stringify([
                    {
                        start: 1,
                        end: 0,
                    },
                ]);
            } catch (e) {
                expect(e)
                    .toBeInstanceOf(Error);
            }
        });
    });
});
