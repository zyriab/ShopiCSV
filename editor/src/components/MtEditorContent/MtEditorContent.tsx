import React, {
  useState,
  useEffect,
  createRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { RowData } from '../../definitions/custom';
import { usePagination } from '../../utils/hooks/usePagination';
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
  data: RowData[];
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

  // TODO: OPTI: 'data' shallowly changes, making React call this effect a second time on page load
  useEffect(() => {
    if (props.data.length === 0) setPageContent([]);
    if (props.data.length > 0 && !props.isLoading) {
      const fieldNames = [
        'Type',
        'Identification',
        'Field',
        'Locale',
        'Status',
        'Default content',
        'Translated content',
      ];

      const displayPage = async () => {
        setIsReady(false);
        props.setIsLoading(true);

        // if user has gone to another page, save previous page
        if (selectedPage !== previousPageNum.current) props.onSave();

        const content: JSX.Element[] = [];
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
            else if (hasCSSInRow(row)) return 'css';
            return 'none';
          }

          // i.e: (2 x 5) - (5 - [0, 1, 2, 3, 4])
          const index = Math.round(
            selectedPage * maxElementsPerPage - (maxElementsPerPage - (i + 1))
          );

          if (index >= props.data.length) return;

          let row = props.data[index];
          const tmp = [];

          // had a bug once, data.length was 9 with empty indexes :/
          if (row.data.length > 7) row.data = row.data.splice(0, 7);
          if (row.data.length === 7) {
            const language = getLanguage(row.data);
            const hasEditor = language !== 'none';

            for (let x = 0; x < 7; x++) {
              let width =
                !props.display.includes(5) && !props.display.includes(6)
                  ? true
                  : 1;
              if (props.display.length !== 7 && (x === 5 || x === 6)) {
                // code editor does not resize well with xs={true}
                if (hasEditor) {
                  if (
                    (!props.display.includes(5) && props.display.includes(6)) ||
                    (props.display.includes(5) && !props.display.includes(6))
                  ) {
                    // other fields are of size 1 if [5]/[6] is present
                    // Here we substract the number of displayed fields from the number of columns (7)
                    // -1 is because [5]/[6] is not of size 1 and we want to make this calculation
                    // based on the OTHER fields ;)
                    // i.e: 7 col - (3-1) fields = size of 5 (+2 fields of size 1 = 7 columns taken 🤓)
                    width = 7 - (props.display.length - 1);
                  } else {
                    if (props.display.length === 2) width = 3.5;
                    else if (props.display.length === 4) width = 2.5;
                    else if (props.display.length === 6) width = 1.5;
                    else width = Math.ceil(7 / props.display.length);
                  }
                } else width = true;
              }

              if (props.display.includes(x)) {
                props.renderedFields.current.push(createRef<MtFieldElement>());

                const key = `${row.id}-${x}`;
                const isCode = (x === 5 || x === 6) && hasEditor;
                const fieldRef: React.RefObject<MtFieldElement> =
                  props.renderedFields.current[
                    props.renderedFields.current.length - 1
                  ];

                tmp.push(
                  <Grid key={`grid-${x}`} xs={width} alignItems="stretch" item>
                    <MtEditorField
                      ref={fieldRef}
                      key={key}
                      kid={key}
                      code={isCode}
                      language={language}
                      label={fieldNames[x]}
                      fullWidth={width === true}
                      value={row.data[x]}
                    />
                  </Grid>
                );

                // setTimeout here is because there is a small latency before the ref is set
                setTimeout(() => {
                  if (fieldRef.current && !fieldRef.current?.isCode()) {
                    const el =
                      fieldRef.current?.getElement() as HTMLInputElement;
                    el.style.height = '100%';
                    (el.children[1] as HTMLInputElement).style.height = '100%';
                  }
                }, 0);
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
          <Layout.Section fullWidth>{pageContent}</Layout.Section>
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
