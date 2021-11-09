import { Format } from '../../src/utils';

describe('Format', () => {
    describe('fixPath', () => {
        test('#1 double slashes on both sides', () => {
            expect(Format.fixPath('/test\\///'))
                .toBe('/test/');
        });
        test('#2 single slash', () => {
            expect(Format.fixPath('test\\//'))
                .toBe('test/');
        });
        test('#3 slash inside', () => {
            expect(Format.fixPath('tes\\//t'))
                .toBe('tes/t');
        });
    });
    describe('serializeFilepath', () => {
        test('#1 default string with dots', () => {
            expect(Format.serializeFilepath('\\test..md/foo.txt'))
                .toEqual({
                    path: '/test..md/foo.txt',
                    name: 'foo.txt',
                    ext: 'txt',
                });
        });
        test('#2 path without texted extension', () => {
            expect(Format.serializeFilepath('\\test..md/foo.'))
                .toEqual({
                    path: '/test..md/foo.',
                    name: 'foo.',
                    ext: null,
                });
        });
        test('#3 path without extension', () => {
            expect(Format.serializeFilepath('\\test..md/foo'))
                .toEqual({
                    path: '/test..md/foo',
                    name: 'foo',
                    ext: null,
                });
        });
    });
    describe('objectFill', () => {
        test('#1 default case', () => {
            expect(Format.objectFill({
                key: 1,
                sheet: undefined,
            }, {
                sheet: 2,
                custom: 3,
            }))
                .toEqual({
                    key: 1,
                    sheet: 2,
                    custom: 3,
                });
        });
        test('#2 empty base', () => {
            expect(Format.objectFill({}, {
                sheet: 2,
                custom: 3,
            }))
                .toEqual({
                    sheet: 2,
                    custom: 3,
                });
        });
    });
    describe('getUriLevel', () => {
        test('#1 default case', () => {
            expect(Format.getUriLevel('/foo/bar/baz'))
                .toEqual('foo/bar/baz');
        });
    });
});
