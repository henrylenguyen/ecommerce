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

export const checkForListMarker = (text: string): ListConversionResult | null => {
  const trimmedText = text.trim();

  // Kiểm tra unordered list markers
  if (LIST_MARKERS.unordered.includes(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'unordered',
      listStyle: 'disc',
      text: ''
    };
  }

  // Kiểm tra ordered list markers với số (1., 2., etc)
  if (/^\d+\.$/.test(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'ordered',
      listStyle: 'decimal',
      text: ''
    };
  }

  // Kiểm tra lowercase letters (a., b., etc)
  if (/^[a-z]\.$/.test(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'ordered',
      listStyle: 'lower-alpha',
      text: ''
    };
  }

  // Kiểm tra uppercase letters (A., B., etc)
  if (/^[A-Z]\.$/.test(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'ordered',
      listStyle: 'upper-alpha',
      text: ''
    };
  }

  // Kiểm tra roman numerals (i., ii., etc)
  if (/^[ivxlcdm]+\.$/i.test(trimmedText)) {
    return {
      shouldConvert: true,
      listType: 'ordered',
      listStyle: 'lower-roman',
      text: ''
    };
  }

  return null;
};

export const createList = (
  document: Document,
  listType: 'ordered' | 'unordered',
  listStyle: string
): HTMLElement => {
  const list = document.createElement(listType === 'ordered' ? 'ol' : 'ul');
  list.style.listStyleType = listStyle;
  const item = document.createElement('li');
  item.innerHTML = '<br>';
  list.appendChild(item);
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