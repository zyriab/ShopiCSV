import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {
  MtCodeEditor,
  MtCodeEditorElement,
} from '../MtCodeEditor/MtCodeEditor';

export type MtFieldElement = {
  getKid: () => string;
  getValue: () => string | undefined;
  layout: () => void;
  isCode: () => boolean;
  getElement: () => HTMLInputElement | MtCodeEditorElement;
};

interface MtEditorFieldProps {
  code?: boolean;
  language: string;
  fullWidth: boolean;
  label: string;
  kid: string;
  value: string;
}

export const MtEditorField = forwardRef<MtFieldElement, MtEditorFieldProps>(
  (props: MtEditorFieldProps, ref) => {
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const inputEl = useRef<HTMLInputElement>(null!);
    const editorEl = useRef<MtCodeEditorElement>(null!);

    function getValue() {
      if (props.code) {
        return editorEl.current?.getValue();
      }

      return (inputEl.current.children[1].children[0] as HTMLInputElement)
        ?.value;
    }

    function getElement() {
      if (props.code) {
        return editorEl.current;
      }

      return inputEl.current;
    }

    function layout() {
      if (props.code) {
        editorEl.current?.layout();
      }
    }

    useImperativeHandle(ref, () => ({
      getKid: () => props.kid,
      getValue,
      layout,
      isCode: () => props.code || false,
      getElement,
    }));

    // re-rendering to make sure the ref is set
    useEffect(() => {
      if (shouldUpdate) setShouldUpdate(false);
    }, [shouldUpdate]);

    return props.code ? (
      <Box sx={{ height: '500px' }}>
        <MtCodeEditor
          inputref={editorEl}
          kid={props.kid}
          language={props.language}
          height="500px"
          value={props.value}
        />
      </Box>
    ) : (
      <TextField
        ref={inputEl}
        multiline={true}
        label={props.label}
        variant="filled"
        // @ts-ignore
        kid={props.kid}
        fullWidth={props.fullWidth}
        defaultValue={props.value}
        // TODO: add this to theme.ts
        inputProps={{
          style: {
            alignSelf: 'start',
          },
        }}
      />
    );
  }
);
