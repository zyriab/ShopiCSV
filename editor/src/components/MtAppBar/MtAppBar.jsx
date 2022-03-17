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
  const [saveTime, setSaveTime] = useState(
    new Date(store.get('fileData')?.savedAt || null)
  );
  const inputEl = useRef(null);
  const [saveDisplayInterval, setSaveDisplayInterval] = useState(null);

  function handleDisplayFields(event, fields) {
    if (fields.length < displayFields.length) onSave();
    setDisplayFields(fields);
    onDisplayChange(fields);
  }

  function handleSave() {
    const hasSaved = onSave(true);
    if (hasSaved) {
      if (saveDisplayInterval !== null) {
        clearInterval(saveDisplayInterval);
        setSaveDisplayInterval(null);
      }
      setSaveTime(new Date());
    }
  }

  useEffect(() => {
    if (saveDisplayInterval === null) {
      setSaveDisplayInterval(
        setInterval(() => {
          setSaveTime(new Date(store.get('fileData').savedAt));
        }, 60000)
      );
    }
  }, [saveDisplayInterval]);

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
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid xs={5} sx={{ width: '100%' }} item>
            <MtSearchField data={data} filteredDataIds={filteredDataIds} />
          </Grid>
          {store.get('fileData') ? (
            <Grid xs={5} alignItems="center" container item spacing={1}>
              <Grid item>
                <Stack>
                  {store.get('fileData') && (
                    <Typography
                      sx={{
                        width: '35ch',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      variant="subtitle2"
                      component="p">
                      {store.get('fileData').name}
                    </Typography>
                  )}
                  <Typography variant="subtitle2" component="p">
                    {`${formatBytes(store.get('fileData').size, 2)} | Rows: ${
                      store
                        .get('fileData')
                        .content.filter((e) => e.data.length === 7).length - 1
                    }`}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack>
                  {/* TODO: Work on i18n of dates (ago -> il y a) */}
                  <Typography variant="subtitle1" component="p">
                    {`Last modified: ${formatDistanceToNow(
                      new Date(store.get('fileData').lastModified)
                    )} ago`}
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {`Last saved: ${formatDistanceToNow(saveTime)} ago`}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Grid xs={4} item />
          )}
          <Grid xs={'auto'} item>
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
            <IconButton disabled={isLoading || !isEditing} onClick={handleSave}>
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
          <ToggleButton value={0} aria-label="Type">
            Type
          </ToggleButton>
          <ToggleButton
            value={1}
            aria-label="Identification">
            Identification
          </ToggleButton>
          <ToggleButton value={2} aria-label="Field">
            Field
          </ToggleButton>
          <ToggleButton
            value={3}
            aria-label="Locale">
            Locale
          </ToggleButton>
          <ToggleButton value={4} aria-label="Status">
            Status
          </ToggleButton>
          <ToggleButton
            value={5}
            aria-label="Default content">
            Default content
          </ToggleButton>
          <ToggleButton
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
