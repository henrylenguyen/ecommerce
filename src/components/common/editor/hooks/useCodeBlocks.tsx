// src/components/editor/hooks/useCodeBlocks.ts
import { CodeBlockPreview } from '@/components/common/editor/code/codeBlockPreview';
import { escapeHtml, unescapeHtml } from '@/components/common/editor/utils';
import { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

export const useCodeBlocks = () => {
  const codeBlocksMap = useRef(new Map<string, ReactDOM.Root>()).current;

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

  const renderCodeBlocks = useCallback((editorRef: React.RefObject<HTMLDivElement>, contentRef: React.MutableRefObject<string>) => {
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

  return {
    convertMarkdownToCodeBlock,
    renderCodeBlocks
  };
};