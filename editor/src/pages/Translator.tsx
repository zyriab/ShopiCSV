import React, { useState, useRef, useEffect, useCallback } from 'react';
import store from 'store2';
import Papa from 'papaparse';
// import getDateLocale from '../utils/tools/getDateLocale.utils';
import getDataType from '../utils/tools/getDataType.utils';
import saveOnline from '../utils/tools/buckaroo/saveOnline.utils';
// import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import { useAuth0 } from '@auth0/auth0-react';
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
  FileInput,
  BucketObjectInfo,
  TranslatableResourceType,
} from '../definitions/custom';
import saveFileLocally from '../utils/tools/demo/saveFileLocally.utils';
import getUpdatedParsedData from '../utils/tools/getUpdatedParsedData.utils';
import deleteObject from '../utils/tools/buckaroo/deleteObject.utils';
import downloadAndSaveObjectLocally from '../utils/tools/buckaroo/downloadAndSaveObjectLocally.utils';
import { getDownloadUrl } from '../utils/tools/buckaroo/queries.utils';
import { generateSlug } from 'random-word-slugs';
import rowDataToString from '../utils/tools/buckaroo/rowDataToString';

export default function Translator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);
  const [file, setFile] = useState<File | null>(null); // uploaded file or data of restored session (name, size, lastModified, lastSave?, content?)
  const fileRef = useRef<File | null>(null); // used for direct update/access when saving
  const [displayCol, setDisplayCol] = useState<number[]>([]);
  const [fileData, setFileData] = useState<RowData[]>([]);
  const [displayedData, setDisplayedData] = useState<RowData[]>([]); // used for rendering content
  const [filteredDataIds, setFilteredDataIds] = useState<number[]>([]);
  const [filteredDataTypes, setFilteredTypes] = useState<
    TranslatableResourceType[]
  >([]);
  const [numOfDisplayedFields, setNumOfDisplayedFields] = useState(0);
  const [displayOutdated, setDisplayOutdated] = useState(false);

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
  const { t, i18n } = useTranslation();
  const { getAccessTokenSilently } = useAuth0();

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

  async function handleDeleteFile(args: FileInput, confirm = true) {
    const alreadyLoading = isLoading;

    setIsLoading(true);

    if (confirm) {
      try {
        await confirmationDialog({
          allowClose: false,
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
      } catch {
        return;
      }
    }

    const token = await getAccessTokenSilently();

    try {
      await deleteObject({ ...args, token });
    } catch (e) {
      displayAlert((e as Error).message, true);
    }

    setIsLoading(alreadyLoading ? true : false);
  }

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
      setHasClosed(true);

      if (isDeleting) {
        store.remove('fileData');

        if (process.env.REACT_APP_ENV !== 'demo') {
          await handleDeleteFile(bucketObjectInfo.current, false);
        }
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

        // setIsSaving(true) (?)
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

          if (process.env.REACT_APP_ENV === 'demo') {
            saveFileLocally({
              content: parsedData.current,
              name: bucketObjectInfo.current.fileName,
              size: fileRef.current?.size || -1,
              lastModified: fileRef.current?.lastModified || Date.now(),
            });
          } else {
            const token = await getAccessTokenSilently();

            // FIXME: failed to fetch
            await saveOnline({
              data: rowDataToString(parsedData.current),
              fileName: bucketObjectInfo.current.fileName,
              token,
            });
          }

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
    [getAccessTokenSilently, hasEdited, t]
  );

  async function handleFileOpen(args: { file: File, path: string, versionId?: string, token?: string }) {
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
            name: fileRef.current?.name,
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

  async function handleUpload(objInfo: BucketObjectInfo, file: File) {
    try {
      setIsLoading(true);

      bucketObjectInfo.current = {
        ...objInfo,
        fileName: objInfo.fileName || generateSlug(),
      };

      const token = await getAccessTokenSilently();

      await handleCloseFile();
      await handleFileOpen({ file, path: objInfo.path, versionId: objInfo.versionId, token });

      setIsLoading(false);
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

      if (bucketObjectInfo.current.fileName) {
        const token = await getAccessTokenSilently();
        const url = await getDownloadUrl({
          ...bucketObjectInfo.current,
          token,
        });

        await downloadAndSaveObjectLocally({
          url,
          objectName: bucketObjectInfo.current.fileName,
        });

        displayAlert('Yee haw! 🤠');
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

  /* AUTO-OPEN (local memory) */
  // useEffect(() => {
  //   async function openFromLocalMemory() {
  //     try {
  //       await confirmationDialog({
  //         allowClose: true,
  //         title: t('RestoreSessionDialog.title'),
  //         description: t('RestoreSessionDialog.description', {
  //           date: formatDistanceToNow(new Date(store.get('fileData').savedAt), {
  //             locale: getDateLocale(),
  //           }),
  //         }),
  //         confirmationText: t('General.yesUpper'),
  //         cancellationText: t('General.noUpper'),
  //         confirmationButtonProps: {
  //           disableElevation: true,
  //           variant: 'contained',
  //         },
  //         cancellationButtonProps: {
  //           disableElevation: true,
  //           variant: 'contained',
  //         },
  //       });

  //       setIsLoading(true);
  //       setIsEditing(false);

  //       parsedData.current = [];
  //       parsedData.current = store.get('fileData').content;
  //       setFileData([...parsedData.current]);
  //       setDisplayedData([...parsedData.current]);

  //       fileRef.current = { ...store.get('fileData') };
  //       setFile({ ...store.get('fileData') });

  //       displayAlert(
  //         `${t('RestoreSessionDialog.alertMsg', {
  //           date: store.get('fileData').savedAt,
  //         })} 🐘`
  //       );

  //       setIsLoading(false);
  //       setIsEditing(true);
  //     } catch {
  //       store.remove('fileData');
  //     }
  //   }

  //   if (!isEditing && !hasClosed) {
  //     if (store.get('fileData')) {
  //       openFromLocalMemory();
  //     }
  //   }
  // }, [isEditing, hasClosed, confirmationDialog, t, i18n.resolvedLanguage]);

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
        onUpload={async (e) => await handleUpload(bucketObjectInfo.current, e)}
        onSave={handleSave}
        onDownload={handleDownload}
        onClose={handleCloseFile}
        onShowOutdated={setDisplayOutdated}
        isLoading={isLoading}
        isEditing={isEditing}
        numOfDisplayedFields={numOfDisplayedFields}
        filteredDataIds={setFilteredDataIds}
        filteredDataTypes={setFilteredTypes}
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
          onUpload={handleUpload}
          onDelete={handleDeleteFile}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          showOutdated={displayOutdated}
        />
        <MtAlert ref={errorEl} />
        <MtAlert ref={alertEl} />
      </Page>
    </>
  );
}
