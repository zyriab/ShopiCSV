import { RowData } from './custom';

export interface BucketObjectVersion {
  id: string;
  size: number;
  path: string;
  content: RowData[];
  lastModified: Date;
}

export interface BucketObject {
  id: string;
  name: string;
  path: string;
  size: number;
  content: RowData[];
  lastModified: Date;
  versions?: BucketObjectVersion[];
}
