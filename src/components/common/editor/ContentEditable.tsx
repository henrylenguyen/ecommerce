"use client"
import React, { useContext } from 'react';
import { EditorContext } from './context/EditorContext';

const ContentEditable: React.FC = () => {
  const { setContent, editorRef } = useContext(EditorContext)!;

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      style={{
        border: '1px solid #ccc',
        minHeight: '300px',
        padding: '10px',
        overflowY: 'auto',
      }}
    />
  );
};

export default ContentEditable;
