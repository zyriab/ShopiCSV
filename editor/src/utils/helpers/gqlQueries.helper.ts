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

export const GetUploadUrlQuery = {
  query: `
  query getUploadUrl($fileName: String!, $fileType: String!, $path: String!, $root: String) {
    getUploadUrl(uploadInput:{fileName: $fileName, fileType: $fileType, path: $path, root: $root}) {
      __typename
      ... on SignedPost {
        url
        fields
      }
    }
  }
  
  ${errorSpreads}
`,
  variables: {
    fileName: '',
    fileType: 'text',
    path: '',
    root: undefined,
  },
};
