import { useRef, forwardRef, useImperativeHandle } from 'react';
import TextField from '@mui/material/TextField';
import { MtCodeEditor } from '../MtCodeEditor/MtCodeEditor';

// -FIXME debug all this
// 1. Store props in states
// 3. still having problem accessing editor's value (undefined -> already unmounted?)
export const MtEditorField = forwardRef((props, ref) => {
  const {
    code = false,
    multiline = false,
    fullWidth,
    label,
    kid,
    value,
  } = props;
  const inputEl = useRef();

  function getValue() {
    if (code) return inputEl.current.getValue();
    return inputEl.current.children[1].children[0].value;
  }

  function layout() {
    if (code) inputEl.current.layout();
  }

  useImperativeHandle(ref, () => ({
    getKid: () => kid,
    getValue,
    layout,
    isCode: () => code,
  }));

  return code ? (
    <MtCodeEditor
      inputref={inputEl}
      kid={kid}
      language="liquid"
      // height={height}
      height="500px"
      value={value}
    />
  ) : (
    <TextField
      ref={inputEl}
      multiline={multiline}
      maxRows={4}
      label={label}
      variant="filled"
      kid={kid}
      fullWidth={fullWidth}
      defaultValue={value}
    />
  );
});
