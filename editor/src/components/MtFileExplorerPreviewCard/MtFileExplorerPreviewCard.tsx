import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  Scrollable,
  Select,
  Tooltip,
  Button,
  Stack,
  TextStyle,
  ButtonGroup,
  TextContainer,
  EmptyState,
} from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import getPathRelativeName from '../../utils/tools/fileExplorer/getPathRelativeName.utils';
import formatPath from '../../utils/tools/fileExplorer/formatPath.utils';
import {
  BucketObject,
  BucketObjectVersion,
} from '../../definitions/mtFileExplorer';
import formatBytes from '../../utils/tools/formatBytes.utils';
import isDirectory from '../../utils/tools/fileExplorer/isDirectory.utils';
import getDifferences from '../../utils/tools/fileExplorer/getDifferences.utils';
import getFileContent from '../../utils/tools/buckaroo/getFileContent.utils';
import { RowData, FileInput } from '../../definitions/custom';

import './MtFileExplorerPreviewCard.css';

export interface MtFileExplorerPreviewCardProps {
  content: BucketObject[];
  selected: string | undefined;
  path: string[];
  onLoad: (file: File) => Promise<void>;
  onDelete: (args: FileInput) => Promise<void>;
  // onRename: () => void;
  // onMove: () => void;
}

// TODO: implement a webhook (lambda) to compare uploads with previous versions

export default function MtFileExplorerPreviewCard(
  props: MtFileExplorerPreviewCardProps
) {
  const [selectedObject, setSelectedObject] = useState<BucketObject>();
  const [selectedVersionObject, setSelectedVersionObject] =
    useState<BucketObjectVersion>();
  const [previewContent, setPreviewContent] = useState<React.ReactNode>();

  const name = getPathRelativeName(selectedObject?.name || '', props.path);
  const path = `${props.path.join('/')}/`;

  const { getAccessTokenSilently } = useAuth0();

  const fetchObjectsContent = useCallback(async () => {
    if (selectedObject == null) {
      return;
    }

    const args = {
      token: await getAccessTokenSilently(),
      fileName: selectedObject.name,
      path: selectedObject.path.split('/').slice(1).join('/'),
      versionId: selectedObject.id,
    };

    selectedObject.content = await getFileContent(args);

    if (selectedVersionObject != null) {
      selectedVersionObject.content = await getFileContent({
        ...args,
        versionId: selectedVersionObject.id,
      });
    }
  }, [getAccessTokenSilently, selectedObject, selectedVersionObject]);

  async function handleLoad() {
    if (selectedObject == null || isDirectory(name)) {
      return;
    }

    if (selectedObject.content.length === 0) {
      await fetchObjectsContent();
    }

    const data = Papa.unparse(selectedObject.content.map((e) => e.data));
    const file = new File([data], selectedObject.name, { type: 'text/csv' });

    await props.onLoad(file);
  }

  async function handleDelete() {
    if (selectedObject == null) {
      return;
    }

    const args = {
      fileName: selectedObject.name,
      path: selectedObject.path.split('/').slice(1).join('/'),
      versionId: selectedObject.id,
    };

    await props.onDelete(args);
  }

  const handleSelection = useCallback(
    async (v: string) => {
      if (selectedObject == null) {
        return;
      }

      const selectedVersion = selectedObject.versions?.find((x) => x.id === v);

      if (selectedVersion == null) {
        return;
      }

      await fetchObjectsContent();

      setSelectedVersionObject(selectedVersion);
    },
    [fetchObjectsContent, selectedObject]
  );

  const versionSelector = useMemo(() => {
    return (
      <div style={{ minWidth: '100px' }}>
        <Select
          labelHidden
          label="Version"
          placeholder="Select a version to compare"
          value={selectedVersionObject?.id}
          onChange={(v) => handleSelection(v)}
          options={selectedObject?.versions?.map((v) => ({
            label: `${v.lastModified.toLocaleDateString()} - ${v.lastModified.toLocaleTimeString()}`,
            value: v.id.toString(),
          }))}
        />
      </div>
    );
  }, [handleSelection, selectedObject?.versions, selectedVersionObject?.id]);

  const headerActions = (
    <Stack>
      <Stack.Item fill>
        <Stack vertical>
          {versionSelector}
          <Stack distribution="equalSpacing" alignment="trailing">
            <p>
              Modified:{' '}
              {selectedVersionObject?.lastModified.toLocaleDateString()} -{' '}
              {selectedVersionObject?.lastModified.toLocaleTimeString()}
              <br />
              Size: {formatBytes(selectedVersionObject?.size || 0)}{' '}
              <TextStyle
                variation={
                  (selectedObject?.size || 0) <
                  (selectedVersionObject?.size || 0)
                    ? 'negative'
                    : 'positive'
                }>
                {` (${
                  (selectedObject?.size || 0) <=
                  (selectedVersionObject?.size || 0)
                    ? '+'
                    : '-'
                }${formatBytes(
                  Math.abs(
                    (selectedObject?.size || 0) -
                      (selectedVersionObject?.size || 0)
                  )
                )})`}
              </TextStyle>
            </p>
            <Button>Restore version</Button>
          </Stack>
        </Stack>
      </Stack.Item>
    </Stack>
  );

  const infoWindow = (
    <Stack vertical>
      <Stack vertical spacing="extraTight">
        <Tooltip content={name}>
          <div className="text-wrapper">Name: {name}</div>
        </Tooltip>
        <Tooltip content={path}>
          <div className="text-wrapper">Path: {path}</div>
        </Tooltip>
        <div className="text-wrapper">
          Size: {formatBytes(selectedObject?.size || 0)}
        </div>
        <p>
          Modified:{' '}
          {`${selectedObject?.lastModified.toLocaleDateString()} - ${selectedObject?.lastModified.toLocaleTimeString()}`}
        </p>
      </Stack>
      <Stack distribution="trailing">
        <ButtonGroup>
          <Button onClick={handleDelete} icon={DeleteMinor} destructive>
            Delete
          </Button>
          {!isDirectory(name) && (
            <Button onClick={handleLoad} primary>
              Load file
            </Button>
          )}
        </ButtonGroup>
      </Stack>
    </Stack>
  );

  const getContent = useCallback(() => {
    let old: RowData[] = [];
    let current: RowData[] = [];

    const comparatorFieldStyle: React.CSSProperties = {
      backgroundColor: 'var(--p-surface-subdued)',
      padding: '1ch 2ch 1ch 2ch',
      overflowWrap: 'break-word',
    };

    if (selectedObject && selectedVersionObject != null) {
      [old, current] = getDifferences(
        selectedObject.content,
        selectedObject.versions?.find((v) => v.id === selectedVersionObject?.id)
          ?.content || []
      );

      const length = Math.max(old.length, current.length);
      const tmp = [];
      for (let i = 0; i < length; i++) {
        tmp.push(i);
      }

      const highlightTxt = (
        baseTxt: string,
        compareTxt: string,
        color: 'red' | 'green'
      ) => {
        const style = {
          backgroundColor:
            color === 'red'
              ? 'var(--p-action-critical)'
              : 'var(--p-action-primary)',
          color: 'white',
        };

        return (
          <TextContainer>
            {baseTxt.split('').map((c, i) =>
              c !== compareTxt[i] ? (
                <span key={i} style={style}>
                  {c}
                </span>
              ) : (
                c
              )
            )}
          </TextContainer>
        );
      };

      if (current.length > 0 || old.length > 0) {
        return (
          <Scrollable
            horizontal={false}
            style={{
              height: '320px',
              padding: '1% 0 0 1%',
            }}>
            <Stack alignment="fill" vertical>
              {tmp.map((x) => {
                return (
                  // <div key={x} style={{ width: '44%' }}>
                  <div key={x}>
                    <Stack alignment="center" key={x} wrap={false}>
                      <div style={comparatorFieldStyle}>
                        {highlightTxt(
                          current[x].data?.at(-1) || '',
                          old[x].data?.at(-1) || '',
                          'green'
                        )}
                      </div>
                      <p>{x + 1}</p>
                      <div style={comparatorFieldStyle}>
                        {highlightTxt(
                          old[x].data?.at(-1) || '',
                          current[x].data?.at(-1) || '',
                          'red'
                        )}
                      </div>
                    </Stack>
                  </div>
                );
              })}
            </Stack>
          </Scrollable>
        );
      }

      // setSelectedVersionObject(undefined);

      return (
        <div style={{ minHeight: '320px' }}>
          <EmptyState
            heading="No differences"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            There is no differences between the two versions.
            <div>{versionSelector}</div>
          </EmptyState>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '320px' }}>
        {isDirectory(formatPath(name)) ? (
          <p>
            would be cool to be able to see all folders here to navigate quickly
            🚀
          </p>
        ) : (
          <EmptyState
            heading="Compare with older versions"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            Compare fields between the most recent and older versions of the
            same file.
            <div>{versionSelector}</div>
          </EmptyState>
        )}
      </div>
    );
  }, [name, selectedObject, selectedVersionObject, versionSelector]);

  useEffect(() => {
    setSelectedObject(props.content.find((x) => x.id === props.selected));
    setSelectedVersionObject(undefined);
  }, [props.content, props.selected]);

  useEffect(() => {
    setPreviewContent(getContent());
  }, [getContent, selectedObject, selectedVersionObject]);

  return (
    <Card>
      {/* <div style={{ width: '680px' }}> */}
      <div>
        {selectedObject ? (
          <>
            {selectedVersionObject != null && (
              <Card.Section subdued title="Preview">
                {headerActions}
              </Card.Section>
            )}
            <Card.Section flush>{previewContent}</Card.Section>
            <Card.Section subdued>{infoWindow}</Card.Section>
          </>
        ) : (
          <EmptyState
            heading="Select a file or sub-folder"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            Click on a file or a sub-folder to have more information about them.
          </EmptyState>
        )}
      </div>
    </Card>
  );
}
