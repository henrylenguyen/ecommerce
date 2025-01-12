import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';

interface CodeBlockPreviewProps {
  code: string;
  language: string;
  onEdit?: () => void;
}

const LINE_LIMIT = 10;

export const CodeBlockPreview: React.FC<CodeBlockPreviewProps> = ({ code, language, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();
  const codeLines = code.split('\n');
  const shouldCollapse = codeLines.length > LINE_LIMIT;

  const displayedCode = shouldCollapse && !isExpanded
    ? codeLines.slice(0, LINE_LIMIT).join('\n')
    : code;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getTheme = () => theme === 'dark' ? dracula : oneLight;

  return (
    <Card className="my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {language.toUpperCase()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
            type='button'
          >
            {isCopied ? (
              <><Check size={16} className="text-green-500" /><span className="ml-2">Copied!</span></>
            ) : (
              <><Copy size={16} /><span className="ml-2">Copy</span></>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8"
            type='button'
          >
            <Edit size={16} /><span className="ml-2">Edit</span>
          </Button>
        </div>
      </div>
      <div className={`relative ${!isExpanded && shouldCollapse ? 'max-h-[250px] overflow-hidden' : ''}`}>
        <SyntaxHighlighter
          language={language}
          style={getTheme()}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.9rem',
            background: theme === 'dark' ? '#1a1b26' : '#ffffff',
          }}
        >
          {displayedCode}
        </SyntaxHighlighter>

        {shouldCollapse && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-2 right-2"
            type='button'
          >
            {isExpanded ? (
              <><ChevronUp size={16} /><span className="ml-2">Collapse</span></>
            ) : (
              <><ChevronDown size={16} /><span className="ml-2">Expand {codeLines.length} lines</span></>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};