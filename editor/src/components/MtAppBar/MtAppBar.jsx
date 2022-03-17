import { useRef, useState, useEffect } from 'react';
import { formatBytes } from '../../utils/formatBytes.utils';
import store from 'store';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { MtSearchField } from '../MtSearchField/MtSearchField';

// TODO: APPBAR ->
// 1. add filename ellipsis (+ tooltip when hovering)
// 2. add tooltips on buttons
// 3 align everything good (solo upload button, search bar)
// 4. add filers "SMS_TEMPLATE", "EMAILS", etc
export const MtAppBar = (props) => {
  const {
    onDownload,
    onSave,
    onUpload,
    onCancel,
    isLoading,
    isEditing,
    loadValue = -1,
    display,
    onDisplayChange,
    data,
    filteredDataIds,
    filteredType, // TODO: add toggle filters : all, products, email, sms_template, etc
  } = props;
  const [displayFields, setDisplayFields] = useState(display);
  const inputEl = useRef(null);

  function handleDisplayFields(event, fields) {
    if (fields.length < displayFields.length) onSave();
    setDisplayFields(fields);
    onDisplayChange(fields);
  }

  useEffect(() => {
    setDisplayFields(display);
  }, [display]);

  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      enableColorOnDark
      color="primary"
      position="sticky">
      <Toolbar>
        <Grid container alignItems="center">
          <Grid xs={5} sx={{ width: '100%' }} item>
            <MtSearchField data={data} filteredDataIds={filteredDataIds} />
          </Grid>
          {store.get('fileData') ? (
            <>
              <Grid sx={1.5} item>
                <Stack>
                  {store.get('fileData') && (
                    <Typography
                      sx={{
                        width: '20rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      variant="subtitle1"
                      component="p">
                      {store.get('fileData').name}
                      {store.get('fileData').name}
                      {store.get('fileData').name}
                      {store.get('fileData').name}
                    </Typography>
                  )}
                  <Typography variant="subtitle1" component="p">
                    {`${formatBytes(store.get('fileData').size, 2)} | Rows: ${
                      store
                        .get('fileData')
                        .content.filter((e) => e.data.length === 7).length - 1
                    }`}
                  </Typography>
                </Stack>
              </Grid>
              <Grid sx={1.5} item>
                <Stack>
                  <Typography variant="subtitle1" component="p">
                    {`Last modified: ${formatDistanceToNow(
                      new Date(store.get('fileData').lastModified)
                    )}`}
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {`Last saved: ${formatDistanceToNow(new Date(
                      store.get('fileData').savedAt
                    ))}`}
                  </Typography>
                </Stack>
              </Grid>
            </>
          ) : (
            <>
              <Grid xs={3} item />
              <Grid xs={2.5} item />
            </>
          )}
          <Grid xs={1.5} item>
            <IconButton disabled={isLoading || !isEditing} onClick={onCancel}>
              <DeleteForeverIcon />
            </IconButton>
            <IconButton
              disabled={isLoading}
              onClick={() => inputEl.current.click()}>
              <UploadFileIcon />
            </IconButton>
            <input
              ref={inputEl}
              onChange={onUpload}
              type="file"
              accept="text/csv"
              style={{ display: 'none' }}
            />
            <IconButton
              disabled={isLoading || !isEditing}
              onClick={() => onSave(true)}>
              <SaveIcon />
            </IconButton>
            <IconButton disabled={isLoading || !isEditing} onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar>
        <ToggleButtonGroup
          fullWidth
          size="small"
          value={displayFields}
          onChange={handleDisplayFields}
          aria-label="Fields to display">
          <ToggleButton sx={{ color: 'white' }} value={0} aria-label="Type">
            Type
          </ToggleButton>
          <ToggleButton
            sx={{ color: 'white' }}
            value={1}
            aria-label="Identification">
            Identification
          </ToggleButton>
          <ToggleButton sx={{ color: 'white' }} value={2} aria-label="Field">
            Field
          </ToggleButton>
          <ToggleButton sx={{ color: 'white' }} value={3} aria-label="Locale">
            Locale
          </ToggleButton>
          <ToggleButton sx={{ color: 'white' }} value={4} aria-label="Status">
            Status
          </ToggleButton>
          <ToggleButton
            sx={{ color: 'white' }}
            value={5}
            aria-label="Default content">
            Default content
          </ToggleButton>
          <ToggleButton
            // color="white" // FIXME: not working on light theme, need either to do a custom theme or find a solution bc black font is ugly
            sx={{ color: 'white' }}
            value={6}
            aria-label="Translated content">
            Translated content
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
      {isLoading && (
        <LinearProgress
          variant={+loadValue >= 0 ? 'determinate' : 'indeterminate'}
          value={+loadValue}
        />
      )}
    </AppBar>
  );
};
