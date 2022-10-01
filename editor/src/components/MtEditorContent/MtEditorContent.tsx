import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  RowData,
  DataType,
  FileInput,
  BucketObjectInfo,
} from '../../definitions/custom';
import { usePagination } from '../../utils/hooks/usePagination';
import getFieldWidth from '../../utils/tools/getFieldWidth.utils';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import { MtRowsDisplayControl } from '../MtRowsDisplayControl/MtRowsDisplayControl';
import { MtSpinner } from '../MtSpinner/MtSpinner';
import { MtBackToTopBtn } from '../MtBackToTopBtn/MtBackToTopBtn';
import { MtEditorField, MtFieldElement } from '../MtEditorField/MtEditorField';
import useFileExplorer from '../../utils/hooks/useFileExplorer';
// import { MtDropZone } from '../MtDropZone/MtDropZone';
import { Stack, Layout, EmptyState, CalloutCard } from '@shopify/polaris';
import getFilePosition from '../../utils/tools/getFilePosition.utils';
import getEditorLanguage from '../../utils/tools/getEditorLanguage.utils';
import getDataLength from '../../utils/tools/getDataLength.utils';
import getStatusColIndex from '../../utils/tools/getStatusColIndex.utils';
import MtTranslatorTutorial from '../MtTranslatorTutorial/MtTranslatorTutorial';

import './MtEditorContent.css';

interface MtEditorContentProps {
  onSave: (displayMsg?: boolean, isAutosave?: boolean) => Promise<boolean>;
  onFileLoad: (args: {
    file: File;
    path: string;
    versionId?: string;
    token?: string;
  }) => Promise<void>;
  onUpload: (objInfo: BucketObjectInfo, file: File) => Promise<void>;
  onDelete: (args: FileInput) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  showOutdated: boolean;
  isLoading: boolean;
  display: number[];
  dataType: DataType;
  data: RowData[];
  headerContent?: string[];
  renderedFields: React.MutableRefObject<React.RefObject<MtFieldElement>[]>;
  isTutorialOpen: boolean;
  onTutorialClose: () => void;
}

export type MtEditorContentElement = {
  resetPagination: () => void;
};

const MtEditorContent = forwardRef<
  MtEditorContentElement,
  MtEditorContentProps
>((props: MtEditorContentProps, ref) => {
  const [isReady, setIsReady] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  const dataLength = useRef(getDataLength(props.data, props.showOutdated));

  const { t } = useTranslation();

  const {
    FileCard,
    fileCardProps,
    PreviewCard,
    previewCardProps,
    fileUploadEl,
  } = useFileExplorer({
    onUpload: props.onUpload,
    onFileLoad: props.onFileLoad,
    onDelete: props.onDelete,
  });

  const {
    previousPageNum,
    selectedPage,
    resetPagination,
    maxElementsPerPage,
    handleElementsPerPageChange,
    pageContent,
    setPageContent,
    GoToPageField,
    goToPageFieldProps,
    ChangePageButtons,
    changePageButtonsProps,
  } = usePagination(dataLength.current, 'rowsNumber');

  useImperativeHandle(ref, () => ({
    resetPagination,
  }));

  // TODO: work on upload from the file explorer
  // async function handleUpload(objInfo: BucketObjectInfo, file: File) {
  //   await props.onUpload(objInfo, file);
  // }

  const displayPage = useCallback(async () => {
    setIsReady(false);
    props.setIsLoading(true);

    // if user has gone to another page, save previous page
    if (selectedPage !== previousPageNum.current) {
      await props.onSave();
    }

    const content: React.ReactNode[] = [];
    props.renderedFields.current = [];

    function setRow(i: number) {
      // i.e.: (2 x 5) - (5 - [0, 1, 2, 3, 4])
      const index = getFilePosition(selectedPage, maxElementsPerPage, i);

      if (index >= props.data.length) {
        return;
      }

      const row = props.data[index];
      const numOfColumns = props.headerContent!.length;
      const tmp = [];

      if (
        props.showOutdated &&
        row.data[getStatusColIndex(props.data[0].data)] !== 'outdated'
      ) {
        return [];
      }

      if (row.data.length > numOfColumns) {
        // had a bug once, data.length was 9 instead of 7 with empty indexes :/
        row.data = row.data.splice(0, numOfColumns);
      }

      if (row.data.length === numOfColumns) {
        const language = getEditorLanguage(row.data);
        const hasEditor = language !== 'none';

        for (let x = 0; x < numOfColumns; x++) {
          const width = getFieldWidth(
            props.dataType,
            props.display,
            numOfColumns,
            x
          );

          if (props.display.includes(x)) {
            props.renderedFields.current.push(createRef<MtFieldElement>());

            const key = `${row.id}-${x}`;
            const isCode =
              hasEditor && (x === numOfColumns - 2 || x === numOfColumns - 1);
            const fieldRef: React.RefObject<MtFieldElement> =
              props.renderedFields.current.at(-1)!;

            tmp.push(
              <Grid key={`grid-${x}`} xs={width} alignItems="stretch" item>
                <MtEditorField
                  ref={fieldRef}
                  key={key}
                  kid={key}
                  code={isCode}
                  language={language}
                  label={props.headerContent![x]}
                  fullWidth={true}
                  value={row.data[x]}
                />
              </Grid>
            );

            if (fieldRef.current && !fieldRef.current?.isCode()) {
              const el = fieldRef.current?.getElement() as HTMLInputElement;
              el.style.height = '100%';
              (el.children[1] as HTMLInputElement).style.height = '100%';
            }
          }
        }
      }
      return tmp;
    }

    for (let i = 0; i < maxElementsPerPage; i++) {
      content.push(
        <Grid
          key={i}
          container
          item
          direction="row"
          justifyContent="center"
          columns={props.headerContent?.length || 0}
          spacing={1}>
          {setRow(i)}
        </Grid>
      );
    }

    setPageContent(content);
    props.setIsLoading(false);
    setIsReady(true);
  }, [
    maxElementsPerPage,
    previousPageNum,
    props,
    selectedPage,
    setPageContent,
  ]);

  /* Page's content setup */
  useEffect(() => {
    if (props.data.length === 0) {
      return setPageContent([]);
    }

    if (!props.isLoading && props.headerContent != null) {
      displayPage();
    }
  }, [
    displayPage,
    props.data.length,
    props.headerContent,
    props.isLoading,
    setPageContent,
  ]);

  useEffect(() => {
    dataLength.current = getDataLength(props.data, props.showOutdated);
  }, [props.data, props.showOutdated]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.isLoading}>
        {' '}
        {/* TODO: only show backdrop on certain type of loads? */}
        <MtSpinner />
      </Backdrop>
      <MtBackToTopBtn />
      {/* File Editor */}
      {pageContent.length > 0 && isReady ? (
        <>
          <MtTranslatorTutorial
            isOpen={props.isTutorialOpen}
            onClose={props.onTutorialClose}
          />
          <Layout sectioned>
            <Layout.Section fullWidth>
              <Grid
                container
                columns={props.headerContent?.length || 0}
                direction="column"
                justifyContent="flext-start"
                spacing={1}>
                {pageContent}
              </Grid>
              {props.renderedFields.current.length === 0 && (
                <EmptyState
                  heading={t('EditorContent.noFieldsEmptyStateHeading')}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
                  {t('EditorContent.noFieldsEmptyStateText')}
                </EmptyState>
              )}
            </Layout.Section>
            <Layout.Section secondary fullWidth>
              <Stack distribution="fill" alignment="center">
                <MtRowsDisplayControl
                  maxRowDisplay={maxElementsPerPage}
                  handleRowsDisplayChange={handleElementsPerPageChange}
                />
                <Stack distribution="trailing" alignment="center">
                  <GoToPageField {...goToPageFieldProps} />
                  <ChangePageButtons {...changePageButtonsProps} />
                </Stack>
              </Stack>
            </Layout.Section>
          </Layout>
        </>
      ) : (
        // File explorer (Buckaroo)
        <Layout>
          {fileUploadEl}
          <Layout.Section fullWidth>
            {isWelcomeOpen && (
              <CalloutCard
                title={t('EditorContent.tutoCardTitle')}
                illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                primaryAction={{
                  content: t('EditorContent.tutoCardAction'),
                  onAction: () => setIsWelcomeOpen(false),
                }}
                onDismiss={() => setIsWelcomeOpen(false)}>
                <p>{t('EditorContent.tutoCardP1')}</p>
                <p>{t('EditorContent.tutoCardP2')}</p>
              </CalloutCard>
            )}
          </Layout.Section>
          <Layout.Section secondary>
            <FileCard {...fileCardProps} />
          </Layout.Section>
          <Layout.Section>
            <PreviewCard {...previewCardProps} />
          </Layout.Section>

          <div className="MtEditorContent-DropZone__Outer-Wrapper">
            {/* TODO: replace by file explorer drop zone */}
            {/* Wrappers are for dynamic sizing */}
            {/*  <div className="MtEditorContent-DropZone__Inner-Wrapper">
                  <MtDropZone onUpload={handleUpload} dataType="Translations" />
                </div>*/}
          </div>
        </Layout>
      )}
    </>
  );
});

MtEditorContent.displayName = 'MtEditorContent';

export { MtEditorContent };
