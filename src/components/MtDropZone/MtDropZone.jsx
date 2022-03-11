import React, { useState, useRef, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import './MtDropZone.css';

export function MtDropZone(props) {
  const {
    text = '',
    acceptedFiles = '',
    multiple = false,
    type = 'file',
    onChange,
  } = props;
  const [hasDrop, setHasDrop] = useState(false);
  const inputEl = useRef(null);
  const dropZoneEl = useRef(null);

  useEffect(() => {
    dropZoneEl.current.addEventListener('click', () => {
      inputEl.current.click();
    });

    dropZoneEl.current.addEventListener('dragover', (e) => {
      e.preventDefault();
      setHasDrop(true);
    });

    ['dragleave', 'dragend'].forEach((type) => {
      dropZoneEl.current.addEventListener(type, (e) => {
        setHasDrop(false);
      });
    });

    dropZoneEl.current.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        inputEl.current.files = e.dataTransfer.files;
        onChange({ target: e.dataTransfer });
      }
      setHasDrop(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={dropZoneEl}
        className={`drop-zone${hasDrop ? ' drop-zone--over' : ''}`}>
        <div>
          <AddCircleOutlineIcon
            sx={{
              fontSize: '3rem!important',
              verticalAlign: 'top!important',
              marginBottom: '1.5rem',
              color: '#3c76d2',
            }}
          />
        </div>
        <div className="drop-zone__prompt">
          {text || 'Drag and drop your file here or click'}
        </div>
        <input
          className="drop-zone__input"
          ref={inputEl}
          multiple={multiple}
          onChange={onChange}
          type={type}
          accept={acceptedFiles}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}
