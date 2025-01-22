// src/components/editor/Content.tsx
import { cn } from '@/utils';
import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor } from './context/EditorContext';
import { useAlertBlocks } from './hooks/useAlertBlocks';
import { useCodeBlocks } from './hooks/useCodeBlocks';
import { useKeyboardHandlers } from './hooks/useKeyboardHandlers';
import { updateListState } from './utils/editorUtils';

const Content: React.FC = () => {
  const {
    content,
    setContent,
    editorRef,
    updateEditorState,
    setEditorState
  } = useEditor();

  const contentRef = useRef(content);
  const isProcessingRef = useRef(false);
  const debouncedContentRef = useRef(content);

  const { convertMarkdownToCodeBlock, renderCodeBlocks } = useCodeBlocks();
  const { convertMarkdownToAlertBlock, renderAlertBlocks } = useAlertBlocks();

  const { handleKeyDown } = useKeyboardHandlers({
    editorRef,
    setEditorState,
    updateEditorState,
  }) as unknown as { handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> };

  const handleInput = useCallback(() => {
    if (!editorRef.current || isProcessingRef.current) return;

    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const blockquote = selection.anchorNode?.parentElement?.closest('blockquote');
      setEditorState(prev => ({
        ...prev,
        isQuote: !!blockquote
      }));
    }

    contentRef.current = editorRef.current.innerHTML;
    updateEditorState();
    updateListState(window.getSelection(), setEditorState);

    // Update content immediately for alert blocks
    setContent(contentRef.current);
    debouncedContentRef.current = contentRef.current;
  }, [updateEditorState, setEditorState, editorRef, setContent]);

  const handleBlur = useCallback(() => {
    if (contentRef.current !== debouncedContentRef.current) {
      setContent(contentRef.current);
      debouncedContentRef.current = contentRef.current;
    }
  }, [setContent]);

  useEffect(() => {
    if (!editorRef.current) return;

    const processedContent = convertMarkdownToCodeBlock(convertMarkdownToAlertBlock(content));
    if (processedContent !== editorRef.current.innerHTML) {
      isProcessingRef.current = true;
      editorRef.current.innerHTML = processedContent;
      renderCodeBlocks(editorRef, contentRef);
      renderAlertBlocks(editorRef, contentRef, handleInput);
      contentRef.current = editorRef.current.innerHTML;
      debouncedContentRef.current = contentRef.current;
      isProcessingRef.current = false;
    }
  }, [content, convertMarkdownToCodeBlock, convertMarkdownToAlertBlock, renderCodeBlocks, renderAlertBlocks, handleInput, editorRef]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.firstChild) {
      const p = document.createElement('p');
      const textNode = document.createTextNode('\u200B');
      p.appendChild(textNode);
      editorRef.current.appendChild(p);
    }
  }, [editorRef]);

  return (
    <div
      ref={editorRef}
      contentEditable
      role="textbox"
      aria-multiline="true"
      tabIndex={0}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={cn(
        "w-full min-h-[200px] p-4 focus:outline-none",
        "overflow-y-auto whitespace-pre-wrap",
        "prose prose-sm max-w-none",
        "[&>ul]:pl-5 [&>ol]:pl-5",
        "[&_ul]:pl-5 [&_ol]:pl-5"
      )}
      suppressContentEditableWarning={true}
    />
  );
};

export default Content;