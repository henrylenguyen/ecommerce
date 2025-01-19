import { EditorContextType, EditorState } from '@/components/common/editor/interface';
import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';

const defaultEditorState: EditorState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  listType: null,
  listStyle: 'disc',
  listLevel: 0,
  alignment: 'left',
};
const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{
  children: ReactNode;
  initialValue?: string;
  onChange?: (markdown: string) => void;
}> = ({
  children,
  initialValue = '',
  onChange
}) => {
    const [content, setContent] = useState<string>(initialValue);
    const [editorState, setEditorState] = useState<EditorState>(defaultEditorState);
    const editorRef = useRef<HTMLDivElement>(null);

    const updateEditorState = React.useCallback(() => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      // Get current formatting
      setEditorState(prev => ({
        ...prev,
        isBold: document.queryCommandState('bold'),
        isItalic: document.queryCommandState('italic'),
        isUnderline: document.queryCommandState('underline'),
        isStrikethrough: document.queryCommandState('strikethrough'),
        alignment: document.queryCommandState('justifyCenter') ? 'center' :
          document.queryCommandState('justifyRight') ? 'right' :
            document.queryCommandState('justifyFull') ? 'justify' : 'left',
      }));

      // Check for list state
      const parentList = selection.anchorNode?.parentElement?.closest('ul, ol');
      if (parentList) {
        const isOrdered = parentList.tagName.toLowerCase() === 'ol';
        const listStyle = window.getComputedStyle(parentList).listStyleType;
        const listLevel = getListLevel(parentList);

        setEditorState(prev => ({
          ...prev,
          listType: isOrdered ? 'ordered' : 'unordered',
          listStyle,
          listLevel,
        }));
      }
    }, []);

    const getListLevel = (element: Element): number => {
      let level = 0;
      let parent = element.parentElement;
      while (parent) {
        if (parent.tagName.toLowerCase() === 'ul' || parent.tagName.toLowerCase() === 'ol') {
          level++;
        }
        parent = parent.parentElement;
      }
      return level;
    };

    const executeCommand = React.useCallback((command: string, value?: string) => {
      if (editorRef.current) {
        document.execCommand(command, false, value ?? '');
        editorRef.current.focus();
        updateEditorState();
        handleContentChange(editorRef.current.innerHTML);
      }
    }, [updateEditorState]);

    const handleContentChange = React.useCallback((newContent: string) => {
      setContent(newContent);
      onChange?.(newContent);
    }, [onChange]);

    const value = React.useMemo(() => ({
      content,
      setContent: handleContentChange,
      executeCommand,
      editorRef,
      editorState,
      setEditorState,
      updateEditorState,
    }), [content, handleContentChange, executeCommand, editorState, updateEditorState]);

    return (
      <EditorContext.Provider value={value}>
        {children}
      </EditorContext.Provider>
    );
  };

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};