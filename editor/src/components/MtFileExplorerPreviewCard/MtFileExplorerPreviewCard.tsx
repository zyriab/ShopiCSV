import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
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
import { RowData, FileInput } from '../../definitions/custom';
import { mockFileContentV1 } from '../../utils/tools/demo/filesContent.utils';

import './MtFileExplorerPreviewCard.css';

export interface MtFileExplorerPreviewCardProps {
  content: BucketObject[];
  selected: string | undefined;
  path: string[];
  onLoad: (args: {
    file: File;
    path: string;
    versionId?: string;
    token?: string;
  }) => Promise<void>;
  onDelete: (args: FileInput) => Promise<void>;
  onOpenDirectory: (name: string) => void;
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
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const fullName = `${selectedObject?.path || ''}/${
    selectedObject?.name || ''
  }`;
  const name = getPathRelativeName(fullName, props.path);
  const path = `${props.path.join('/')}/`;

  const { t } = useTranslation();

  const fetchObjectsContent = useCallback(async () => {
    if (selectedObject == null) {
      return;
    }

    selectedObject.content = mockFileContentV1.content;
    return;
  }, [selectedObject]);

  async function handleLoad() {
    if (isLoadingFile || selectedObject == null || isDirectory(name)) {
      return;
    }

    setIsLoadingFile(true);

    if (selectedObject.content.length === 0) {
      await fetchObjectsContent();
    }

    const data = Papa.unparse(selectedObject.content.map((e) => e.data));
    const file = new File([data], selectedObject.name, {
      type: 'text/csv',
      lastModified: selectedObject.lastModified.getTime(),
    });

    await props.onLoad({
      file,
      path: selectedObject.path,
      versionId: selectedObject.id,
    });
  }

  async function handleRestore() {
    if (
      isLoadingFile ||
      selectedVersionObject == null ||
      selectedObject == null ||
      isDirectory(name)
    ) {
      return;
    }

    setIsLoadingFile(true);

    if (selectedVersionObject.content.length === 0) {
      await fetchObjectsContent();
    }

    const data = Papa.unparse(selectedVersionObject.content.map((e) => e.data));
    const file = new File([data], selectedObject.name, { type: 'text/csv' });

    await props.onLoad({
      file,
      path: selectedObject.path,
      versionId: selectedObject.id,
    });
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
          label={t('FileExplorer.PreviewCard.version')}
          placeholder={t('FileExplorer.PreviewCard.versionSelectorPlaceHolder')}
          value={selectedVersionObject?.id}
          onChange={(v) => handleSelection(v)}
          options={selectedObject?.versions?.map((v) => ({
            label: `${v.lastModified.toLocaleDateString()} - ${v.lastModified.toLocaleTimeString()}`,
            value: v.id.toString(),
          }))}
        />
      </div>
    );
  }, [handleSelection, selectedObject?.versions, selectedVersionObject?.id, t]);

  const headerActions = (
    <Stack>
      <Stack.Item fill>
        <Stack vertical>
          {versionSelector}
          <Stack distribution="equalSpacing" alignment="trailing">
            <p>
              {t('FileExplorer.PreviewCard.modified')}{' '}
              {selectedVersionObject?.lastModified.toLocaleDateString()} -{' '}
              {selectedVersionObject?.lastModified.toLocaleTimeString()}
              <br />
              {t('FileExplorer.PreviewCard.size')}{' '}
              {formatBytes(selectedVersionObject?.size || 0)}{' '}
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
            <Button onClick={handleRestore}>
              {t('FileExplorer.PreviewCard.restoreVersion')}
            </Button>
          </Stack>
        </Stack>
      </Stack.Item>
    </Stack>
  );

  const infoWindow = (
    <Stack vertical>
      <Stack vertical spacing="extraTight">
        <Tooltip content={name}>
          <div className="text-wrapper">
            {t('FileExplorer.PreviewCard.name')} {name}
          </div>
        </Tooltip>
        <Tooltip content={path}>
          <div className="text-wrapper">
            {t('FileExplorer.PreviewCard.path')}{' '}
            {`${formatPath(`/${path}/`, {
              stripLeading: false,
              stripTrailing: false,
            })}`}
          </div>
        </Tooltip>
        {/* TODO: add size of directory + last modified date (addition of all files sizes and last mod file under given path) */}
        {!isDirectory(name) && (
          <>
            <div className="text-wrapper">
              {t('FileExplorer.PreviewCard.size')}{' '}
              {formatBytes(selectedObject?.size || 0)}
            </div>
            <p>
              {t('FileExplorer.PreviewCard.modified')}{' '}
              {`${selectedObject?.lastModified.toLocaleDateString()} - ${selectedObject?.lastModified.toLocaleTimeString()}`}
            </p>
          </>
        )}
      </Stack>
      <Stack distribution="trailing">
        <ButtonGroup>
          <Button onClick={() => {}} icon={DeleteMinor} disabled destructive>
            {t('FileExplorer.PreviewCard.delete')}
          </Button>
          {isDirectory(name) ? (
            <Button onClick={() => props.onOpenDirectory(name)} primary>
              {t('FileExplorer.PreviewCard.openDir')}
            </Button>
          ) : (
            <Button onClick={handleLoad} loading={isLoadingFile} primary>
              {t('FileExplorer.PreviewCard.loadFile')}
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
      width: '27vw',
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

        if (baseTxt.trim() === '') {
          return (
            <TextContainer>
              ({t('FileExplorer.PreviewCard.emptyTranslation')})
            </TextContainer>
          );
        }

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
              padding: '1% 1% 1% 1%',
            }}>
            <Stack alignment="fill" vertical>
              <Stack alignment="center" distribution="center" wrap={false}>
                <div style={comparatorFieldStyle}>
                  <TextContainer>
                    {t('FileExplorer.PreviewCard.currentVersion')}
                  </TextContainer>
                </div>
                <p>-</p>
                <div style={comparatorFieldStyle}>
                  <TextContainer>
                    {t('FileExplorer.PreviewCard.selectedVersion')}
                  </TextContainer>
                </div>
              </Stack>
              {tmp.map((x) => {
                return (
                  <div key={x}>
                    <Stack
                      alignment="center"
                      distribution="center"
                      key={x}
                      wrap={false}>
                      <div style={comparatorFieldStyle}>
                        {highlightTxt(
                          old[x].data?.at(-1) || '',
                          current[x].data?.at(-1) || '',
                          'green'
                        )}
                      </div>
                      <p>{x + 1}</p>
                      <div style={comparatorFieldStyle}>
                        {highlightTxt(
                          current[x].data?.at(-1) || '',
                          old[x].data?.at(-1) || '',
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

      return (
        <div style={{ minHeight: '320px' }}>
          <EmptyState
            heading={t(
              'FileExplorer.PreviewCard.noDifferencesEmptyStateHeading'
            )}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            {t('FileExplorer.PreviewCard.noDifferencesEmptyStateText')}
            <div>{versionSelector}</div>
          </EmptyState>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '320px' }}>
        {isDirectory(formatPath(name)) ? (
          <EmptyState
            heading={t('FileExplorer.PreviewCard.previewEmptyStateHeading')}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            {t('FileExplorer.PreviewCard.previewEmptyStateText')}
          </EmptyState>
        ) : (
          <EmptyState
            heading={t('FileExplorer.PreviewCard.compareEmptyStateHeading')}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            {t('FileExplorer.PreviewCard.compareEmptyStateText')}
            <div>{versionSelector}</div>
          </EmptyState>
        )}
      </div>
    );
  }, [name, selectedObject, selectedVersionObject, versionSelector, t]);

  useEffect(() => {
    setSelectedObject(props.content.find((x) => x.id === props.selected));
    setSelectedVersionObject(undefined);
  }, [props.content, props.selected]);

  useEffect(() => {
    setPreviewContent(getContent());
  }, [getContent, selectedObject, selectedVersionObject]);

  return (
    <Card>
      <div>
        {selectedObject ? (
          <>
            {selectedVersionObject != null && (
              <Card.Section
                subdued
                title={t('FileExplorer.PreviewCard.previewEmptyStateHeading')}>
                {headerActions}
              </Card.Section>
            )}
            <Card.Section flush>{previewContent}</Card.Section>
            <Card.Section subdued>{infoWindow}</Card.Section>
          </>
        ) : (
          <EmptyState
            heading={t('FileExplorer.PreviewCard.previewEmptyStateHeading')}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
            {t('FileExplorer.PreviewCard.previewEmptyStateText')}
          </EmptyState>
        )}
      </div>
    </Card>
  );
}
