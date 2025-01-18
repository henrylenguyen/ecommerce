import { defaultSchema } from "rehype-sanitize";

// Define schema type
export interface CustomSchema {
  attributes: {
    [key: string]: string[];
  };
  protocols?: {
    [key: string]: string[];
  };
  ancestors?: {
    [key: string]: string[];
  };
  strip?: string[];
  clobber?: string[];
  clobberPrefix?: string;
  tagNames?: string[];
  allowComments?: boolean;
  allowDoctypes?: boolean;
}

// Enhanced schema with TypeScript types
export const schema: CustomSchema = {
  ...defaultSchema as CustomSchema,
  attributes: {
    ...((defaultSchema as CustomSchema).attributes || {}),
    code: ['className', 'style'],
    span: ['className', 'style'],
    div: ['className', 'style'],
  },
  tagNames: [
    ...((defaultSchema as CustomSchema).tagNames || []),
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'span', 'video', 'audio',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'strong', 'em', 'del', 'br', 'hr', 'p'
  ]
};

// Define types for CodeBlock props
export interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Define MarkdownRenderer props interface
export interface MarkdownRendererProps {
  children: string;
}
