import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import MtFileExplorerFileCard, {
  MtFileExplorerFileCardProps,
} from '../../components/MtFileExplorerFileCard/MtFileExplorerFileCard';
import MtFileExplorerPreviewCard, {
  MtFileExplorerPreviewCardProps,
} from '../../components/MtFileExplorerPreviewCard/MtFileExplorerPreviewCard';
import MtFileExplorerTopBar, {
  MtFileExplorerTopBarProps,
} from '../../components/MtFileExplorerTopBar/MtFileExplorerTopBar';
import { BucketObject } from '../../definitions/mtFileExplorer';
import { listBucketContent } from '../tools/buckaroo/queries.utils';
import { BucketObjectInfo, FileInput } from '../../definitions/custom';
import getDataType from '../tools/getDataType.utils';

import './MtFileExplorer.css';
import formatPath from '../tools/fileExplorer/formatPath.utils';

interface useFileExplorerProps {
  onFileLoad: (file: File) => Promise<void>;
  onUpload: (objInfo: BucketObjectInfo, file: File) => Promise<void>;
  onDelete: (args: FileInput) => Promise<void>;
}

//  TODO: add dropzone

export default function useFileExplorer(props: useFileExplorerProps) {
  const [path, setPath] = useState<string[]>([]);
  const [filesContent, setFilesContent] = useState<BucketObject[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [isFetchingObjects, setIsFetchingObjects] = useState(false);

  const isMounted = useRef(false);
  const fileInputEl = useRef<HTMLInputElement>(null);

  const { getAccessTokenSilently } = useAuth0();

  // file card
  const [selectedFileId, setSelectedFileId] = useState<string>();

  function handleClickUpload() {
    fileInputEl.current?.click();
  }

  async function handleUpload(file: File) {
    const objInfo = {
      fileName: file.name,
      path: [getDataType(), ...path].join('/'),
      versionId:
        selectedFileId && Number.isNaN(+selectedFileId)
          ? selectedFileId
          : undefined,
    };

    await props.onUpload(objInfo, file);
  }

  async function handleDelete(fileInput: FileInput) {
    setFilesContent((content) =>
      content.filter(
        (o) =>
          o.name !== fileInput.fileName &&
          o.path
            .split('/')
            .slice(1, o.path.length - 1)
            .join('/') !== fileInput.path
      )
    );
    await props.onDelete(fileInput);
  }

  const fetchData = useCallback(async () => {
    if (isMounted.current) {
      setIsFetchingObjects(true);

      const token = await getAccessTokenSilently();
      const files = await listBucketContent({ token });

      setIsFetchingObjects(false);

      setFilesContent(files);
    }
  }, [getAccessTokenSilently]);

  const fileUploadEl = (
    <input
      ref={fileInputEl}
      onChange={async (e) =>
        e?.target.files ? await handleUpload(e.target.files[0]) : undefined
      }
      type="file"
      accept="text/csv"
      className="display-none"
      title="Files explorer file upload"
    />
  );

  useEffect(() => {
    // making sure fileInputEl is set
    if (shouldUpdate) setShouldUpdate(false);
  }, [shouldUpdate]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* COMPONENTS PROPS */
  const topBarProps = {
    onClickNewFolder: () => {},
    onClickUpload: handleClickUpload,
    onClickRefresh: fetchData,
  };

  const fileCardProps = {
    content: filesContent,
    selected: selectedFileId,
    setSelected: setSelectedFileId,
    isLoading: isFetchingObjects,
    path,
    setPath,
    onClickUpload: handleClickUpload,
  };

  const previewCardProps = {
    content: filesContent,
    selected: selectedFileId,
    path,
    onLoad: props.onFileLoad,
    onDelete: handleDelete,
  };

  return {
    TopBar,
    FileCard,
    PreviewCard,
    topBarProps,
    fileCardProps,
    previewCardProps,
    fileUploadEl,
  };
}

function TopBar(props: MtFileExplorerTopBarProps) {
  return <MtFileExplorerTopBar {...props} />;
}

function FileCard(props: MtFileExplorerFileCardProps) {
  return <MtFileExplorerFileCard {...props} />;
}

function PreviewCard(props: MtFileExplorerPreviewCardProps) {
  return <MtFileExplorerPreviewCard {...props} />;
}
