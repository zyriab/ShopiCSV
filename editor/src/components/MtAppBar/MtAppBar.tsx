import React, { useRef, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import themeContext from '../../utils/contexts/theme.context';
import { RowData, TranslatableResourceType } from '../../definitions/custom';
import { formatDistanceToNow } from 'date-fns';
import formatBytes from '../../utils/tools/formatBytes.utils';
import getDateLocale from '../../utils/tools/getDateLocale.utils';
import store from 'store2';
import {
  Loading,
  Button,
  ButtonGroup,
  Tooltip,
  TextStyle,
  Stack,
  CustomProperties,
} from '@shopify/polaris';
import {
  ExportMinor,
  ImportMinor,
  SaveMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { MtSearchField } from '../MtSearchField/MtSearchField';
import { MtFieldsFilter } from '../MtFieldsFilter/MtFieldsFilter';
import MtColumnSelector from '../MtColumnSelector/MtColumnSelector';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';

interface MtAppBarProps {
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

export default function MtAppBar(props: MtAppBarProps) {
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

  const { t } = useTranslation();
  const { themeStr } = useContext(themeContext);
  const { isDesktop } = useDetectScreenSize();

  function handleDisplayFields(fields: number[]) {
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
      saveDisplayInterval == null &&
      props.isEditing &&
      store.get('fileData').savedAt != null
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

  return props.data.length > 0 ? (
    <div
      style={{
        backgroundColor: 'var(--p-surface)',
        width: '100%',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}>
      <Stack alignment="center" distribution="center" wrap>
        <Stack.Item>
          <div />
        </Stack.Item>
        <Stack vertical>
          <Stack.Item fill>
            <MtSearchField
              data={props.data}
              filteredDataIds={props.filteredDataIds}
              numOfDisplayedFields={props.numOfDisplayedFields}
            />
          </Stack.Item>
          <Stack distribution="center" alignment="center">
            <Stack.Item fill>
              <MtFieldsFilter
                availableFilters={availableFilters}
                filteredDataTypes={props.filteredDataTypes}
              />
            </Stack.Item>
            <div />
            <MtColumnSelector
              choices={props.data[0].data}
              onChange={handleDisplayFields}
            />
          </Stack>
        </Stack>
        {store.get('fileData') && props.isEditing && (
          <Stack.Item fill={isDesktop}>
            <div style={{ marginLeft: '10px ' }}>
              <Stack vertical={!isDesktop}>
                <Stack vertical spacing="extraTight">
                  <CustomProperties
                    colorScheme={themeStr}
                    style={{
                      width: '35ch',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                    <Tooltip content={store.get('fileData').name}>
                      <TextStyle variation="strong">
                        {store.get('fileData').name}
                      </TextStyle>
                    </Tooltip>
                  </CustomProperties>
                  <TextStyle variation="subdued">
                    {`${formatBytes(store.get('fileData').size, 2)} | ${t(
                      'AppBar.rows'
                    )} ${
                      store
                        .get('fileData')
                        .content.filter((e: RowData) => e.data.length >= 7)
                        .length - 1
                    }`}
                  </TextStyle>
                </Stack>
                <Stack vertical spacing="extraTight">
                  <TextStyle variation="subdued">
                    {t('AppBar.lastModifDate', {
                      date: formatDistanceToNow(
                        new Date(store.get('fileData').lastModified),
                        { locale: getDateLocale() }
                      ),
                    })}
                  </TextStyle>
                  {saveTime != null && (
                    <TextStyle variation="subdued">
                      {t('AppBar.lastSaveDate', {
                        date: formatDistanceToNow(saveTime, {
                          locale: getDateLocale(),
                        }),
                      })}
                    </TextStyle>
                  )}
                </Stack>
              </Stack>
            </div>
          </Stack.Item>
        )}
        <ButtonGroup>
          <Tooltip content={t('AppBar.closeTooltip')}>
            <Button
              plain
              icon={DeleteMinor}
              disabled={props.isLoading}
              onClick={() => props.onClose(true)}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.uploadTooltip')}>
            <Button
              plain
              icon={ExportMinor}
              disabled={props.isLoading}
              onClick={() => inputEl.current?.click()}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.saveTooltip')}>
            <Button
              plain
              icon={SaveMinor}
              disabled={props.isLoading}
              onClick={handleSave}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.downloadTooltip')}>
            <Button
              plain
              icon={ImportMinor}
              disabled={props.isLoading || !props.isEditing}
              onClick={props.onDownload}></Button>
          </Tooltip>
        </ButtonGroup>
        <input
          ref={inputEl}
          onChange={props.onUpload}
          type="file"
          accept="text/csv"
          className="display-none"
          title="file upload"
        />
      </Stack>
      {props.isLoading && <Loading />}
    </div>
  ) : (
    <div />
  );
}
