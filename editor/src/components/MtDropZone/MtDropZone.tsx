import React, { useState, useRef, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import './MtDropZone.css';

interface AppProps {
  text?: string;
  acceptedFiles?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | {target: DataTransfer}) => Promise<void>;
}

export function MtDropZone(props: AppProps) {
  const [hasDrop, setHasDrop] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const dropZoneEl = useRef<HTMLDivElement>(null);
  const isHandling = useRef(false);

  useEffect(() => {
    dropZoneEl.current?.addEventListener('click', () => {
      if(!isHandling.current) {
        isHandling.current = true;
        inputEl.current?.click();
      }
      isHandling.current = false;
    });

    dropZoneEl.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
      setHasDrop(true);
    });

    ['dragleave', 'dragend'].forEach((type) => {
      dropZoneEl.current?.addEventListener(type, () => {
        setHasDrop(false);
      });
    });

    dropZoneEl.current?.addEventListener('drop', (e) => {
      e.preventDefault();
      if(!isHandling.current) {
        isHandling.current = true;
        if (e.dataTransfer?.files.length && inputEl.current) {
          inputEl.current.files = e.dataTransfer?.files;
          props.onChange({ target: e.dataTransfer });
        }
      }
      isHandling.current = false;
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
              color: '#1976d2',
            }}
          />
        </div>
        <div className="drop-zone__prompt">
          {/* TODO: i18n */}
          {props.text || 'Drag and drop your file here or click'}
        </div>
        <input
          className="drop-zone__input"
          ref={inputEl}
          multiple={props.multiple || false}
          onChange={props.onChange}
          type="file"
          accept={props.acceptedFiles}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}
