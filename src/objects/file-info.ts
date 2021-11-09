import { Stats } from 'fs';

export type FileInfo = {
    path: string;
    name: string;
    mime: string | null;
    ext: string | null;
    isDir: boolean;
} & Stats;

export type FileUndefined = {
    path: string;
    name: string;
    ext: null;
    isDir: true;
};
