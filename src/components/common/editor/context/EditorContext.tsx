import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';


interface EditorContextType {
  content: string;
  setContent: (content: string | Node | React.ReactElement) => void;
  executeCommand: (command: string, value?: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

interface EditorProviderProps {
  children: ReactNode;
  initialValue?: string;
  onChange?: (html: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialValue = '',
  onChange
}) => {
  const [content, setContent] = useState<string>(initialValue);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = React.useCallback((newContent: string | Node) => {
    if (!editorRef.current) return;

    let processedContent: string;
    if (typeof newContent === 'string') {
      processedContent = newContent;
    } else {
      // Nếu là Node, lấy outerHTML hoặc textContent
      processedContent = newContent instanceof Element ? newContent.outerHTML : newContent.textContent || '';
    }

    // Lấy vị trí cursor hiện tại
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range && editorRef.current.contains(range.commonAncestorContainer)) {
      // Lưu vị trí cursor
      const start = range.startOffset;
      const container = range.startContainer;

      // Lấy nội dung hiện tại của editor
      const currentContent = editorRef.current.innerHTML;

      // Tính toán vị trí để chèn content mới
      let beforeCursor = '';
      let afterCursor = '';

      if (container.nodeType === Node.TEXT_NODE) {
        const parentElement = container.parentElement;
        const parentIndex = Array.from(editorRef.current.childNodes).indexOf(parentElement || container);

        if (parentIndex !== -1) {
          const children = Array.from(editorRef.current.childNodes);
          beforeCursor = children.slice(0, parentIndex).map(n => n instanceof Element ? n.outerHTML : n.textContent).join('');
          afterCursor = children.slice(parentIndex + 1).map(n => n instanceof Element ? n.outerHTML : n.textContent).join('');

          if (parentElement) {
            const textContent = container.textContent || '';
            beforeCursor += textContent.substring(0, start);
            afterCursor = textContent.substring(start) + afterCursor;
          }
        }
      }

      // Kết hợp nội dung
      const newHtml = beforeCursor + processedContent + afterCursor;

      // Cập nhật nội dung
      editorRef.current.innerHTML = newHtml;

      // Cập nhật state
      setContent(newHtml);
      onChange?.(newHtml);

      // Khôi phục cursor
      try {
        const newRange = document.createRange();
        const newPosition = beforeCursor.length + processedContent.length;

        // Tìm node và offset mới
        let currentNode = editorRef.current;
        let currentOffset = 0;

        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );

        let textNode = walker.nextNode();
        while (textNode) {
          const textLength = textNode.length;
          if (currentOffset + textLength >= newPosition) {
            newRange.setStart(textNode, newPosition - currentOffset);
            newRange.setEnd(textNode, newPosition - currentOffset);
            break;
          }
          currentOffset += textLength;
          textNode = walker.nextNode();
        }

        // Áp dụng selection mới
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      } catch (error) {
        console.error('Error restoring cursor position:', error);
      }
    } else {
      // Nếu không có selection, thêm vào cuối
      const newHtml = editorRef.current.innerHTML + processedContent;
      editorRef.current.innerHTML = newHtml;
      setContent(newHtml);
      onChange?.(newHtml);
    }

  }, [onChange]);

  const executeCommand = React.useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value ?? '');
      editorRef.current.focus();

      requestAnimationFrame(() => {
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
          onChange?.(editorRef.current.innerHTML);
        }
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
      setContent(initialValue);
    }
  }, [initialValue]);

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