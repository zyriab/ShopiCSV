import React, {
  useState,
  useEffect,
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

  /* Page's content setup */
  useEffect(() => {
    if (props.data.length === 0) {
      return setPageContent([]);
    }

    if (!props.isLoading && props.headerContent != null) {
      const displayPage = async () => {
        setIsReady(false);
        props.setIsLoading(true);

        // if user has gone to another page, save previous page
        if (selectedPage !== previousPageNum.current) props.onSave();

        const content: React.ReactNode[] = [];
        props.renderedFields.current = [];

        function setRow(i: number) {
          function hasHTMLInRow(row: string[]) {
            const regex =
              /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE|a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\\2>/;
            return (
              regex.test(row[5]) ||
              regex.test(row[6]) ||
              row[0].includes('SMS_TEMPLATE') ||
              row[2].includes('BODY_HTML')
            );
          }

          function hasCSSInRow(row: string[]) {
            const regex =
              /((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,/()\-!%]+;?)*)*\s*}(?:\s*))/gim;
            return regex.test(row[5]) || regex.test(row[6]);
          }

          function getLanguage(row: string[]) {
            if (hasHTMLInRow(row)) return 'liquid';
            if (hasCSSInRow(row)) return 'css';
            return 'none';
          }

          // i.e: (2 x 5) - (5 - [0, 1, 2, 3, 4])
          const index = Math.round(
            selectedPage * maxElementsPerPage - (maxElementsPerPage - (i + 1))
          );

          if (index >= props.data.length) return;

          let row = props.data[index];
          const numOfColumns = props.headerContent!.length;
          const tmp = [];

          // had a bug once, data.length was 9 instead of 7 with empty indexes :/
          if (row.data.length > numOfColumns) {
            row.data = row.data.splice(0, numOfColumns);
          }

          if (row.data.length === numOfColumns) {
            const language = getLanguage(row.data);
            const hasEditor = language !== 'none';

            for (let x = 0; x < numOfColumns; x++) {
              let width = getFieldWidth(
                props.dataType,
                props.display,
                numOfColumns
              );

              if (
                props.dataType === 'Translations' &&
                props.display.length !== numOfColumns &&
                (x === numOfColumns - 2 || x === numOfColumns - 1)
              ) {
                // code editor does not resize well with xs={true}
                if (hasEditor) {
                  if (
                    (!props.display.includes(numOfColumns - 2) &&
                      props.display.includes(numOfColumns - 1)) ||
                    (props.display.includes(numOfColumns - 2) &&
                      !props.display.includes(numOfColumns - 1))
                  ) {
                    // if the 'default content' and/or 'translated content' are present, other fields' width = 1.
                    // here we substract the number of displayed fields from the number of columns (7)
                    // -1 is because [def./trans.] is not of size 1 and we want to make this calculation
                    // based on the OTHER fields, thus removing [def./trans.] from the substraction ;)
                    // i.e.: 3 fields = 2 [others] and 1 [def./trans.] =  7 [cols] - (3 [fields] - 1 [def./trans.])
                    // = size of 5 [for def./trans.] + 2 [others] = 7 columns taken 🤓)
                    width = numOfColumns - (props.display.length - 1);
                  } else {
                    // if the 'default content' and 'translated content' are present, other fields' width = 1.
                    // therefore 'def.' and 'trans.' === (numOfColumns / props.display.length - (1 [other]))
                    // i.e.: (even) 4 fields = 2 others and 2 [def + trans] -> (7 [cols] - 2 [others]) = 5 / 2 [def + trans]
                    // or: (odd) 3 fields = 1 other and 2 [def + trans] -> 8 [cols] / 3 = 2.66
                    // CEIL(2.66) = 3 -> + 0.5 -> * 2 [def. + trans.] = 7 + 1 [other] = 8
                    // if numOfColumns = 7 -> 7 cols / 3 = 2.33 -> CEIL(2.33) = 3 * 2 [def. + trans] = 6 + 1 [other] = 7
                    if (props.display.length % 2 === 0) {
                      width = (numOfColumns - (props.display.length - 2)) / 2;
                    } else {
                      width =
                        Math.ceil(numOfColumns / props.display.length) +
                        (numOfColumns % 2 === 0 ? 0.5 : 0);
                    }
                  }
                } else width = true;
              }

              if (props.display.includes(x)) {
                props.renderedFields.current.push(createRef<MtFieldElement>());

                const key = `${row.id}-${x}`;
                const isCode =
                  (x === numOfColumns - 2 || x === numOfColumns - 1) &&
                  hasEditor;
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
      };
      displayPage();
    }
  }, [
    maxElementsPerPage,
    previousPageNum,
    props,
    selectedPage,
    setPageContent,
  ]);

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
