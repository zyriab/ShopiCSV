import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { withSize } from 'react-sizeme';
import MonacoEditor, { RefEditorInstance } from '@uiw/react-monacoeditor';
import editor from 'monaco-editor';

export type MtCodeEditorElement = {
  layout: () => void;
  getValue: () => string | undefined;
  getKid: () => string;
};
interface AppProps {
  inputref: React.MutableRefObject<MtCodeEditorElement>;
  kid: string;
  size: { width: number };
  language: string;
  height: string;
  value: string;
}

const defaultOptions: editor.editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-dark',
  acceptSuggestionOnCommitCharacter: false,
  acceptSuggestionOnEnter: 'off',
  codeLens: false,
  contextmenu: false,
  quickSuggestions: false,
  snippetSuggestions: 'none',
  minimap: { enabled: false },
};

export const MtCodeEditor = withSize({ monitorWidth: true })(
  forwardRef((props: AppProps, ref) => {
    const editorEl = useRef<RefEditorInstance>(null!);
    const isMounted = useRef<boolean>(null!);
    const [shouldUpdate, setShouldUpdate] = useState(true);

    const layout = useCallback(() => {
      if (isMounted.current)
        editorEl.current.editor?.layout({
          width: +props.size.width,
          height: parseFloat(props.height),
        });
    }, [props.size.width, props.height]);

    function getValue() {
      if (isMounted.current) {
        return editorEl.current.editor?.getValue();
      }
    }

    useImperativeHandle(props.inputref, () => ({
      layout,
      getValue,
      getKid: () => props.kid,
    }));

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
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

    return <MonacoEditor ref={editorEl} options={defaultOptions} {...props} />;
  })
);
