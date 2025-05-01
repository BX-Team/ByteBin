'use client';

import { Editor, BeforeMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTheme } from '@/providers/theme-provider';
import themes from '@/common/themes';
import { usePasteExpiry } from '@/providers/paste-expiry-provider';
import { useRef } from 'react';

interface MonacoEditorProps {
  content: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  fontSize?: number;
  wordWrap?: boolean;
}

export function MonacoEditor({
  content,
  onChange,
  readOnly = false,
  language = 'plaintext',
  fontSize = 16,
  wordWrap = true,
}: MonacoEditorProps) {
  const { theme } = useTheme();
  const { expiry } = usePasteExpiry();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    editor.addAction({
      id: 'search',
      label: 'Search with Google',
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 5,
      run: editor => {
        const selection = editor.getSelection();
        if (selection && !selection.isEmpty()) {
          const model = editor.getModel();
          if (model) {
            const query = model.getValueInRange(selection);
            window.open('https://www.google.com/search?q=' + query, '_blank');
          }
        }
      },
    });
  };

  const beforeMount: BeforeMount = monaco => {
    // Register themes
    Object.entries(themes).forEach(([id, theme]) => {
      monaco.editor.defineTheme(id, theme.editor);
    });
  };

  return (
    <div className='flex flex-row flex-grow pl-[0.5rem] pt-[0.5rem] gap-2 text-sm z-10 h-[calc(100vh-120px)] overflow-hidden'>
      <Editor
        height='100%'
        theme={theme.id}
        language={language === 'plain' ? 'plaintext' : language}
        value={content}
        onChange={value => onChange(value || '')}
        options={{
          fontFamily: 'JetBrains Mono',
          fontSize: fontSize,
          fontLigatures: true,
          wordWrap: wordWrap ? 'on' : 'off',
          renderLineHighlight: 'none',
          renderValidationDecorations: 'off',
          readOnly,
          domReadOnly: readOnly,
        }}
        beforeMount={beforeMount}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
