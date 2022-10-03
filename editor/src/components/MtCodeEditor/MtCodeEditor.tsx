import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { withSize } from 'react-sizeme';
import MonacoEditor from '@monaco-editor/react';
import monaco from 'monaco-editor';

export type MtCodeEditorElement = {
  layout: () => void;
  getValue: () => string | undefined;
  getKid: () => string;
};
interface MtCodeEditorProps {
  inputref: React.MutableRefObject<MtCodeEditorElement>;
  kid: string;
  size: { width: number };
  language: string;
  height: string;
  value: string;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  // theme: 'vs-dark',
  acceptSuggestionOnCommitCharacter: false,
  acceptSuggestionOnEnter: 'off',
  codeLens: false,
  contextmenu: false,
  quickSuggestions: false,
  snippetSuggestions: 'none',
  minimap: { enabled: false },
};

export const MtCodeEditor = withSize({ monitorWidth: true })(
  forwardRef((props: MtCodeEditorProps, ref) => {
    const editorEl = useRef<monaco.editor.IStandaloneCodeEditor>(null!);
    const isMounted = useRef<boolean>(false);
    const [shouldUpdate, setShouldUpdate] = useState(true);

    const layout = useCallback(() => {
      if (isMounted.current)
        editorEl.current.layout({
          width: +props.size.width,
          height: parseFloat(props.height),
        });
    }, [props.size.width, props.height]);

    function handleMount(
      editor: monaco.editor.IStandaloneCodeEditor,
      monaco: any
    ) {
      editorEl.current = editor;
      isMounted.current = true;
    }

    function getValue() {
      if (isMounted.current) {
        return editorEl.current.getValue();
      }
    }

    useImperativeHandle(props.inputref, () => ({
      layout,
      getValue,
      getKid: () => props.kid,
    }));

    useEffect(() => {
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

    return (
      <MonacoEditor
        options={defaultOptions}
        onMount={handleMount}
        theme="vs-dark"
        {...props}
      />
    );
  })
);
