import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { MtCodeEditor } from '../MtCodeEditor/MtCodeEditor';

// TODO: fields should all have the same height as the tallest, excluding code editor (add \n ?)
export const MtEditorField = forwardRef((props, ref) => {
  const {
    code = false,
    fullWidth,
    label,
    kid,
    value,
  } = props;
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const inputEl = useRef();
  
  function getValue() {
    console.log('code: ', code);
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

  // re-rendering to make sure the ref is set
  useEffect(() => {
    if (shouldUpdate) setShouldUpdate(false);
  }, [shouldUpdate]);

  return code ? (
    <Box sx={{ height: '500px' }}>
      <MtCodeEditor
        inputref={inputEl}
        kid={kid}
        language="liquid"
        height="500px"
        value={value}
      />
    </Box>
  ) : (
    // TODO: when losing focus, cursor should stay in place, not reset position
    // TODO: see if multiline=true fixes the problem :) (looks like yes)
    <TextField
      ref={inputEl}
      multiline={true}
      label={label}
      variant="filled"
      kid={kid}
      fullWidth={fullWidth}
      defaultValue={value}
    />
  );
});
