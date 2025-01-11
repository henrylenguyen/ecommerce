import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';

interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
  executeCommand: (command: string, value?: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

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
    const editorRef = useRef<HTMLDivElement>(null);
    const lastSelectionRef = useRef<{ start: number; end: number } | null>(null);

    const saveSelection = () => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(editorRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;

      preSelectionRange.setEnd(range.endContainer, range.endOffset);
      const end = preSelectionRange.toString().length;

      lastSelectionRef.current = { start, end };
    };

    const restoreSelection = () => {
      if (!editorRef.current || !lastSelectionRef.current) return;

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      let charIndex = 0;
      let done = false;

      const traverseNodes = function* (node: Node): Generator<Node> {
        if (node.nodeType === Node.TEXT_NODE) {
          yield node;
        } else {
          for (const child of Array.from(node.childNodes)) {
            yield* traverseNodes(child);
          }
        }
      };

      const nodeIterator = traverseNodes(editorRef.current);
      let currentNode: IteratorResult<Node>;

      // Find start position
      while (!done && (currentNode = nodeIterator.next(), !currentNode.done)) {
        const node = currentNode.value;
        const length = node.textContent?.length || 0;

        if (charIndex + length >= lastSelectionRef.current.start) {
          range.setStart(node, lastSelectionRef.current.start - charIndex);
          if (charIndex + length >= lastSelectionRef.current.end) {
            range.setEnd(node, lastSelectionRef.current.end - charIndex);
            done = true;
          }
        }
        charIndex += length;
      }

      if (!done) {
        // Find end position if we haven't already
        while ((currentNode = nodeIterator.next(), !currentNode.done)) {
          const node = currentNode.value;
          const length = node.textContent?.length || 0;
          if (charIndex + length >= lastSelectionRef.current.end) {
            range.setEnd(node, lastSelectionRef.current.end - charIndex);
            break;
          }
          charIndex += length;
        }
      }

      selection.removeAllRanges();
      selection.addRange(range);
    };

    const handleContentChange = React.useCallback((newContent: string) => {
      if (editorRef.current) {
        saveSelection();
        setContent(newContent);
        onChange?.(newContent);

        // Restore selection after the content update
        requestAnimationFrame(() => {
          if (editorRef.current) {
            restoreSelection();
            editorRef.current.focus();
          }
        });
      }
    }, [onChange]);

    const executeCommand = React.useCallback((command: string, value?: string) => {
      if (editorRef.current) {
        document.execCommand(command, false, value ?? '');
        editorRef.current.focus();
        handleContentChange(editorRef.current.innerHTML);
      }
    }, [handleContentChange]);

    const value = React.useMemo(() => ({
      content,
      setContent: handleContentChange,
      executeCommand,
      editorRef
    }), [content, handleContentChange, executeCommand]);

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