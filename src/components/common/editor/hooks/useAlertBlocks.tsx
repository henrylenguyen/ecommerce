// src/components/editor/hooks/useAlertBlocks.ts
import AlertBlockPreview from '@/components/common/editor/alert/alertBlockPreview';
import { escapeHtml, unescapeHtml } from '@/components/common/editor/utils';
import { useCallback, useRef } from 'react';
import { Root, createRoot } from 'react-dom/client';

export const useAlertBlocks = () => {
  const alertBlocksMap = useRef(new Map<string, Root>()).current; 

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

  const renderAlertBlocks = useCallback((
    editorRef: React.RefObject<HTMLDivElement>,
    contentRef: React.MutableRefObject<string>,
    handleInput: () => void
  ) => {
    if (!editorRef.current) return;

    const alertBlocks = editorRef.current.getElementsByClassName('alert-block-wrapper');
    const currentIds = new Set([...alertBlocks].map(block => block.id));

    [...alertBlocksMap.keys()].forEach(id => {
      if (!currentIds.has(id)) {
        const root = alertBlocksMap.get(id);
        if (root) {
          root.unmount();
          alertBlocksMap.delete(id);
        }
      }
    });

    Array.from(alertBlocks).forEach(block => {
      const blockId = block.id;
      if (!alertBlocksMap.has(blockId)) {
        const alertPreview = block.querySelector('.alert-preview');

        if (alertPreview && blockId) {
          const type = alertPreview.getAttribute('data-type') || 'tip';
          const escapedContent = alertPreview.getAttribute('data-content') || '';
          const content = unescapeHtml(escapedContent);

          const root = createRoot(block);
          alertBlocksMap.set(blockId, root);

          root.render(
            <AlertBlockPreview
              key={blockId}
              content={content}
              type={type as 'tip' | 'info' | 'warning' | 'danger' | 'caution'}
              onEdit={(newContent) => {
                if (newContent !== content) {
                  alertPreview.setAttribute('data-content', escapeHtml(newContent));
                  if (editorRef.current) {
                    contentRef.current = editorRef.current.innerHTML;
                    handleInput();
                  }
                }
              }}
            />
          );
        }
      }
    });
  }, [alertBlocksMap]);

  return {
    convertMarkdownToAlertBlock,
    renderAlertBlocks
  };
};