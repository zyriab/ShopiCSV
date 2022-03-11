import { useRef, useState, useEffect } from 'react';
import { formatBytes } from '../../utils/formatBytes.utils';
import store from 'store';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
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
    data
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
      position="sticky">
      <Toolbar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" component="div">
            ShopiCSV 🤠
          </Typography>
          <Typography variant="caption">
            by{' '}
            <a
              style={{ color: 'white' }}
              href="https://metaoist.io/"
              target="_blank"
              rel="noreferrer">
              Metaoist Dsgn
            </a>
          </Typography>
        </Box>
        <MtSearchField data={data} />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }}>
          {store.get('fileData') && (
            <>
              <Typography variant="subtitle1" component="div">
                {store.get('fileData').name}
              </Typography>
              <Typography variant="subtitle1" component="div">
                {`Last modified: ${new Date(
                  store.get('fileData').lastModified
                ).toLocaleString()}`}
              </Typography>
              <Typography variant="subtitle1" component="div">
                {`Last saved: ${new Date(
                  store.get('fileData').savedAt
                ).toLocaleString()}`}
              </Typography>
              <Typography variant="subtitle1" component="div">
                {`${formatBytes(store.get('fileData').size, 2)} | Rows: ${
                  store
                    .get('fileData')
                    .content.filter((e) => e.data.length === 7).length
                }`}
              </Typography>
            </>
          )}
        </Box>
        <Box>
          {isEditing && (
            <IconButton disabled={isLoading} onClick={onCancel}>
              <DeleteForeverIcon />
            </IconButton>
          )}
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
          {isEditing && (
            <IconButton disabled={isLoading} onClick={() => onSave(true)}>
              <SaveIcon />
            </IconButton>
          )}
          {isEditing && (
            <IconButton disabled={isLoading} onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
          )}
        </Box>
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
          <ToggleButton value={1} aria-label="Identification">
            Identification
          </ToggleButton>
          <ToggleButton value={2} aria-label="Field">
            Field
          </ToggleButton>
          <ToggleButton value={3} aria-label="Locale">
            Locale
          </ToggleButton>
          <ToggleButton value={4} aria-label="Status">
            Status
          </ToggleButton>
          <ToggleButton value={5} aria-label="Default content">
            Default content
          </ToggleButton>
          <ToggleButton value={6} aria-label="Translated content">
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
