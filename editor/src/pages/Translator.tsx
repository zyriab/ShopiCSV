import React, { useState, useRef, useEffect, useCallback } from 'react';
import store from 'store2';
import Papa from 'papaparse';
import getDataType from '../utils/tools/getDataType.utils';
import saveOnline from '../utils/tools/buckaroo/saveOnline.utils';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import { MtAlert, MtAlertElement } from '../components/MtAlert/MtAlert';
import MtAppBar from '../components/MtAppBar/MtAppBar';
import {
  MtEditorContent,
  MtEditorContentElement,
} from '../components/MtEditorContent/MtEditorContent';
import { MtFieldElement } from '../components/MtEditorField/MtEditorField';
import { Page } from '@shopify/polaris';
import {
  RowData,
  BucketObjectInfo,
  TranslatableResourceType,
} from '../definitions/custom';
import saveFileLocally from '../utils/tools/demo/saveFileLocally.utils';
import getUpdatedParsedData from '../utils/tools/getUpdatedParsedData.utils';
import rowDataToString from '../utils/tools/buckaroo/rowDataToString';

export default function Translator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null); // uploaded file or data of restored session (name, size, lastModified, lastSave?, content?)
  const fileRef = useRef<File | null>(null); // used for direct update/access when saving
  const [displayCol, setDisplayCol] = useState<number[]>([2, 6, 7]);
  const [fileData, setFileData] = useState<RowData[]>([]);
  const [displayedData, setDisplayedData] = useState<RowData[]>([]); // used for rendering content
  const [filteredDataIds, setFilteredDataIds] = useState<number[]>([]);
  const [filteredDataTypes, setFilteredTypes] = useState<
    TranslatableResourceType[]
  >([]);
  const [numOfDisplayedFields, setNumOfDisplayedFields] = useState(0);
  const [displayOutdated, setDisplayOutdated] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(
    JSON.parse(store.get('openTutorial') || false) ?? true
  );

  const bucketObjectInfo = useRef<BucketObjectInfo>({
    fileName: '',
    path: '',
    versionId: undefined,
  });
  const parsedData = useRef<RowData[]>([]); // stores the file's content, used for data manipulation (saving, downloading, etc)
  const renderedFields = useRef<React.RefObject<MtFieldElement>[]>([]);
  const alertEl = useRef<MtAlertElement>(null!);
  const errorEl = useRef<MtAlertElement>(null!);
  const contentRef = useRef<MtEditorContentElement>(null!);

  const confirmationDialog = useConfirm();
  const { t } = useTranslation();

  function displayAlert(message: string, isError: boolean = false) {
    if (isError) return errorEl.current.show({ message, isError });
    alertEl.current?.show({ message });
  }

  const hasEdited = useCallback((): [boolean, string[]] => {
    let hasEdit = false;
    const editedFieldsKid: string[] = [];
    for (let field of renderedFields.current) {
      if (field.current) {
        const kid = field.current.getKid();
        const tmpKid = kid.split('-');
        const fieldVal = field.current.getValue();
        const savedVal =
          parsedData.current[parseFloat(tmpKid[0])].data[parseFloat(tmpKid[1])];
        if (fieldVal !== savedVal) {
          editedFieldsKid.push(kid);
          hasEdit = true;
        }
      }
    }
    return [hasEdit, editedFieldsKid];
  }, []);

  async function handleCloseFile(deleteFile = false) {
    try {
      if (!isEditing) return;

      let isDeleting = false;
      setIsLoading(true);
      if (deleteFile) {
        try {
          await confirmationDialog({
            allowClose: true,
            title: t('DeleteObjectDialog.title'),
            description: t('DeleteObjectDialog.description'),
            confirmationText: t('DeleteObjectDialog.yes'),
            cancellationText: t('DeleteObjectDialog.no'),
            confirmationButtonProps: {
              color: 'error',
              disableElevation: true,
              variant: 'contained',
            },
            cancellationButtonProps: {
              disableElevation: true,
              variant: 'contained',
            },
          });
          isDeleting = true;
        } catch {
          isDeleting = false;
        }
      }

      contentRef.current.resetPagination();
      parsedData.current = [];
      fileRef.current = null;
      setFile(null);
      setFileData([]);
      setDisplayedData([]);

      if (isDeleting) {
        store.remove('fileData');
      }

      setIsEditing(false);
      setIsLoading(false);
    } catch (e) {
      setIsEditing(false);
      setIsLoading(false);
      displayAlert((e as Error).message, true);
    }
  }

  const handleSave = useCallback(
    async (displayMsg = false, isAutosave = false) => {
      if (parsedData.current.length > 0 && renderedFields.current) {
        // TODO: upgrade saving UX (no backdrop, etc)
        // i.e.: setIsSaving(true)

        setIsLoading(true);

        const [hasEdit, editedFieldsKid] = hasEdited();
        const editedFields = renderedFields.current.filter(
          (f) => f.current && editedFieldsKid.includes(f.current.getKid())
        );

        if (hasEdit) {
          parsedData.current = getUpdatedParsedData({
            editedFields,
            parsedData,
          });

          setFileData([...parsedData.current]);

          saveFileLocally({
            content: parsedData.current,
            name: bucketObjectInfo.current.fileName,
            size: fileRef.current?.size || -1,
            lastModified: fileRef.current?.lastModified || Date.now(),
          });

          if (displayMsg) {
            displayAlert(`${t('Save.success')} 💾`);
          }
        } else {
          if (displayMsg && !isAutosave) {
            displayAlert(`${t('Save.upToDate')} 👍`);
          }
        }
        setIsLoading(false);
        return hasEdit;
      }
      return false;
    },
    [hasEdited, t]
  );

  async function handleFileOpen(args: {
    file: File;
    path: string;
    versionId?: string;
    token?: string;
  }) {
    try {
      if (isEditing) {
        await handleSave(true, true);
      }

      setIsLoading(true);
      setIsEditing(false);
      setFile(args.file);
      fileRef.current = args.file;

      const tmpParsed: RowData[] = [];

      bucketObjectInfo.current = {
        fileName: args.file.name,
        path: args.path,
        versionId: args.versionId,
      };

      Papa.parse<string[]>(args.file, {
        worker: true,
        step: (row: any) => {
          const dt: RowData = { data: row.data, id: tmpParsed.length };

          tmpParsed.push(dt);
        },
        complete: async () => {
          parsedData.current = tmpParsed;
          setDisplayedData([...parsedData.current]);
          setFileData([...parsedData.current]);
          store.remove('fileData');
          store.set('fileData', {
            content: parsedData.current,
            name: fileRef.current?.name?.split('/').at(-1),
            size: fileRef.current?.size,
            lastModified: fileRef.current?.lastModified,
            savedAt: new Date().toLocaleString(),
          });
          if (args.token != null) {
            await saveOnline({
              data: rowDataToString(parsedData.current),
              fileName: bucketObjectInfo.current.fileName,
              token: args.token,
            });
          }
          displayAlert(`${t('OpenFile.success')} 🤓`);
          setIsLoading(false);
          setIsEditing(true);
        },
      });
    } catch (e) {
      bucketObjectInfo.current = {
        fileName: '',
        path: '',
        versionId: undefined,
      };

      displayAlert((e as Error).message, true);
    }
  }

  async function handleDownload() {
    try {
      if (parsedData.current) {
        await handleSave();
        const lines = parsedData.current.map((e) => e.data);
        const data = Papa.unparse(lines);
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.download = `ShopiCSV_${file?.name}`;
        link.href = url;
        link.click();

        displayAlert('Yee haw! 🤠');
        handleCloseFile();
        return;
      }

      throw new Error('No file found in memory or online.');
    } catch (e) {
      displayAlert((e as Error).message, true);
    }
  }

  /* Setting displayed columns */
  useEffect(() => {
    if (store.get('columns')) setDisplayCol(JSON.parse(store.get('columns')));
    // TODO: set this dynamically depending on the file's columns number (7 or 8)
    else setDisplayCol([2, 6, 7]);
  }, []);

  /* ROW FILTERING */
  useEffect(() => {
    let arr = [];
    if (filteredDataIds.length > 0)
      arr = parsedData.current.filter((e) => filteredDataIds.includes(e.id));
    else {
      arr = [...parsedData.current];
      contentRef.current.resetPagination();
    }

    if (filteredDataTypes.length > 0) {
      arr = arr.filter((e) =>
        filteredDataTypes.includes(
          e.data[0].toUpperCase() as TranslatableResourceType
        )
      );
      // Adding a dummy row here because the first one w/o filter is the "Type", "Identification", etc
      // and is being ignored when rendering
      arr.unshift({ id: 0, data: [] });
    }

    setNumOfDisplayedFields(arr.length > 0 ? arr.length - 1 : 0);
    setDisplayedData(arr);
  }, [filteredDataIds, filteredDataTypes]);

  /* KEY BINDINGS */
  useEffect(() => {
    window.addEventListener('keydown', async (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            e.stopImmediatePropagation();
            await handleSave(true);
            break;
          default:
            break;
        }
      }
    });
  }, [handleSave]);

  /* AUTOSAVE */
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (isEditing && !isLoading) {
        await handleSave(true, true);
      }
    }, 180000);

    return () => clearInterval(intervalId);
  }, [isEditing, handleSave, isLoading, hasEdited]);

  useEffect(() => {
    store.remove('columns');
    store.set('columns', JSON.stringify(displayCol));
  }, [displayCol]);

  return (
    <>
      <MtAppBar
        data={fileData}
        display={displayCol}
        onDisplayChange={setDisplayCol}
        onUpload={async () => {}}
        onSave={handleSave}
        onDownload={handleDownload}
        onClose={handleCloseFile}
        onShowOutdated={setDisplayOutdated}
        isLoading={isLoading}
        isEditing={isEditing}
        numOfDisplayedFields={numOfDisplayedFields}
        filteredDataIds={setFilteredDataIds}
        filteredDataTypes={setFilteredTypes}
        onResetTutorial={() => setIsTutorialOpen(true)}
      />
      <Page fullWidth>
        <MtEditorContent
          ref={contentRef}
          display={displayCol}
          dataType={getDataType()}
          data={displayedData}
          headerContent={fileData[0]?.data}
          renderedFields={renderedFields}
          onSave={handleSave}
          onFileLoad={handleFileOpen}
          onUpload={async () => {}}
          onDelete={async () => {}}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          showOutdated={displayOutdated}
          isTutorialOpen={isTutorialOpen}
          onTutorialClose={() => setIsTutorialOpen(false)}
        />
        <MtAlert ref={errorEl} />
        <MtAlert ref={alertEl} />
      </Page>
    </>
  );
}
