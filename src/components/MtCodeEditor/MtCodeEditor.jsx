import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { withSize } from 'react-sizeme';
import MonacoEditor from '@uiw/react-monacoeditor';

const options = {
  theme: 'vs-dark',
  acceptSuggestionOnCommitCharacter: 'off',
  acceptSuggestionOnEnter: 'off',
  codeLens: false,
  contextmenu: false,
  quickSuggestions: false,
  snippetSuggestions: 'none',
  minimap: { enabled: false },
};

// FIXME: problem when height is different than 500px, need to modify the rendered DOM element's CSS
export const MtCodeEditor = withSize({ monitorWidth: true })(
  forwardRef((props, ref) => {
    const { inputref, kid } = props;
    const { width } = props.size;
    const editorEl = useRef(null);
    const isMounted = useRef(null);
    const [shouldUpdate, setShouldUpdate] = useState(true);

    const layout = useCallback(() => {
      if (isMounted.current)
        editorEl.current.editor?.layout({ width: +width, height: 500 });
    }, [width]);

    function getValue() {
      if (isMounted.current) {
        return editorEl.current.editor.getValue();
      }
    }

    useImperativeHandle(inputref, () => ({
      layout,
      getValue,
      getKid: () => kid,
    }));

    useEffect(() => {
      isMounted.current = true;
      return () => (isMounted.current = false);
    }, []);

    // re-rendering to make sure the ref is set
    useEffect(() => {
      if (shouldUpdate) setShouldUpdate(false);
    }, [shouldUpdate]);

    useEffect(() => {
      layout();
    }, [props.size.width, layout]);

    useEffect(() => {
      window.addEventListener('resize', layout);
    }, [layout]);

    return (
      <MonacoEditor
        ref={editorEl}
        height="1000px"
        options={props.options || options}
        {...props}
      />
    );
  })
);
