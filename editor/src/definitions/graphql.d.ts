import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  PostFields: any;
};

export type DeleteDirectoryResult =
  | Directory
  | FileNotFound
  | ServerError
  | StorageNotFound
  | Unauthenticated
  | Unauthorized;

export type DeleteFileResult =
  | FileName
  | FileNameList
  | FileNotFound
  | ServerError
  | StorageNotFound
  | Unauthenticated
  | Unauthorized;

export type Directory = {
  __typename?: 'Directory';
  bucketName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  path: Scalars['String'];
};

export type DirectoryInput = {
  bucketName?: InputMaybe<Scalars['String']>;
  path: Scalars['String'];
  root?: InputMaybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  id?: Maybe<Scalars['ID']>;
  lastModified: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  size: Scalars['Int'];
  versions?: Maybe<Array<Version>>;
};

export type FileInput = {
  bucketName?: InputMaybe<Scalars['String']>;
  fileName: Scalars['String'];
  path: Scalars['String'];
  root?: InputMaybe<Scalars['String']>;
  versionId?: InputMaybe<Scalars['String']>;
};

export type FileList = {
  __typename?: 'FileList';
  list: Array<File>;
};

export type FileName = {
  __typename?: 'FileName';
  name: Scalars['String'];
};

export type FileNameList = {
  __typename?: 'FileNameList';
  names: Array<Scalars['String']>;
};

export type FileNotFound = {
  __typename?: 'FileNotFound';
  message: Scalars['String'];
};

export type FilesInput = {
  bucketName?: InputMaybe<Scalars['String']>;
  fileNames: Array<Scalars['String']>;
  path: Scalars['String'];
  root?: InputMaybe<Scalars['String']>;
  versionIds?: InputMaybe<Array<Scalars['String']>>;
};

export type ListBucketResult =
  | FileList
  | ServerError
  | StorageNotFound
  | Unauthenticated
  | Unauthorized;

/** INPUT TYPES */
export type ListInput = {
  bucketName?: InputMaybe<Scalars['String']>;
  path: Scalars['String'];
  root?: InputMaybe<Scalars['String']>;
};

export type Mutations = {
  __typename?: 'Mutations';
  deleteDirectory?: Maybe<DeleteDirectoryResult>;
  deleteManyFiles?: Maybe<DeleteFileResult>;
  deleteOneFile?: Maybe<DeleteFileResult>;
  restoreFileVersion?: Maybe<RestoreFileResult>;
};

export type MutationsDeleteDirectoryArgs = {
  directoryInput?: InputMaybe<DirectoryInput>;
};

export type MutationsDeleteManyFilesArgs = {
  filesInput: FilesInput;
};

export type MutationsDeleteOneFileArgs = {
  fileInput: FileInput;
};

export type MutationsRestoreFileVersionArgs = {
  fileInput: FileInput;
};

export type Queries = {
  __typename?: 'Queries';
  getDownloadUrl: SignedUrlResult;
  getTextFileContent: TextFileContentResult;
  getUploadUrl: SignedUrlResult;
  listBucketContent: ListBucketResult;
};

export type QueriesGetDownloadUrlArgs = {
  fileInput: FileInput;
};

export type QueriesGetTextFileContentArgs = {
  fileInput: FileInput;
};

export type QueriesGetUploadUrlArgs = {
  uploadInput: UploadInput;
};

export type QueriesListBucketContentArgs = {
  listInput: ListInput;
};

export type RestoreFileResult =
  | FileNotFound
  | ServerError
  | StorageNotFound
  | Unauthenticated
  | Unauthorized
  | VersionId;

export type ServerError = {
  __typename?: 'ServerError';
  message: Scalars['String'];
  stack?: Maybe<Scalars['String']>;
};

export type SignedPost = {
  __typename?: 'SignedPost';
  fields: Scalars['PostFields'];
  url: Scalars['String'];
};

export type SignedUrl = {
  __typename?: 'SignedUrl';
  url: Scalars['String'];
};

export type SignedUrlResult =
  | FileNotFound
  | ServerError
  | SignedPost
  | SignedUrl
  | StorageNotFound
  | Unauthenticated
  | Unauthorized;

export type StorageNotFound = {
  __typename?: 'StorageNotFound';
  message: Scalars['String'];
};

export type TextFileContent = {
  __typename?: 'TextFileContent';
  content: Scalars['String'];
};

export type TextFileContentResult =
  | FileNotFound
  | ServerError
  | StorageNotFound
  | TextFileContent
  | Unauthenticated
  | Unauthorized;

/** ERROR TYPES */
export type Unauthenticated = {
  __typename?: 'Unauthenticated';
  message: Scalars['String'];
};

export type Unauthorized = {
  __typename?: 'Unauthorized';
  message: Scalars['String'];
};

export type UploadInput = {
  bucketName?: InputMaybe<Scalars['String']>;
  fileName: Scalars['String'];
  fileType: Scalars['String'];
  path: Scalars['String'];
  root?: InputMaybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  id: Scalars['ID'];
  lastModified: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  size: Scalars['Int'];
};

export type VersionId = {
  __typename?: 'VersionId';
  id: Scalars['ID'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DeleteDirectoryResult:
    | ResolversTypes['Directory']
    | ResolversTypes['FileNotFound']
    | ResolversTypes['ServerError']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized'];
  DeleteFileResult:
    | ResolversTypes['FileName']
    | ResolversTypes['FileNameList']
    | ResolversTypes['FileNotFound']
    | ResolversTypes['ServerError']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized'];
  Directory: ResolverTypeWrapper<Directory>;
  DirectoryInput: DirectoryInput;
  File: ResolverTypeWrapper<File>;
  FileInput: FileInput;
  FileList: ResolverTypeWrapper<FileList>;
  FileName: ResolverTypeWrapper<FileName>;
  FileNameList: ResolverTypeWrapper<FileNameList>;
  FileNotFound: ResolverTypeWrapper<FileNotFound>;
  FilesInput: FilesInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ListBucketResult:
    | ResolversTypes['FileList']
    | ResolversTypes['ServerError']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized'];
  ListInput: ListInput;
  Mutations: ResolverTypeWrapper<{}>;
  PostFields: ResolverTypeWrapper<Scalars['PostFields']>;
  Queries: ResolverTypeWrapper<{}>;
  RestoreFileResult:
    | ResolversTypes['FileNotFound']
    | ResolversTypes['ServerError']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized']
    | ResolversTypes['VersionId'];
  ServerError: ResolverTypeWrapper<ServerError>;
  SignedPost: ResolverTypeWrapper<SignedPost>;
  SignedUrl: ResolverTypeWrapper<SignedUrl>;
  SignedUrlResult:
    | ResolversTypes['FileNotFound']
    | ResolversTypes['ServerError']
    | ResolversTypes['SignedPost']
    | ResolversTypes['SignedUrl']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized'];
  StorageNotFound: ResolverTypeWrapper<StorageNotFound>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TextFileContent: ResolverTypeWrapper<TextFileContent>;
  TextFileContentResult:
    | ResolversTypes['FileNotFound']
    | ResolversTypes['ServerError']
    | ResolversTypes['StorageNotFound']
    | ResolversTypes['TextFileContent']
    | ResolversTypes['Unauthenticated']
    | ResolversTypes['Unauthorized'];
  Unauthenticated: ResolverTypeWrapper<Unauthenticated>;
  Unauthorized: ResolverTypeWrapper<Unauthorized>;
  UploadInput: UploadInput;
  Version: ResolverTypeWrapper<Version>;
  VersionId: ResolverTypeWrapper<VersionId>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  DeleteDirectoryResult:
    | ResolversParentTypes['Directory']
    | ResolversParentTypes['FileNotFound']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized'];
  DeleteFileResult:
    | ResolversParentTypes['FileName']
    | ResolversParentTypes['FileNameList']
    | ResolversParentTypes['FileNotFound']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized'];
  Directory: Directory;
  DirectoryInput: DirectoryInput;
  File: File;
  FileInput: FileInput;
  FileList: FileList;
  FileName: FileName;
  FileNameList: FileNameList;
  FileNotFound: FileNotFound;
  FilesInput: FilesInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  ListBucketResult:
    | ResolversParentTypes['FileList']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized'];
  ListInput: ListInput;
  Mutations: {};
  PostFields: Scalars['PostFields'];
  Queries: {};
  RestoreFileResult:
    | ResolversParentTypes['FileNotFound']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized']
    | ResolversParentTypes['VersionId'];
  ServerError: ServerError;
  SignedPost: SignedPost;
  SignedUrl: SignedUrl;
  SignedUrlResult:
    | ResolversParentTypes['FileNotFound']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['SignedPost']
    | ResolversParentTypes['SignedUrl']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized'];
  StorageNotFound: StorageNotFound;
  String: Scalars['String'];
  TextFileContent: TextFileContent;
  TextFileContentResult:
    | ResolversParentTypes['FileNotFound']
    | ResolversParentTypes['ServerError']
    | ResolversParentTypes['StorageNotFound']
    | ResolversParentTypes['TextFileContent']
    | ResolversParentTypes['Unauthenticated']
    | ResolversParentTypes['Unauthorized'];
  Unauthenticated: Unauthenticated;
  Unauthorized: Unauthorized;
  UploadInput: UploadInput;
  Version: Version;
  VersionId: VersionId;
};

export type DeleteDirectoryResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteDirectoryResult'] = ResolversParentTypes['DeleteDirectoryResult']
> = {
  __resolveType: TypeResolveFn<
    | 'Directory'
    | 'FileNotFound'
    | 'ServerError'
    | 'StorageNotFound'
    | 'Unauthenticated'
    | 'Unauthorized',
    ParentType,
    ContextType
  >;
};

export type DeleteFileResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteFileResult'] = ResolversParentTypes['DeleteFileResult']
> = {
  __resolveType: TypeResolveFn<
    | 'FileName'
    | 'FileNameList'
    | 'FileNotFound'
    | 'ServerError'
    | 'StorageNotFound'
    | 'Unauthenticated'
    | 'Unauthorized',
    ParentType,
    ContextType
  >;
};

export type DirectoryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Directory'] = ResolversParentTypes['Directory']
> = {
  bucketName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastModified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  versions?: Resolver<
    Maybe<Array<ResolversTypes['Version']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileList'] = ResolversParentTypes['FileList']
> = {
  list?: Resolver<Array<ResolversTypes['File']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileNameResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileName'] = ResolversParentTypes['FileName']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileNameListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileNameList'] = ResolversParentTypes['FileNameList']
> = {
  names?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileNotFoundResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileNotFound'] = ResolversParentTypes['FileNotFound']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListBucketResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ListBucketResult'] = ResolversParentTypes['ListBucketResult']
> = {
  __resolveType: TypeResolveFn<
    | 'FileList'
    | 'ServerError'
    | 'StorageNotFound'
    | 'Unauthenticated'
    | 'Unauthorized',
    ParentType,
    ContextType
  >;
};

export type MutationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutations'] = ResolversParentTypes['Mutations']
> = {
  deleteDirectory?: Resolver<
    Maybe<ResolversTypes['DeleteDirectoryResult']>,
    ParentType,
    ContextType,
    Partial<MutationsDeleteDirectoryArgs>
  >;
  deleteManyFiles?: Resolver<
    Maybe<ResolversTypes['DeleteFileResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationsDeleteManyFilesArgs, 'filesInput'>
  >;
  deleteOneFile?: Resolver<
    Maybe<ResolversTypes['DeleteFileResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationsDeleteOneFileArgs, 'fileInput'>
  >;
  restoreFileVersion?: Resolver<
    Maybe<ResolversTypes['RestoreFileResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationsRestoreFileVersionArgs, 'fileInput'>
  >;
};

export interface PostFieldsScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PostFields'], any> {
  name: 'PostFields';
}

export type QueriesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Queries'] = ResolversParentTypes['Queries']
> = {
  getDownloadUrl?: Resolver<
    ResolversTypes['SignedUrlResult'],
    ParentType,
    ContextType,
    RequireFields<QueriesGetDownloadUrlArgs, 'fileInput'>
  >;
  getTextFileContent?: Resolver<
    ResolversTypes['TextFileContentResult'],
    ParentType,
    ContextType,
    RequireFields<QueriesGetTextFileContentArgs, 'fileInput'>
  >;
  getUploadUrl?: Resolver<
    ResolversTypes['SignedUrlResult'],
    ParentType,
    ContextType,
    RequireFields<QueriesGetUploadUrlArgs, 'uploadInput'>
  >;
  listBucketContent?: Resolver<
    ResolversTypes['ListBucketResult'],
    ParentType,
    ContextType,
    RequireFields<QueriesListBucketContentArgs, 'listInput'>
  >;
};

export type RestoreFileResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RestoreFileResult'] = ResolversParentTypes['RestoreFileResult']
> = {
  __resolveType: TypeResolveFn<
    | 'FileNotFound'
    | 'ServerError'
    | 'StorageNotFound'
    | 'Unauthenticated'
    | 'Unauthorized'
    | 'VersionId',
    ParentType,
    ContextType
  >;
};

export type ServerErrorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ServerError'] = ResolversParentTypes['ServerError']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignedPostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SignedPost'] = ResolversParentTypes['SignedPost']
> = {
  fields?: Resolver<ResolversTypes['PostFields'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignedUrlResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SignedUrl'] = ResolversParentTypes['SignedUrl']
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignedUrlResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SignedUrlResult'] = ResolversParentTypes['SignedUrlResult']
> = {
  __resolveType: TypeResolveFn<
    | 'FileNotFound'
    | 'ServerError'
    | 'SignedPost'
    | 'SignedUrl'
    | 'StorageNotFound'
    | 'Unauthenticated'
    | 'Unauthorized',
    ParentType,
    ContextType
  >;
};

export type StorageNotFoundResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['StorageNotFound'] = ResolversParentTypes['StorageNotFound']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextFileContentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TextFileContent'] = ResolversParentTypes['TextFileContent']
> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextFileContentResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TextFileContentResult'] = ResolversParentTypes['TextFileContentResult']
> = {
  __resolveType: TypeResolveFn<
    | 'FileNotFound'
    | 'ServerError'
    | 'StorageNotFound'
    | 'TextFileContent'
    | 'Unauthenticated'
    | 'Unauthorized',
    ParentType,
    ContextType
  >;
};

export type UnauthenticatedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Unauthenticated'] = ResolversParentTypes['Unauthenticated']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnauthorizedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Unauthorized'] = ResolversParentTypes['Unauthorized']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionIdResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['VersionId'] = ResolversParentTypes['VersionId']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DeleteDirectoryResult?: DeleteDirectoryResultResolvers<ContextType>;
  DeleteFileResult?: DeleteFileResultResolvers<ContextType>;
  Directory?: DirectoryResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FileList?: FileListResolvers<ContextType>;
  FileName?: FileNameResolvers<ContextType>;
  FileNameList?: FileNameListResolvers<ContextType>;
  FileNotFound?: FileNotFoundResolvers<ContextType>;
  ListBucketResult?: ListBucketResultResolvers<ContextType>;
  Mutations?: MutationsResolvers<ContextType>;
  PostFields?: GraphQLScalarType;
  Queries?: QueriesResolvers<ContextType>;
  RestoreFileResult?: RestoreFileResultResolvers<ContextType>;
  ServerError?: ServerErrorResolvers<ContextType>;
  SignedPost?: SignedPostResolvers<ContextType>;
  SignedUrl?: SignedUrlResolvers<ContextType>;
  SignedUrlResult?: SignedUrlResultResolvers<ContextType>;
  StorageNotFound?: StorageNotFoundResolvers<ContextType>;
  TextFileContent?: TextFileContentResolvers<ContextType>;
  TextFileContentResult?: TextFileContentResultResolvers<ContextType>;
  Unauthenticated?: UnauthenticatedResolvers<ContextType>;
  Unauthorized?: UnauthorizedResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
  VersionId?: VersionIdResolvers<ContextType>;
};
