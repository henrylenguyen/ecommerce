"use client"
import React, { useContext } from 'react';
import { EditorContext } from './context/EditorContext';

const Toolbar: React.FC = () => {
  const { executeCommand } = useContext(EditorContext)!;

  return (
    <div style={{ marginBottom: '10px' }}>
      <button onClick={() => executeCommand('bold')} type='button'>Bold</button>
      <button onClick={() => executeCommand('italic')} type='button'>Italic</button>
      <button onClick={() => executeCommand('underline')} type='button'>Underline</button>
      <button onClick={() => executeCommand('justifyLeft')} type='button'>Left Align</button>
      <button onClick={() => executeCommand('justifyCenter')} type='button'>Center Align</button>
      <button onClick={() => executeCommand('justifyRight')} type='button'>Right Align</button>
      <button onClick={() => executeCommand('foreColor', 'red')} type='button'>Red</button>
      <button onClick={() => executeCommand('createLink', prompt('Enter URL') || '')}>Link</button>
    </div>
  );
};

export default Toolbar;
