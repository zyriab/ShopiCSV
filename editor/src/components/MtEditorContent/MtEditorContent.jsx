import React, { useState, useEffect, createRef } from 'react';
import { usePagination } from '../../utils/usePagination';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import { MtRowsDisplayControl } from '../MtRowsDisplayControl/MtRowsDisplayControl';
import { MtSpinner } from '../MtSpinner/MtSpinner';
import { MtDropZone } from '../MtDropZone/MtDropZone';
import { MtBackToTopBtn } from '../MtBackToTopBtn/MtBackToTopBtn';
import { MtEditorField } from '../MtEditorField/MtEditorField';

// TODO: display the current fields page when changing rows display num
// TODO: Reset to page 1 when uploading new file
export function MtEditorContent(props) {
  const {
    display,
    renderedFields,
    onSave,
    data,
    onUpload,
    isLoading,
    setIsLoading,
  } = props;
  const [isReady, setIsReady] = useState(false);

  const {
    previousPageNum,
    selectedPage,
    maxElementsPerPage,
    handleElementsPerPageChange,
    pageContent,
    setPageContent,
    GoToPageField,
    goToPageFieldProps,
    ChangePageButtons,
    changePageButtonsProps,
  } = usePagination(data.length, 'rowsNumber');

  // TODO: OPTI: 'data' shallowly changes, making React call this effect a second time on page load
  useEffect(() => {
    if (data.length === 0) setPageContent([]);
    if (data.length > 0 && !isLoading) {
      const fieldNames = [
        'Type',
        'Identification',
        'Field',
        'Locale',
        'Status',
        'Default content',
        'Translated content',
      ];

      setIsLoading(true);
      setIsReady(false);
      function displayPage() {
        // if user has gone to another page, save previous page
        if (selectedPage !== previousPageNum.current) onSave();

        const content = [];
        renderedFields.current = [];

        function setRow(i) {
          function hasHTMLInRow(row) {
            return (
              new RegExp(
                '<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\\/\\2>'
              ).test(row?.data[5]) ||
              new RegExp(
                '<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\\/\\2>'
              ).test(row?.data[6]) ||
              row?.data[0].includes('SMS_TEMPLATE') ||
              row?.data[2].includes('BODY_HTML') ||
              false
            );
          }

          function getNumOfLines(str) {
            if (str && typeof str === 'string') {
              return (str.match(/\n/g) || '').length + 1;
            }
          }

          // i.e: (2 x 5) - (5 - [0, 1, 2, 3, 4])
          const index = Math.round(
            selectedPage * maxElementsPerPage - (maxElementsPerPage - (i + 1))
          );

          if (index >= data.length) return;

          const row = data[index];
          const tmp = [];

          // had a bug once, data.length was 9 with empty indexes :/
          if (row?.data.length > 7) row.data = row.data.splice(0, 7);

          if (row?.data.length === 7) {
            const hasEditor = hasHTMLInRow(row);

            for (let x = 0; x < 7; x++) {
              let width =
                !display.includes(5) && !display.includes(6) ? true : 1;
              if (display.length !== 7 && (x === 5 || x === 6)) {
                // code editor does not resize well with xs={true}
                if (hasEditor) {
                  if (
                    (!display.includes(5) && display.includes(6)) ||
                    (display.includes(5) && !display.includes(6))
                  ) {
                    // other fields are of size 1 if [5]/[6] is present
                    // Here we substract the number of displayed fields from the number of columns (7)
                    // -1 is because [5]/[6] is not of size 1 and we want to make this calculation
                    // based on the OTHER fields ;)
                    // i.e: 7 col - (3-1) fields = size of 5 (+2 fields of size 1 = 7 columns taken 🤓)
                    width = 7 - (display.length - 1);
                  } else {
                    if (display.length === 2) width = 3.5;
                    else if (display.length === 4) width = 2.5;
                    else if (display.length === 6) width = 1.5;
                    else width = Math.ceil(7 / display.length);
                  }
                } else width = true;
              }

              if (display.includes(x)) {
                renderedFields.current.push(createRef());
                const key = `${index}-${x}`;
                const isCode = (x === 5 || x === 6) && hasEditor;
                const isMultiline =
                  ((x === 5 || x === 6) &&
                    (getNumOfLines(row.data[5]) > 1 ||
                      getNumOfLines(row.data[6]) > 1)) ||
                  getNumOfLines(row.data[x]) > 1;
                const fieldRef =
                  renderedFields.current[renderedFields.current.length - 1];

                tmp.push(
                  <Grid key={`grid-${x}`} xs={width} item>
                    <MtEditorField
                      ref={fieldRef}
                      key={key}
                      kid={key}
                      code={isCode}
                      multiline={isMultiline}
                      label={fieldNames[x]}
                      fullWidth={width === true}
                      value={row.data[x]}
                    />
                  </Grid>
                );
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
        setIsLoading(false);
        setIsReady(true);
      }
      displayPage();
    }
  }, [
    maxElementsPerPage,
    selectedPage,
    display,
    renderedFields,
    isLoading,
    setIsLoading,
    setPageContent,
    onSave,
    previousPageNum,
    data,
  ]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}>
        <MtSpinner />
      </Backdrop>
      <MtBackToTopBtn />

      {pageContent.length > 0 && isReady ? (
        <Grid
          sx={{
            marginTop: '1rem',
            marginBottom: '.5rem',
            paddingLeft: '.5rem',
            paddingRight: '.5rem',
          }}
          columns={7}
          container
          direction="column"
          justifyContent="flext-start"
          spacing={1}>
          {pageContent}
          <Grid
            xs
            sx={{ paddingTop: '1ch' }}
            container
            item
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <MtRowsDisplayControl
                maxRowDisplay={maxElementsPerPage}
                handleRowsDisplayChange={handleElementsPerPageChange}
              />
            </Grid>
            <Grid sm={1} lg item />
            <Grid xs item container direction="row" justifyContent="flex-end">
              <Grid xs={1.5} item>
                <GoToPageField {...goToPageFieldProps} />
              </Grid>
              <Grid xs={4} item sx={{paddingTop: '1rem'}}>
                <ChangePageButtons {...changePageButtonsProps} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          sx={{
            hreight: '250px',
            marginTop: '1rem',
            paddingLeft: '.5rem',
            paddingRight: '.5rem',
          }}
          justifyContent="center"
          alignItems="stretch">
          <Grid xs={6} sx={{ marginTop: '15vh' }} item>
            <MtDropZone
              text="Drag and drop your CSV file or click"
              acceptedFiles="text/csv"
              onChange={onUpload}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
