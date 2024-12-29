"use client"
import React, { useContext, useEffect } from 'react';
import ContentEditable from './ContentEditable';
import ContextMenu from './ContextMenu';
import Toolbar from './Toolbar';
import { EditorContext, EditorProvider } from './context/EditorContext';

interface EditorProps {
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onChange }) => {
  return (
    <EditorProvider>
      <EditorContent onChange={onChange} />
    </EditorProvider>
  );
};

const EditorContent: React.FC<{ onChange?: (content: string) => void }> = ({ onChange }) => {
  const { content } = useContext(EditorContext)!;

  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content, onChange]);

  return (
    <div>
      <Toolbar />
      <ContextMenu />
      <ContentEditable />
    </div>
  );
};

export default Editor;
