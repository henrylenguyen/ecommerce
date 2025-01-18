import AlertBlockPreview from '@/components/common/editor/alert/alertBlockPreview';
import { escapeHtml, unescapeHtml } from '@/components/common/editor/utils';
import { cn } from '@/utils';
import { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CodeBlockPreview } from './code/codeBlockPreview';
import { useEditor } from './context/EditorContext';


const Content = () => {
  const { content, setContent, editorRef } = useEditor();
  const contentRef = useRef(content);
  const isProcessingRef = useRef(false);
  const codeBlocksMap = useRef(new Map()).current;
  const debouncedContentRef = useRef(content);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      document.execCommand('insertLineBreak');
      e.preventDefault();
    }
  }, []);

  const convertMarkdownToCodeBlock = useCallback((content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let html = content;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [fullMatch, language = 'text', code] = match;
      const blockId = `code-block-${Math.random().toString(36).slice(2, 9)}`;
      const escapedCode = escapeHtml(code.trim());
      const codeBlockHtml = `<div class="code-block-wrapper my-2" contenteditable="false" id="${blockId}"><div class="code-preview" data-language="${language}" data-code="${escapedCode}"></div></div>`;
      html = html.replace(fullMatch, codeBlockHtml);
    }
    return html;
  }, []);

  const renderCodeBlocks = useCallback(() => {
    if (!editorRef.current) return;

    const codeBlocks = editorRef.current.getElementsByClassName('code-block-wrapper');
    const currentIds = new Set([...codeBlocks].map(block => block.id));

    [...codeBlocksMap.keys()].forEach(id => {
      if (!currentIds.has(id)) {
        const root = codeBlocksMap.get(id);
        if (root) {
          root.unmount();
          codeBlocksMap.delete(id);
        }
      }
    });

    Array.from(codeBlocks).forEach(block => {
      const blockId = block.id;
      const codePreview = block.querySelector('.code-preview');

      if (codePreview && blockId) {
        const language = codePreview.getAttribute('data-language') || 'text';
        const escapedCode = codePreview.getAttribute('data-code') || '';
        const code = unescapeHtml(escapedCode);

        let root = codeBlocksMap.get(blockId);
        if (!root) {
          root = ReactDOM.createRoot(block);
          codeBlocksMap.set(blockId, root);
        }

        root.render(
          <CodeBlockPreview
            code={code}
            language={language}
            onEdit={() => {
              const newCode = prompt('Edit code:', code);
              if (newCode !== null) {
                const escapedNewCode = escapeHtml(newCode);
                codePreview.setAttribute('data-code', escapedNewCode);
                root?.render(
                  <CodeBlockPreview
                    code={newCode}
                    language={language}
                    onEdit={() => { }}
                  />
                );
                if (editorRef.current) {
                  contentRef.current = editorRef.current.innerHTML;
                }
              }
            }}
          />
        );
      }
    });
  }, [codeBlocksMap]);

  const handleInput = useCallback(() => {
    if (!editorRef.current || isProcessingRef.current) return;
    contentRef.current = editorRef.current.innerHTML;
  }, []);

  const handleBlur = useCallback(() => {
    if (contentRef.current !== debouncedContentRef.current) {
      setContent(contentRef.current);
      debouncedContentRef.current = contentRef.current;
    }
  }, [setContent]);

  useEffect(() => {
    if (!editorRef.current || isProcessingRef.current) return;

    const processedContent = convertMarkdownToCodeBlock(content);
    if (processedContent !== editorRef.current.innerHTML) {
      isProcessingRef.current = true;
      editorRef.current.innerHTML = processedContent;
      renderCodeBlocks();
      contentRef.current = editorRef.current.innerHTML;
      debouncedContentRef.current = contentRef.current;
      isProcessingRef.current = false;
    }
  }, [content, convertMarkdownToCodeBlock, renderCodeBlocks]);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.addEventListener('keydown', handleKeyDown);
    editorRef.current.addEventListener('blur', handleBlur);

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('keydown', handleKeyDown);
        editorRef.current.removeEventListener('blur', handleBlur);
        codeBlocksMap.forEach(root => root.unmount());
        codeBlocksMap.clear();
      }
    };
  }, [handleKeyDown, handleBlur, codeBlocksMap]);

  const convertMarkdownToAlertBlock = useCallback((content: string) => {
    const alertBlockRegex = /:::(tip|info|warning|danger|caution)\s+([\s\S]*?):::/g;
    let html = content;
    let match;

    while ((match = alertBlockRegex.exec(content)) !== null) {
      const [fullMatch, type, text] = match;
      const blockId = `alert-block-${Math.random().toString(36).slice(2, 9)}`;
      const alertBlockHtml = `<div class="alert-block-wrapper my-2" contenteditable="false" id="${blockId}"><div class="alert-preview" data-type="${type}" data-content="${escapeHtml(text.trim())}"></div></div>`;
      html = html.replace(fullMatch, alertBlockHtml);
    }
    return html;
  }, []);

  const renderAlertBlocks = useCallback(() => {
    if (!editorRef.current) return;

    const alertBlocks = editorRef.current.getElementsByClassName('alert-block-wrapper');
    const currentIds = new Set([...alertBlocks].map(block => block.id));

    // Cleanup old roots
    [...codeBlocksMap.keys()].forEach(id => {
      if (!currentIds.has(id)) {
        const root = codeBlocksMap.get(id);
        if (root) {
          root.unmount();
          codeBlocksMap.delete(id);
        }
      }
    });

    // Only create roots for new blocks
    Array.from(alertBlocks).forEach(block => {
      const blockId = block.id;
      if (!codeBlocksMap.has(blockId)) {
        const alertPreview = block.querySelector('.alert-preview');

        if (alertPreview && blockId) {
          const type = alertPreview.getAttribute('data-type') || 'tip';
          const escapedContent = alertPreview.getAttribute('data-content') || '';
          const content = unescapeHtml(escapedContent);

          const root = ReactDOM.createRoot(block);
          codeBlocksMap.set(blockId, root);

          const handleEdit = (newContent: string) => {
            if (newContent !== content) {
              alertPreview.setAttribute('data-content', escapeHtml(newContent));
              if (editorRef.current) {
                contentRef.current = editorRef.current.innerHTML;
                handleInput();
              }
            }
          };

          root.render(
            <AlertBlockPreview
              key={blockId}
              content={content}
              type={type}
              onEdit={handleEdit}
            />
          );
        }
      }
    });
  }, [codeBlocksMap, handleInput]);

  useEffect(() => {
    if (!editorRef.current || isProcessingRef.current) return;

    const processedContent = convertMarkdownToCodeBlock(convertMarkdownToAlertBlock(content));
    if (processedContent !== editorRef.current.innerHTML) {
      isProcessingRef.current = true;
      editorRef.current.innerHTML = processedContent;
      renderCodeBlocks();
      renderAlertBlocks();
      contentRef.current = editorRef.current.innerHTML;
      debouncedContentRef.current = contentRef.current;
      isProcessingRef.current = false;
    }
  }, [content, convertMarkdownToCodeBlock, convertMarkdownToAlertBlock, renderCodeBlocks, renderAlertBlocks]);

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      className={cn(
        "w-full min-h-[200px] p-4 focus:outline-none",
        "overflow-y-auto whitespace-pre-wrap",
        "prose prose-sm max-w-none"
      )}
      suppressContentEditableWarning={true}
    />
  );
};

export default Content;