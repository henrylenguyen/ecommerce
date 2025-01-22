import { EditorState } from "@/components/common/editor/interface";

export const getListLevel = (element: Element): number => {
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

export const updateListState = (
  selection: Selection | null,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
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
    listLevel: getListLevel(listElement)
  }));
};

// src/components/editor/utils/htmlUtils.ts
export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const unescapeHtml = (safe: string) => {
  return safe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'");
};