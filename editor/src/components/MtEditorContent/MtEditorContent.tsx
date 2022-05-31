import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { RowData, DataType } from '../../definitions/custom';
import { usePagination } from '../../utils/hooks/usePagination';
import getFieldWidth from '../../utils/tools/getFieldWidth.utils';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import { MtRowsDisplayControl } from '../MtRowsDisplayControl/MtRowsDisplayControl';
import { MtSpinner } from '../MtSpinner/MtSpinner';
import { MtBackToTopBtn } from '../MtBackToTopBtn/MtBackToTopBtn';
import { MtEditorField, MtFieldElement } from '../MtEditorField/MtEditorField';
import { MtDropZone } from '../MtDropZone/MtDropZone';
import { Stack, Layout } from '@shopify/polaris';

import './MtEditorContent.css';
import getFilePosition from '../../utils/tools/getFilePosition.utils';
import getEditorLanguage from '../../utils/tools/getEditorLanguage.utils';

interface MtEditorContentProps {
  onSave: (displayMsg?: boolean, isAutosave?: boolean) => boolean;
  onUpload: (files: File[]) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  display: number[];
  dataType: DataType;
  data: RowData[];
  headerContent?: string[];
  renderedFields: React.MutableRefObject<React.RefObject<MtFieldElement>[]>;
}

export type MtEditorContentElement = {
  resetPagination: () => void;
};

const MtEditorContent = forwardRef<
  MtEditorContentElement,
  MtEditorContentProps
>((props: MtEditorContentProps, ref) => {
  const [isReady, setIsReady] = useState(false);

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
  } = usePagination(props.data.length, 'rowsNumber');

  useImperativeHandle(ref, () => ({
    resetPagination,
  }));

  const displayPage = useCallback(async () => {
    setIsReady(false);
    props.setIsLoading(true);

    // FIXME: saving -> sometimes the page fields are already unmounted
    // -> crashes the app (@see https://github.com/Metaoist-Dsgn/ShopiCSV/issues/67)

    // if user has gone to another page, save previous page
    if (selectedPage !== previousPageNum.current) props.onSave();

    const content: React.ReactNode[] = [];
    props.renderedFields.current = [];

    function setRow(i: number) {
      // i.e: (2 x 5) - (5 - [0, 1, 2, 3, 4])
      const index = getFilePosition(selectedPage, maxElementsPerPage, i);

      if (index >= props.data.length) return;

      const row = props.data[index];
      const numOfColumns = props.headerContent!.length;
      const tmp = [];

      // had a bug once, data.length was 9 instead of 7 with empty indexes :/
      if (row.data.length > numOfColumns) {
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
            x,
            hasEditor
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
  }, [displayPage, props.data.length, props.headerContent, props.isLoading, setPageContent]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.isLoading}>
        <MtSpinner />
      </Backdrop>
      <MtBackToTopBtn />
      {pageContent.length > 0 && isReady ? (
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
      ) : (
        <Layout>
          <Layout.Section fullWidth>
            <div className="MtEditorContent-DropZone__Outer-Wrapper">
              <div className="MtEditorContent-DropZone__Inner-Wrapper">
                <MtDropZone onUpload={props.onUpload} dataType="Translations" />
              </div>
            </div>
          </Layout.Section>
        </Layout>
      )}
    </>
  );
});

MtEditorContent.displayName = 'MtEditorContent';

export { MtEditorContent };
