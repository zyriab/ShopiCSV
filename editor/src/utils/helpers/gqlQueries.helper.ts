const errorSpreads = `
    ... on ServerError {
          message
        }
     ... on Unauthenticated {
       message
      }
      ... on Unauthorized {
          message
        }
        ... on StorageNotFound {
          message
        }
        `;

const fileInputArgs: FileInput = {
  fileName: '',
  path: '',
  root: undefined,
  versionId: undefined,
  bucketName: undefined,
};

// TODO: make sure all queries asks for all lines

const fileInputStr =
  'fileInput: { fileName: $fileName, path: $path, root: $root, versionId: $versionId, bucketName: $bucketName }';

/* QUERIES */
export const listBucketContentQuery = {
  query: `
    query ListBucketContent($path: String!, $root: String, $bucketName: String) {
      listBucketContent(listInput: {path: $path, root: $root, bucketName: $bucketName}) {
        __typename
        ... on ObjectList {
          objects {
            id
            name
            lastModified
            size
            path
            versions {
              id
              lastModified
              size
              path
            }
          }
        }
        ${errorSpreads}
      }
  }
          `,
  variables: {
    path: '',
    root: undefined,
    bucketName: undefined,
  } as ListInput,
};

export const getDownloadUrlQuery = {
  query: `
    query GetDownloadUrl($fileName: String!, $path: String!, $root: String, $versionId: String, $bucketName: String) {
      getDownloadUrl(${fileInputStr}) {
        __typename
        ... on SignedUrl {
          url
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: fileInputArgs,
};

export const getUploadUrlQuery = {
  query: `
    query GetUploadUrl($fileName: String!, $fileType: String!, $path: String!, $root: String) {
      getUploadUrl(uploadInput:{fileName: $fileName, fileType: $fileType, path: $path, root: $root}) {
        __typename
        ... on SignedPost {
          url
          fields
        }
        ${errorSpreads}
      }
    }
`,
  variables: {
    fileName: '',
    fileType: 'text',
    path: '',
    root: undefined,
  } as UploadInput,
};

export const getTextFileContentQuery = {
  query: `
    query GetTextFileContent($fileName: String!, $path: String!, $root: String, $versionId: String, $bucketName: String) {
      getTextFileContent(${fileInputStr}) {
        __typename
        ... on TextFileContent {
          content
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: fileInputArgs,
};

/* MUTATIONS */
export const deleteOneFileQuery = {
  query: `
    mutation DeleteOneFile($fileName: String!, $path: String!, $root: String, $versionId: String, $bucketName: String) {
      deleteOneFile(${fileInputStr}) {
        __typename
        ... on FileName {
          name
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: fileInputArgs,
};

export const deleteManyFilesQuery = {
  query: `
    mutation DeleteManyFiles($fileNames: [String!]!, $path: String!, $root: String, $versionIds: [String!],  $bucketName: String) {
      deleteManyFiles(filesInput: { fileNames: $fileNames, path: $path, root: $root, versionIds: $versionIds, bucketName: $bucketName}) {
        __typename
        ... on FileNameList {
          names
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: {
    fileNames: [''],
    path: '',
    root: undefined,
    versionIds: undefined,
    bucketName: undefined,
  } as FilesInput,
};

export const deleteDirectoryQuery = {
  query: `
    mutation DeleteDirectory($path: String!, $root: String, $bucketName: String) {
      deleteDirectory(directoryInput: { path: $path, root: $root, bucketName: $bucketName}) {
        __typename
        ... on Directory {
          name
          path
          bucketName
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: {
    path: '',
    root: undefined,
    bucketName: undefined,
  } as DirectoryInput,
};

export const restoreFileVersionQuery = {
  query: `
    mutation RestoreFileVersion($fileName: String!, $path: String!, $root: String, $versionId: String, $bucketName: String) {
      restoreFileVersion(${fileInputStr}) {
        __typename
        ... on VersionId {
          id
        }
        ... on FileNotFound {
          message
        }
        ${errorSpreads}
      }
    }
  `,
  variables: fileInputArgs,
};

interface ListInput {
  path: string;
  root?: string;
  bucketName?: string;
}

interface FileInput {
  fileName: string;
  path: string;
  root?: string;
  versionId?: string;
  bucketName?: string;
}

interface FilesInput {
  fileNames: string[];
  path: string;
  root?: string;
  versionIds?: string[];
  bucketName?: string;
}

interface UploadInput {
  fileName: string;
  fileType: string;
  path: string;
  root?: string;
}

interface DirectoryInput {
  path: string;
  root?: string;
  bucketName?: string;
}
