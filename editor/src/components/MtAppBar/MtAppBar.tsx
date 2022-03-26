import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RowData,
  TranslatableResourceType,
} from '../../definitions/definitions';
import { formatBytes } from '../../utils/formatBytes.utils';
import store from 'store2';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
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
import Tooltip from '@mui/material/Tooltip';
import { MtSearchField } from '../MtSearchField/MtSearchField';
import { MtFieldsFilter } from '../MtFieldsFilter/MtFieldsFilter';

interface AppProps {
  onDownload: () => void;
  onSave: (displayMsg?: boolean, isAutosave?: boolean) => boolean;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement> | { target: DataTransfer }
  ) => Promise<void>;
  onClose: (deleteFile?: boolean) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  loadValue?: number;
  display: number[];
  onDisplayChange: (selectedColumns: number[]) => void;
  data: RowData[];
  numOfDisplayedFields: number;
  filteredDataIds: (n: number[]) => void;
  filteredDataTypes: (t: TranslatableResourceType[]) => void;
}

export const MtAppBar = (props: AppProps) => {
  const [displayFields, setDisplayFields] = useState(props.display);
  const [availableFilters, setAvailableFilters] = useState<
    TranslatableResourceType[]
  >([]);
  const [saveTime, setSaveTime] = useState(
    new Date(store.get('fileData')?.savedAt || null)
  );
  const [saveDisplayInterval, setSaveDisplayInterval] =
    useState<NodeJS.Timer | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const fileNameEl = useRef<HTMLParagraphElement>(null);
  const { t } = useTranslation();

  function handleDisplayFields(
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    fields: number[]
  ) {
    if (fields.length < displayFields.length) props.onSave();
    setDisplayFields(fields);
    props.onDisplayChange(fields);
  }

  function handleSave() {
    const hasSaved = props.onSave(true);
    if (hasSaved) {
      if (saveDisplayInterval !== null) {
        clearInterval(saveDisplayInterval);
        setSaveDisplayInterval(null);
      }
      setSaveTime(new Date());
    }
  }

  useEffect(() => {
    if (
      saveDisplayInterval === null &&
      props.isEditing &&
      store.get('fileData').savedAt
    ) {
      setSaveDisplayInterval(
        setInterval(() => {
          setSaveTime(new Date(store.get('fileData').savedAt));
        }, 60000)
      );
    }
  }, [saveDisplayInterval, props.isEditing]);

  useEffect(() => {
    setDisplayFields(props.display);
  }, [props.display]);

  useEffect(() => {
    if (props.data)
      setAvailableFilters([
        ...new Set(
          props.data.map((e) => e.data[0] as TranslatableResourceType)
        ),
      ] as TranslatableResourceType[]);
  }, [props.data]);

  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      enableColorOnDark
      color="primary"
      position="sticky">
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid xs={5} sx={{ width: '100%' }} item>
            <Stack spacing={1}>
              <MtSearchField
                data={props.data}
                filteredDataIds={props.filteredDataIds}
                numOfDisplayedFields={props.numOfDisplayedFields}
              />
              {props.data && (
                <Box sx={{ marginLeft: '4%' }}>
                  <MtFieldsFilter
                    availableFilters={availableFilters}
                    filteredDataTypes={props.filteredDataTypes}
                  />
                </Box>
              )}
            </Stack>
          </Grid>
          {store.get('fileData') && props.isEditing ? (
            <Grid
              xs={5}
              alignItems="center"
              justifyContent="space-evenly"
              container
              item>
              <Grid item>
                <Stack>
                  {store.get('fileData') && (
                    <Tooltip title={store.get('fileData').name}>
                      <Typography
                        ref={fileNameEl}
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
                    </Tooltip>
                  )}
                  <Typography variant="subtitle2" component="p">
                    {`${formatBytes(store.get('fileData').size, 2)} | Rows: ${
                      store
                        .get('fileData')
                        .content.filter((e: RowData) => e.data.length === 7)
                        .length - 1
                    }`}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack>
                  <Typography variant="subtitle1" component="p">
                    {t('AppBar.lastModifDate', {
                      date: formatDistanceToNow(
                        new Date(store.get('fileData').lastModified) // TODO: add date-fns localization
                      ),
                    })}
                  </Typography>
                  <Typography variant="subtitle1" component="p">
                    {t('AppBar.lastSaveDate', {
                      date: formatDistanceToNow(saveTime), //// TODO: add date-fns localization
                    })}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Grid xs={4} item />
          )}
          <Grid xs={'auto'} item>
            <Tooltip title={t('AppBar.closeToolTip')}>
              <span>
                <IconButton
                  sx={{ color: 'white' }}
                  disabled={props.isLoading || !props.isEditing}
                  onClick={() => props.onClose(true)}>
                  <DeleteForeverIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('AppBar.uploadToolTip')}>
              <span>
                <IconButton
                  sx={{ color: 'white' }}
                  disabled={props.isLoading}
                  onClick={() => inputEl.current?.click()}>
                  <UploadFileIcon />
                </IconButton>
              </span>
            </Tooltip>
            <input
              ref={inputEl}
              onChange={props.onUpload}
              type="file"
              accept="text/csv"
              style={{ display: 'none' }}
            />
            <Tooltip title={t('AppBar.saveToolTip')}>
              <span>
                <IconButton
                  sx={{ color: 'white' }}
                  disabled={props.isLoading || !props.isEditing}
                  onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('AppBar.downloadToolTip')}>
              <span>
                <IconButton
                  sx={{ color: 'white' }}
                  disabled={props.isLoading || !props.isEditing}
                  onClick={props.onDownload}>
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar>
        <ToggleButtonGroup
          fullWidth
          size="small"
          value={displayFields}
          onChange={handleDisplayFields}
          aria-label={t('AppBar.ariaToggleGroup')}>
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
      {props.isLoading && (
        <LinearProgress
          variant={props.loadValue ? 'determinate' : 'indeterminate'}
          value={props.loadValue}
        />
      )}
    </AppBar>
  );
};
