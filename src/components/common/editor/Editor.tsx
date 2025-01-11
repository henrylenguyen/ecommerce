"use client"
import { cn } from "@/utils";
import React from 'react';
import Content from "./content";
import { EditorProvider } from "./context/EditorContext";
import { htmlToMarkdown } from "./utils";
import Toolbar from "./Toolbar";

interface EditorProps {
  onChange?: (markdown: string, html: string) => void;
  initialValue?: string;
  className?: string;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialValue = '',
  className
}) => {
  const handleContentChange = (html: string) => {
    console.log("html:", html)
    if (onChange) {
      const markdown = htmlToMarkdown(html);
      onChange(markdown, html);
    }
  };
  
  return (
    <EditorProvider initialValue={initialValue} onChange={handleContentChange}>
      <div className={cn('border rounded-lg', className)}>
        <Toolbar />
        <Content />
      </div>
    </EditorProvider>
  );
};

export default Editor;