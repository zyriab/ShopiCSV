import React, { useState, useRef, useEffect, useCallback } from 'react';
import store from 'store';
import Papa from 'papaparse';
import { MtAlert } from '../components/MtAlert/MtAlert';
import { MtAppBar } from '../components/MtAppBar/MtAppBar';
import { MtEditorContent } from '../components/MtEditorContent/MtEditorContent';

const TYPE = {
  ALL: 'all',
  PRODUCTS: 'products',
  EMAILS: 'emails',
  SMS: 'sms',
  // TODO: check what needs to be here
};

function Editor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(); // uploaded file or data of restored session (name, size, lastModified, lastSave?, content?)
  const fileRef = useRef(null); // used for direct update/access when saving
  const [displayCol, setDisplayCol] = useState();
  const [fileData, setFileData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]); // used for rendering content
  const [filteredDataIds, setFilteredDataIds] = useState([]);
  const [filteredType, setFilteredType] = useState(TYPE.ALL);
  const parsedData = useRef([]); // stores the file's content, used for data manipulation (saving, downloading, etc)
  const renderedFields = useRef([]);
  const alertRef = useRef(null);

  function displayAlert(message, type = 'success') {
    alertRef.current.show(message, type);
  }

  const hasEdited = useCallback(() => {
    let hasEdit = false;
    const editedFieldsKid = [];
    for (let field of renderedFields.current) {
      const kid = field.current.getKid();
      const tmpKid = kid.split('-');
      const fieldVal = field.current.getValue();
      const savedVal = parsedData.current[tmpKid[0]].data[tmpKid[1]];
      if (fieldVal !== savedVal) {
        editedFieldsKid.push(kid);
        hasEdit = true;
      }
    }
    return [hasEdit, editedFieldsKid];
  }, []);

  function handleCloseFile() {
    // TODO: need prompt for confirmation
    setIsLoading(true);

    store.remove('fileData');
    parsedData.current = [];
    fileRef.current = null;
    setFile(null);
    setFileData([]);
    setDisplayedData([]);

    setIsEditing(false);
    setIsLoading(false);
  }

  const handleSave = useCallback(
    (displayMsg = false, isAutosave = false) => {
      if (parsedData.current.length > 0 && renderedFields.current) {
        setIsLoading(true);
        const [hasEdit, editedFieldsKid] = hasEdited();
        const editedFields = renderedFields.current.filter((f) =>
          editedFieldsKid.includes(f.current.getKid())
        );

        if (hasEdit) {
          for (let field of editedFields) {
            const kid = field.current.getKid().split('-');
            parsedData.current[kid[0]].data[kid[1]] = field.current.getValue();
          }

          //setFileData([...parsedData.current]);
          store.remove('fileData');
          store.set('fileData', {
            content: parsedData.current,
            name: fileRef.current.name,
            size: fileRef.current.size,
            lastModified: fileRef.current.lastModified,
            savedAt: new Date().toLocaleString(),
          });

          if (displayMsg) {
            displayAlert('Successfully saved in local storage 💾');
          }
        } else {
          if (displayMsg && !isAutosave) {
            displayAlert('Already up to date 👍', 'info');
          }
        }
        setIsLoading(false);
        return hasEdit;
      }
      return false;
    },
    [hasEdited]
  );

  async function handleUpload(e) {
    if (e?.target?.files) {
      if (isEditing) handleSave(true, true);
      if (e.target.files[0].type !== 'text/csv') {
        displayAlert(
          'File rejected. You may only upload .CSV files 🧐',
          'error'
        );
        return;
      }

      setIsLoading(true);
      setIsEditing(false);
      setFile(e.target.files[0]);
      fileRef.current = e.target.files[0];
      parsedData.current = [];
      let index = 0;

      Papa.parse(e.target.files[0], {
        worker: true,
        comments: '#',

        step: (row) => {
          if (index === 0 && row.data[0] !== 'Type') {
            displayAlert(
              'The uploaded file does not seem to be from Shopify',
              'error'
            );
            setIsLoading(false);
            return;
          }
          if (row.data.length > 7) row.data = row.data.splice(0, 7);
          if (row.data.length === 7) parsedData.current.push(row);
          index++;
        },
        complete: async () => {
          displayAlert('Successfully parsed document 🤓');
          setDisplayedData([...parsedData.current]);
          setFileData([...parsedData.current]);
          store.remove('fileData');
          store.set('fileData', {
            content: parsedData.current,
            name: fileRef.current.name,
            size: fileRef.current.size,
            lastModified: fileRef.current.lastModified,
            savedAt: new Date().toLocaleString(),
          });
          setIsLoading(false);
          setIsEditing(true);
        },
      });
    }
  }

  function handleDownload() {
    if (parsedData.current) {
      handleSave();
      let lines = [];
      for (let l of parsedData.current) {
        lines.push(l.data);
      }
      const data = Papa.unparse(lines);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ShopiCSV_${file.name}`;
      link.href = url;
      link.click();
      displayAlert('Yee haw! 🤠');
      handleCloseFile();
    }
  }

  useEffect(() => {
    if (store.get('columns')) setDisplayCol(JSON.parse(store.get('columns')));
    else setDisplayCol([2, 5, 6]);
  }, []);

  // TODO: implement filterd types
  useEffect(() => {}, [filteredType]);

  useEffect(() => {
    let arr = [];
    if (filteredDataIds.length > 0) {
      for (let e of filteredDataIds) {
        arr.push(parsedData.current[e.id]);
      }
    } else {
      arr = [...parsedData.current];
    }
    setDisplayedData(arr);
  }, [filteredDataIds]);

  /* KEY BINDINGS */
  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            e.stopImmediatePropagation();
            handleSave(true);
            break;
          default:
            break;
        }
      }
    });
  }, [handleSave]);

  /* AUTOSAVE */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isEditing && !isLoading) {
        handleSave(true, true);
      }
    }, 180000);

    return () => clearInterval(intervalId);
  }, [isEditing, handleSave, isLoading, hasEdited]);

  /* AUTO-OPEN */
  useEffect(() => {
    function openFromMemory() {
      if (store.get('fileData')) {
        setIsLoading(true);
        setIsEditing(false);

        parsedData.current = [];
        parsedData.current = store.get('fileData').content;
        setFileData([...parsedData.current]);
        setDisplayedData([...parsedData.current]);

        fileRef.current = { ...store.get('fileData') };
        setFile({ ...store.get('fileData') });

        displayAlert(
          `Successfully restored your last session of ${
            store.get('fileData').savedAt
          } 🐘`,
          'info'
        );

        setIsLoading(false);
        setIsEditing(true);
      }
    }

    if (!isEditing) openFromMemory();
  }, [isEditing]);

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
        onUpload={handleUpload}
        onSave={handleSave}
        onDownload={handleDownload}
        onCancel={handleCloseFile}
        isLoading={isLoading}
        isEditing={isEditing}
        filteredDataIds={setFilteredDataIds}
        filteredType={setFilteredType}
      />
      <MtEditorContent
        display={displayCol}
        data={displayedData}
        renderedFields={renderedFields}
        onSave={handleSave}
        onUpload={handleUpload}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <MtAlert ref={alertRef} />
    </>
  );
}

export default Editor;
