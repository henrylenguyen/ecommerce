
"use client";
import { CodeBlockProps } from '@/components/common/markdown/interface';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dracula,
  oneLight
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CodeHeader from './codeHeader';

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const { theme } = useTheme();

  const getTheme = () => {
    switch (theme) {
      case 'dark':
        return dracula;
      case 'light':
        return oneLight;
      default:
        return oneLight;
    }
  };

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // Handle inline code with double backticks
  if (inline || (!language && typeof children === 'string' && !children.includes('\n'))) {
    return (
      <code className="px-1 py-0.5 mx-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm" {...props}>
        {children}
      </code>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CodeHeader language={language}>{children}</CodeHeader>
      <CardContent className="p-0">
        <div className="max-h-[460px] overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={getTheme()}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              background: theme === 'dark' ? '#1a1b26' : '#ffffff',
            }}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              textAlign: 'right',
              userSelect: 'none',
              color: theme === 'dark' ? '#4a5568' : '#a0aec0',
            }}
            {...props}
          >
            {String(children).trim()}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeBlock;