import { Stats } from 'fs';

export type FileInfo = {
  path: string;
  name: string;
  ext: string;
} & Stats;
