import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import TurndownService from 'turndown';
import { unified } from 'unified';

// Custom turndown service configuration
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  bulletListMarker: '-',
  strongDelimiter: '**',
  br: '\n',
  blankReplacement: function (content, node) {
    return node.isBlock ? '\n\n' : '';
  }
});

// Helper function to preserve code blocks before markdown conversion
function preserveCodeBlocks(html: string): { html: string; blocks: Array<{ id: string, code: string }> } {
  const blocks: Array<{ id: string, code: string }> = [];
  let modifiedHtml = html;

  // Find and preserve code blocks
  const codeBlockRegex = /<div class="code-preview" data-language="(.*?)" data-code="(.*?)">/g;
  modifiedHtml = modifiedHtml.replace(codeBlockRegex, (match, language, code) => {
    const id = `CODE_BLOCK_${blocks.length}`;
    blocks.push({
      id,
      code: `\`\`\`${language}\n${unescapeHtml(code)}\n\`\`\``
    });
    return `<div>${id}</div>`;
  });

  return { html: modifiedHtml, blocks };
}

// Helper function to restore code blocks after markdown conversion
function restoreCodeBlocks(markdown: string, blocks: Array<{ id: string, code: string }>): string {
  let result = markdown;
  blocks.forEach(block => {
    result = result.replace(block.id, block.code);
  });
  return result;
}

// Clean UI elements text before conversion
function cleanHtml(html: string): string {
  return html
    .replace(/<button[^>]*>.*?<\/button>/g, '') // Remove buttons
    .replace(/(Copy|Edit|Expand \d+ lines)/g, '') // Remove UI text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';

  // First preserve code blocks
  const { html: processedHtml, blocks } = preserveCodeBlocks(html);

  // Clean the HTML
  const cleanedHtml = cleanHtml(processedHtml);

  // Convert to markdown
  let markdown = turndownService.turndown(cleanedHtml);

  // Restore code blocks
  markdown = restoreCodeBlocks(markdown, blocks);

  // Fix any double newlines around code blocks
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown.trim();
};

// Helper function to escape HTML entities in code
export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Helper function to unescape HTML entities in code
export const unescapeHtml = (safe: string) => {
  return safe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'");
};

export const insertCodeBlock = (markdown: string, code: string, language: string): string => {
  const spacing = markdown.endsWith('\n\n') ? '' : '\n\n';
  return `${markdown}${spacing}\`\`\`${language}\n${code}\n\`\`\`\n`;
};

// Inline style utilities
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

export const parseMarkdown = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify)
    .process(markdown);

  return String(result);
};

export const findCodeBlocks = (markdown: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string; position: number }> = [];

  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      position: match.index
    });
  }

  return blocks;
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