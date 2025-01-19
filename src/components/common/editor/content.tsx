import AlertBlockPreview from '@/components/common/editor/alert/alertBlockPreview';
import { escapeHtml, getListLevel, unescapeHtml } from '@/components/common/editor/utils';
import { checkForListMarker, createList } from '@/components/common/editor/utils/listUtils';
import { cn } from '@/utils';
import { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CodeBlockPreview } from './code/codeBlockPreview';
import { LIST_STYLES } from './constants';
import { useEditor } from './context/EditorContext';

const Content = () => {
  const { content, setContent, editorRef, updateEditorState, setEditorState } = useEditor();
  const contentRef = useRef(content);
  const isProcessingRef = useRef(false);
  const codeBlocksMap = useRef(new Map<string, ReactDOM.Root>()).current;
  const debouncedContentRef = useRef(content);

  const updateListState = useCallback(() => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const listElement = range.startContainer.parentElement?.closest('ul, ol');

    if (!listElement) {
      setEditorState(prev => ({
        ...prev,
        listType: null,
        listStyle: 'disc',
        listLevel: 0
      }));
      return;
    }

    const isOrdered = listElement.tagName.toLowerCase() === 'ol';
    const listStyle = window.getComputedStyle(listElement).listStyleType;

    setEditorState(prev => ({
      ...prev,
      listType: isOrdered ? 'ordered' : 'unordered',
      listStyle: listStyle || (isOrdered ? 'decimal' : 'disc'),
      listLevel: 0
    }));
  }, [setEditorState]);

  const handleListEnter = useCallback((e: KeyboardEvent) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.parentElement?.closest('li');

    if (!listItem) return false;

    if (listItem.textContent?.trim() === '') {
      e.preventDefault();
      const parentList = listItem.parentElement;
      if (!parentList) return false;

      const grandParentListItem = parentList.parentElement?.closest('li');

      if (grandParentListItem) {
        const nextSibling = listItem.nextElementSibling;
        if (nextSibling) {
          const fragment = document.createDocumentFragment();
          let current = nextSibling;
          while (current) {
            const next = current.nextElementSibling;
            fragment.appendChild(current);
            current = next;
          }
          if (grandParentListItem.parentNode) {
            grandParentListItem.parentNode.insertBefore(fragment, grandParentListItem.nextSibling);
          }
        }
        listItem.remove();
        if (!parentList.children.length) {
          parentList.remove();
        }
        return true;
      }

      const paragraph = document.createElement('p');
      paragraph.innerHTML = '<br>';
      parentList.parentNode?.insertBefore(paragraph, parentList.nextSibling);
      listItem.remove();

      if (!parentList.children.length) {
        parentList.remove();
      }

      const newRange = document.createRange();
      newRange.setStart(paragraph, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      setEditorState(prev => ({
        ...prev,
        listType: null,
        listStyle: 'disc',
        listLevel: 0
      }));

      return true;
    }

    return false;
  }, [setEditorState]);

  const handleListMarkers = useCallback((e: KeyboardEvent) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return false;

    let range = selection.getRangeAt(0);
    let container = range.startContainer;
    let text = container.textContent || '';
    let offset = range.startOffset;

    // Handle case when editor is empty or first typing
    if (container === editorRef.current || container.nodeType !== Node.TEXT_NODE) {
      // Nếu editor rỗng và gõ "-"
      if (e.key === '-') {
        const p = document.createElement('p');
        const textNode = document.createTextNode('-');
        p.appendChild(textNode);

        if (editorRef.current) {
          if (!editorRef.current.firstChild) {
            editorRef.current.appendChild(p);
          } else {
            editorRef.current.replaceChild(p, editorRef.current.firstChild);
          }
        }

        range = document.createRange();
        range.setStart(textNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        container = textNode;
        text = '-';
        offset = 1;
      }
      return false;
    }

    // Get containing block element
    const blockContainer = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as Element;

    if (!blockContainer) return false;

    // Check if we're in a list already
    if (blockContainer.closest('ul, ol')) return false;

    // Nếu nhấn space, kiểm tra text trước đó
    if (e.key === ' ') {
      const beforeSpace = text.substring(0, offset);
      const result = checkForListMarker(beforeSpace);

      if (result?.shouldConvert) {
        e.preventDefault();

        // Create new list
        const list = createList(document, result.listType, result.listStyle);
        const firstLi = list.querySelector('li');
        if (firstLi) {
          firstLi.textContent = '\u200B';
        }

        // Insert list
        blockContainer.replaceWith(list);

        // Update editor state
        setEditorState(prev => ({
          ...prev,
          listType: result.listType,
          listStyle: result.listStyle,
          listLevel: 0
        }));

        // Set cursor position
        const newRange = document.createRange();
        if (firstLi) {
          newRange.setStart(firstLi, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        return true;
      }
    }

    return false;
  }, [editorRef, setEditorState]);

  const handleTab = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const listItem = selection.anchorNode?.parentElement?.closest('li');
    if (!listItem) return;

    const parentList = listItem.parentElement;
    if (!parentList) return;

    const currentLevel = getListLevel(parentList);
    const maxLevel = parentList.tagName.toLowerCase() === 'ol' ? 4 : 3;

    if (e.shiftKey) {
      // Shift+Tab: Move back to parent level
      const grandParentListItem = parentList.parentElement?.closest('li');
      if (grandParentListItem?.parentElement) {
        setEditorState(prev => ({
          ...prev,
          listLevel: Math.max(0, prev.listLevel - 1),
          listStyle: grandParentListItem.parentElement?.style.listStyleType || LIST_STYLES.unordered[0].value
        }));
      }
    } else if (currentLevel < maxLevel) {
      // Tab: Create or move to nested list if not at max level
      const prevListItem = listItem.previousElementSibling;
      if (prevListItem) {
        let targetList = prevListItem.querySelector(parentList.tagName.toLowerCase()) as HTMLElement;
        if (!targetList) {
          // Create new sublist with different style
          targetList = document.createElement(parentList.tagName.toLowerCase());
          const styles = parentList.tagName.toLowerCase() === 'ol'
            ? LIST_STYLES.ordered
            : LIST_STYLES.unordered;
          const currentStyleIndex = styles.findIndex(
            style => style.value === parentList.style.listStyleType
          );
          const nextStyleIndex = (currentStyleIndex + 1) % styles.length;
          const newStyle = styles[nextStyleIndex].value;
          targetList.style.listStyleType = newStyle;
          prevListItem.appendChild(targetList);

          setEditorState(prev => ({
            ...prev,
            listLevel: prev.listLevel + 1,
            listStyle: newStyle
          }));
        }
        targetList.appendChild(listItem);
      }
    }

    updateEditorState();
  }, [updateEditorState, setEditorState]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!editorRef.current) return;

    if (e.key === 'Tab') {
      handleTab(e);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      if (handleListEnter(e)) return;
    }

    if (e.key === ' ') {
      if (handleListMarkers(e)) return;
    }

    setTimeout(updateEditorState, 0);
  }, [handleListEnter, handleListMarkers, handleTab, updateEditorState]);


  const handleInput = useCallback(() => {
    if (!editorRef.current || isProcessingRef.current) return;
    contentRef.current = editorRef.current.innerHTML;
    updateEditorState();
    updateListState();
  }, [updateEditorState, updateListState]);


  const handleBlur = useCallback(() => {
    if (contentRef.current !== debouncedContentRef.current) {
      setContent(contentRef.current);
      debouncedContentRef.current = contentRef.current;
    }
  }, [setContent]);

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

    [...codeBlocksMap.keys()].forEach(id => {
      if (!currentIds.has(id)) {
        const root = codeBlocksMap.get(id);
        if (root) {
          root.unmount();
          codeBlocksMap.delete(id);
        }
      }
    });

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
              type={type as 'tip' | 'info' | 'warning' | 'danger' | 'caution'}
              onEdit={handleEdit}
            />
          );
        }
      }
    });
  }, [codeBlocksMap, handleInput, editorRef]);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.addEventListener('keydown', handleKeyDown);
    editorRef.current.addEventListener('blur', handleBlur);

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('keydown', handleKeyDown);
        editorRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, [handleKeyDown, handleBlur]);

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

  useEffect(() => {
    if (editorRef.current && !editorRef.current.firstChild) {
      const p = document.createElement('p');
      const textNode = document.createTextNode('\u200B');
      p.appendChild(textNode);
      editorRef.current.appendChild(p);
    }
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      role="textbox"
      aria-multiline="true"
      tabIndex={0}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
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