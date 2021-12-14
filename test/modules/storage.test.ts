import { Storage } from '../../src/modules';

const TestDir = __dirname + '/../data';

describe('Storage', () => {
    describe('getFileInfo', () => {
        test('#1 default case', () => {
            return Storage.getFileInfo(TestDir + '/test.txt')
                .then((stat) => {
                    expect(stat.name)
                        .toEqual('test.txt');
                });
        });
        test('#2 file is not exists', () => {
            return Storage.getFileInfo(TestDir + '/test').then(()=>{
                expect(false).toBeTruthy();
            }, () => {
                expect(true).toBeTruthy();
            });
        });
    });
    describe('getFileStream', () => {
        test('#1 default case', () => {
            return Storage.getFileStream(TestDir + '/test.txt')
                .then((stream) => {
                    stream.on('readable', () => {
                        expect(stream.bytesRead)
                            .toEqual(531);
                    });
                });
        });
        test('#2 read by range', () => {
            return Storage.getFileStream(TestDir + '/test.txt', {
                start: 30,
                end: Infinity,
            })
                .then((stream) => {
                    stream.on('readable', () => {
                        expect(stream.bytesRead)
                            .toEqual(501);
                    });
                });
        });
        test('#3 file is not exists', () => {
            let r = null;
            try {
                Storage.getFileStream(TestDir + '/test');
            } catch (e) {
                r = e;
            }
            expect(r)
                .toBeInstanceOf(Error);
        });
        test('#4 file is a directory', () => {
            let r = null;
            try {
                Storage.getFileStream(TestDir);
            } catch (e) {
                r = e;
            }
            expect(r)
                .toBeInstanceOf(Error);
        });
    });
    describe('getFile', () => {
        test('#1 default case', () => {
            return Storage.getFile(TestDir + '/test.txt')
                .then((data) => {
                    expect(data.toString())
                        .toEqual('::0:170::1:4.80::2:4.60::3:2.40::4:2::5:2::6:9::7:5::8:1::9:358::10:5::11:0::12:1::13:5::14:1::15:2::16:4::17:3::18:1::19:0::20:0::21:0::22:0::23:0::24:1::25:25::26:0.50::27:0.50::28:0.50::29:1::30:0::31:0::32:0::33:0::34:0::35:0::36:0::37:1::38:2::39:0::40:1::41:0::42:0::43:0::44:0::45:0::46:0::47:0::48:0::49:3::50:2::51:30::52:0::53:0::54:2::55:2::56:2::57:0::58:0::59:1::60:1::61:0::62:0::63:0::64:3::65:0::66:0::67:0::68:0::69:0::70:0::71:0::72:0::73:0::74:0::75:0::76:0::77:0::78:0::79:0::80:0::81:0::82:1::83:0::84:0::85:0\n');
                });
        });
        test('#2 file is not exists', () => {
            let r = null;
            try {
                Storage.getFile(TestDir + '/test');
            } catch (e) {
                r = e;
            }
            expect(r).toBeInstanceOf(Error);
        });
        test('#3 file is a directory', () => {
            let r = null;
            try {
                Storage.getFile(TestDir);
            } catch (e) {
                r = e;
            }
            expect(r).toBeInstanceOf(Error);
        });
    });
    describe('getDirectory', () => {
        test('#1 default case', () => {
            return Storage.getDirectory(TestDir).then((list) => {
                expect(list[0].name).toEqual('test.txt');
            });
        });
        test('#2 get file', () => {
            let r = null;
            try {
                Storage.getDirectory(TestDir + '/test.txt');
            } catch (e) {
                r = e;
            }
            expect(r).toBeInstanceOf(Error);
        });
        test('#3 directory', () => {
            let r = null;
            try {
                Storage.getDirectory(TestDir + '/test');
            } catch (e) {
                r = e;
            }
            expect(r).toBeInstanceOf(Error);
        });
    });
});
