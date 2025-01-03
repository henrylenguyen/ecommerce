"use client";

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Props = {
  language: string;
  children: React.ReactNode;
}

const CodeHeader = ({
  language,
  children
}: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children).trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {language.toUpperCase()}
      </span>
      <button
        onClick={handleCopy}
        className="text-sm px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
      >
        {isCopied ? (
          <>
            <Check size={16} className="text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={16} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}
export default CodeHeader;