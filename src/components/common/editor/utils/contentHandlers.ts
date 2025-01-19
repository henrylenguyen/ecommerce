// contentHandlers.ts

import { EditorState } from '@/components/common/editor/interface';
import { checkForListMarker, createList, getListLevel, isInsideList } from './listUtils';

export const handleSpaceKey = (
  e: KeyboardEvent,
  selection: Selection,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
): boolean => {
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const text = range.startContainer.textContent || '';
  const offset = range.startOffset;

  // Only check at the start of a line and not inside a list
  if (isInsideList(range.startContainer)) return false;

  const beforeSpace = text.substring(0, offset);
  const result = checkForListMarker(beforeSpace);

  if (result?.shouldConvert) {
    e.preventDefault();

    const container = range.startContainer.parentElement;
    if (!container) return false;

    // Create and insert the new list
    const list = createList(document, result.listType, result.listStyle);
    container.parentNode?.insertBefore(list, container.nextSibling);

    // Remove the original text
    if (text === beforeSpace) {
      container.remove();
    } else {
      range.startContainer.textContent = text.substring(offset);
    }

    // Update editor state
    setEditorState(prev => ({
      ...prev,
      listType: result.listType,
      listStyle: result.listStyle,
      listLevel: 0
    }));

    // Set cursor position
    const newRange = document.createRange();
    const firstLi = list.querySelector('li');
    if (firstLi) {
      newRange.setStart(firstLi, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    return true;
  }

  return false;
};

export const handleListState = (editorRef: React.RefObject<HTMLDivElement>, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  if (!editorRef.current) return;

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);
  const listElement = range.startContainer.parentElement?.closest('ul, ol');

  if (!listElement) {
    // Reset list state when not in a list
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
  const level = getListLevel(listElement);

  setEditorState(prev => ({
    ...prev,
    listType: isOrdered ? 'ordered' : 'unordered',
    listStyle: listStyle || (isOrdered ? 'decimal' : 'disc'),
    listLevel: level
  }));
};