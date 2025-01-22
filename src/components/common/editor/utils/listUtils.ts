// listUtils.ts

export const LIST_MARKERS = {
  unordered: ['-', '*', '+'],
  ordered: {
    decimal: /^\d+\.\s$/,
    lowerAlpha: /^[a-z]\.\s$/,
    upperAlpha: /^[A-Z]\.\s$/,
    lowerRoman: /^[ivxlcdm]+\.\s$/i
  }
};

export interface ListConversionResult {
  shouldConvert: boolean;
  listType: 'ordered' | 'unordered';
  listStyle: string;
  text: string;
}

export const checkForListMarker = (text: string): { shouldConvert: boolean; listType: 'ordered' | 'unordered'; listStyle: string } | null => {
  // Trim whitespace
  const trimmedText = text.trim();

  // Check for unordered list markers
  if (trimmedText === '-' || trimmedText === '*' || trimmedText === '+') {
    return {
      shouldConvert: true,
      listType: 'unordered',
      listStyle: 'disc'
    };
  }

  // Check for ordered list markers (e.g., "1.", "1)", "(1)")
  const orderedListRegex = /^(\d+)[.)]$/;
  if (orderedListRegex.test(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'ordered',
      listStyle: 'decimal'
    };
  }

  return null;
};

export const createList = (doc: Document, type: 'ordered' | 'unordered', style: string): HTMLElement => {
  const list = doc.createElement(type === 'ordered' ? 'ol' : 'ul');
  list.style.listStyleType = style;
  const li = doc.createElement('li');
  list.appendChild(li);
  return list;
};

export const isInsideList = (node: Node | null): boolean => {
  if (!node) return false;
  let current = node;
  while (current && current.parentNode) {
    if (current.nodeName === 'UL' || current.nodeName === 'OL') {
      return true;
    }
    current = current.parentNode;
  }
  return false;
};

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