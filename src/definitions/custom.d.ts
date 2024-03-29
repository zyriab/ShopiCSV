export type RowData = { id: number; data: string[] };

export type DataType = 'Translations' | 'Products';

export type TranslatableResourceType =
  | 'COLLECTION'
  | 'DELIVERY_METHOD_DEFINITION'
  | 'EMAIL_TEMPLATE'
  | 'SMS_TEMPLATE'
  | 'LINK'
  | 'METAFIELD'
  | 'ONLINE_STORE_ARTICLE'
  | 'ONLINE_STORE_BLOG'
  | 'ONLINE_STORE_MENU'
  | 'ONLINE_STORE_PAGE'
  | 'ONLINE_STORE_THEME'
  | 'PACKING_SLIP_TEMPLATE'
  | 'PAYMENT_GATEWAY'
  | 'PRODUCT'
  | 'PRODUCT_OPTION'
  | 'PRODUCT_VARIANT'
  | 'SHOP'
  | 'SHOP_POLICY';

export interface FilterType {
  type: TranslatableResourceType;
  description?: string;
}

export interface BucketObjectInfo {
  fileName: string;
  path: string;
  versionId?: string;
}

export interface FileInput {
  fileName: string;
  path: string;
  root?: string;
  versionId?: string;
  bucketName?: string;
}
export interface TokenizedFileInput extends FileInput {
  token: string;
}
