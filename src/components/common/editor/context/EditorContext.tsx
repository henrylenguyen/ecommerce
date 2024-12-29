import React, { createContext, useState, useRef, ReactNode } from 'react';

interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
  executeCommand: (command: string, value?: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

export const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
    editorRef.current?.focus();
  };

  return (
    <EditorContext.Provider value={{ content, setContent, executeCommand, editorRef }}>
      {children}
    </EditorContext.Provider>
  );
};
