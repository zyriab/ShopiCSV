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
  QuestionMarkMinor,
} from '@shopify/polaris-icons';
import { MtSearchField } from '../MtSearchField/MtSearchField';
import MtFieldsFilter from '../MtFieldsFilter/MtFieldsFilter';
import MtColumnSelector from '../MtColumnSelector/MtColumnSelector';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';

interface MtAppBarProps {
  onDownload: () => void;
  onSave: (displayMsg?: boolean, isAutosave?: boolean) => Promise<boolean>;
  onUpload: (file: File) => Promise<void>;
  onClose: (deleteFile?: boolean) => Promise<void>;
  onShowOutdated: (show: boolean) => void;
  onResetTutorial: () => void;
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
  const [isWidthUnder1559px, setIsWidthUnder1559px] = useState(
    matchMedia('(max-width: 1559px)').matches
  );

  const inputEl = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  const { t } = useTranslation();
  const { themeStr } = useContext(themeContext);
  const { isDesktop } = useDetectScreenSize();

  async function handleDisplayFields(fields: number[]) {
    if (fields.length < displayFields.length) {
      await props.onSave();
    }
    setDisplayFields(fields);
    props.onDisplayChange(fields);
  }

  async function handleSave() {
    const hasSaved = await props.onSave(true);

    if (hasSaved) {
      if (saveDisplayInterval !== null) {
        clearInterval(saveDisplayInterval);
        setSaveDisplayInterval(null);
      }

      setSaveTime(new Date());
    }
  }

  function onResize() {
    setIsWidthUnder1559px(matchMedia('(max-width: 1559px)').matches);
  }

  useEffect(() => {
    isMounted.current = true;
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      isMounted.current &&
      saveDisplayInterval == null &&
      props.isEditing &&
      store.get('fileData')?.savedAt != null
    ) {
      setSaveDisplayInterval(
        setInterval(() => {
          setSaveTime(new Date(store.get('fileData')?.savedAt));
        }, 60000)
      );
    }
  }, [saveDisplayInterval, props.isEditing]);

  useEffect(() => {
    if (isMounted.current) {
      setDisplayFields(props.display);
    }
  }, [props.display]);

  useEffect(() => {
    if (isMounted.current && props.data)
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
        paddingLeft: '2rem',
      }}>
      <Stack alignment="center" distribution="center" wrap>
        <Stack.Item fill>
          <Stack
            // N.B.: matchMedia is not being called again on window resize
            vertical={!isDesktop || isWidthUnder1559px}>
            <Stack.Item>
              <MtSearchField
                data={props.data}
                filteredDataIds={props.filteredDataIds}
                numOfDisplayedFields={props.numOfDisplayedFields}
              />
            </Stack.Item>
            <Stack.Item>
              <Stack alignment="center">
                <Stack vertical>
                  <MtFieldsFilter
                    availableFilters={availableFilters}
                    filteredDataTypes={props.filteredDataTypes}
                    onShowOutdated={props.onShowOutdated}
                  />
                </Stack>
                <MtColumnSelector
                  choices={props.data[0].data}
                  onChange={handleDisplayFields}
                />
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        {store.get('fileData') && props.isEditing && (
          <Stack.Item fill={isDesktop}>
            <div style={{ marginRight: '10px ' }}>
              <Stack vertical={!isDesktop} distribution="trailing">
                <Stack vertical spacing="extraTight">
                  <CustomProperties
                    colorScheme={themeStr}
                    className="use-ellipsis"
                    style={{
                      width: '35ch',
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
                  {saveTime > new Date('1/1/1971') && (
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
              disabled={props.isLoading || process.env.REACT_APP_ENV === 'demo'}
              onClick={() => inputEl.current?.click()}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.saveTooltip')}>
            <Button
              plain
              icon={SaveMinor}
              disabled={props.isLoading}
              onClick={async () => await handleSave()}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.downloadTooltip')}>
            <Button
              plain
              icon={ImportMinor}
              disabled={props.isLoading || !props.isEditing}
              onClick={props.onDownload}></Button>
          </Tooltip>
          <Tooltip content={t('AppBar.tutorialHowToTooltip')}>
            <Button
              plain
              icon={QuestionMarkMinor}
              onClick={props.onResetTutorial}></Button>
          </Tooltip>
        </ButtonGroup>
        <input
          ref={inputEl}
          onChange={async (e) =>
            e?.target.files
              ? await props.onUpload(e.target.files[0])
              : undefined
          }
          type="file"
          accept="text/csv"
          className="display-none"
          title="App bar file upload"
        />
      </Stack>
      {props.isLoading && <Loading />}
    </div>
  ) : (
    <div />
  );
}
