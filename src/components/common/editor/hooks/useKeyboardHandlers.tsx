// src/components/editor/hooks/useKeyboardHandlers.ts
import { useCallback } from 'react';
import { EditorState } from '../interfaces/editor';
import { checkForListMarker, createList } from '../utils/listUtils';
import { LIST_STYLES } from '../constants';
import { getListLevel } from '../utils/editorUtils';

interface KeyboardHandlersProps {
  editorRef: React.RefObject<HTMLDivElement>;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  updateEditorState: () => void;
  handleTripleColon?: (e: KeyboardEvent, selection: Selection) => boolean;
}

export const useKeyboardHandlers = ({
  editorRef,
  setEditorState,
  updateEditorState,
  handleTripleColon
}: KeyboardHandlersProps) => {
  const handleBlockquoteEnter = useCallback((
    selection: Selection,
    range: Range,
    blockquote: Element
  ): boolean => {
    const currentNode = range.startContainer;
    const currentText = currentNode.textContent || '';
    const isAtEnd = range.startOffset === currentText.length;
    const currentLine = currentNode.textContent?.trim() === '';

    if (currentLine && isAtEnd) {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      blockquote.parentNode?.insertBefore(p, blockquote.nextSibling);
      if (currentNode.parentElement?.tagName === 'P') {
        currentNode.parentElement.remove();
      } else {
        currentNode.textContent = '';
      }
      if (blockquote.textContent?.trim() === '') {
        blockquote.remove();
      }

      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      setEditorState(prev => ({
        ...prev,
        isQuote: false
      }));

      return true;
    } else {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      const currentP = range.startContainer.parentElement?.closest('p');
      if (currentP) {
        currentP.parentNode?.insertBefore(p, currentP.nextSibling);
      } else {
        blockquote.appendChild(p);
      }

      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      return true;
    }
  }, [setEditorState]);

  const handleListEnter = useCallback((e: KeyboardEvent): boolean => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return false;

    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.parentElement?.closest('li');

    if (!listItem) return false;

    if (listItem.textContent?.trim() === '') {
      e.preventDefault();
      const parentList = listItem.parentElement;
      if (!parentList) return false;

      const grandParentListItem = parentList.parentElement?.closest('li');

      if (grandParentListItem) {
        // Handle nested list exit
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

    if (e.key === 'Enter') {
      e.preventDefault();
      const nextListItem = listItem.nextElementSibling;

      if (nextListItem && nextListItem.textContent?.trim() === '') {
        // Remove empty list items
        listItem.remove();
        nextListItem.remove();
        if (!listItem.parentElement?.children.length) {
          listItem.parentElement.remove();
        }
        return true;
      } else {
        // Create new list item
        const newListItem = document.createElement('li');
        newListItem.innerHTML = '<br>';
        listItem.parentElement?.appendChild(newListItem);
        const newRange = document.createRange();
        newRange.setStart(newListItem, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        return true;
      }
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

    // Handle empty editor or first character
    if (container === editorRef.current || container.nodeType !== Node.TEXT_NODE) {
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

    const blockContainer = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as Element;

    if (!blockContainer) return false;
    if (blockContainer.closest('ul, ol')) return false;

    if (e.key === ' ') {
      const beforeSpace = text.substring(0, offset);
      const result = checkForListMarker(beforeSpace);

      if (result?.shouldConvert) {
        e.preventDefault();
        const list = createList(document, result.listType, result.listStyle);
        const firstLi = list.querySelector('li');
        if (firstLi) {
          firstLi.textContent = '\u200B';
        }

        blockContainer.replaceWith(list);

        setEditorState(prev => ({
          ...prev,
          listType: result.listType,
          listStyle: result.listStyle,
          listLevel: 0
        }));

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
    const maxLevel = parentList.tagName.toLowerCase() === 'ol' ? 4 : 2;

    if (e.shiftKey) {
      // Un-indent
      const grandParentListItem = parentList.parentElement?.closest('li');
      if (grandParentListItem?.parentElement) {
        setEditorState(prev => ({
          ...prev,
          listLevel: Math.max(0, prev.listLevel - 1),
          listStyle: grandParentListItem.parentElement?.style.listStyleType || LIST_STYLES.unordered[0].value
        }));
      }
    } else if (currentLevel < maxLevel) {
      // Indent
      const prevListItem = listItem.previousElementSibling;
      if (prevListItem) {
        let targetList = prevListItem.querySelector(parentList.tagName.toLowerCase()) as HTMLElement;
        if (!targetList) {
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

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    // Check for alert type completion first
    if (handleTripleColon && handleTripleColon(e, selection)) {
      return;
    }

    if (e.key === 'Tab') {
      handleTab(e);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      const range = selection.getRangeAt(0);
      const blockquote = range.startContainer.parentElement?.closest('blockquote');

      if (blockquote) {
        e.preventDefault();
        handleBlockquoteEnter(selection, range, blockquote);
        return;
      }

      if (handleListEnter(e)) return;
    }

    if (e.key === ' ') {
      if (handleListMarkers(e)) return;
    }

    setTimeout(updateEditorState, 0);
  }, [
    editorRef,
    handleBlockquoteEnter,
    handleListEnter,
    handleListMarkers,
    handleTab,
    handleTripleColon,
    updateEditorState
  ]);

  return {
    handleKeyDown,
    handleListEnter,
    handleListMarkers,
    handleTab
  };
};

export default useKeyboardHandlers;