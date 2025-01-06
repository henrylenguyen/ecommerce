import TurndownService from 'turndown';

export const applyInlineStyle = (
  content: string,
  start: number,
  end: number,
  style: string
) => {
  const selection = content.substring(start, end);
  const before = content.substring(0, start);
  const after = content.substring(end);

  switch (style) {
    case 'bold':
      return `${before}<strong>${selection}</strong>${after}`;
    case 'italic':
      return `${before}<em>${selection}</em>${after}`;
    default:
      return content;
  }
};

export const applyAlignment = (
  content: string,
  start: number,
  end: number,
  alignment: 'left' | 'center' | 'right' | 'justify'
) => {
  const selection = content.substring(start, end);
  return `${content.substring(0, start)}<div style="text-align: ${alignment}">${selection}</div>${content.substring(end)}`;
};

export const applyList = (
  content: string,
  start: number,
  end: number,
  type: 'ordered' | 'unordered',
  style: string = 'default'
) => {
  const selection = content.substring(start, end);
  const lines = selection.split('\n');

  const listType = type === 'ordered' ? 'ol' : 'ul';
  const listStyle = style !== 'default' ? ` style="list-style-type: ${style}"` : '';

  const formattedLines = lines
    .filter(line => line.trim())
    .map(line => `  <li>${line}</li>`)
    .join('\n');

  return `${content.substring(0, start)}<${listType}${listStyle}>\n${formattedLines}\n</${listType}>${content.substring(end)}`;
};

export const insertLink = (content: string, start: number, end: number, url: string) => {
  const selection = content.substring(start, end);
  return `${content.substring(0, start)}<a href="${url}">${selection || url}</a>${content.substring(end)}`;
};

export const insertImage = (content: string, position: number, src: string, alt: string) => {
  return `${content.substring(0, position)}<img src="${src}" alt="${alt}" />${content.substring(position)}`;
};

export const insertTable = (
  content: string,
  position: number,
  rows: number,
  cols: number
) => {
  let table = '<table border="1">\n';
  for (let i = 0; i < rows; i++) {
    table += '  <tr>\n';
    for (let j = 0; j < cols; j++) {
      table += '    <td>Cell</td>\n';
    }
    table += '  </tr>\n';
  }
  table += '</table>';
  return `${content.substring(0, position)}${table}${content.substring(position)}`;
};



const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});

export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';
  return turndownService.turndown(html);
};