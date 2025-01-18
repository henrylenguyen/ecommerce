import { IconCodeBlock } from '@/assets/images/icons';
import AlertBlockDialog from '@/components/common/editor/alert/alertBlockDialog';
import CodeInsertDialog from '@/components/common/editor/code/codeInsertDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold, Italic,
  List, ListOrdered,
  Quote,
  Strikethrough,
  Type,
  Underline
} from 'lucide-react';
import React, { useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import {
  CODE_BLOCK_STYLES,
  HEADING_STYLES,
  KEYBOARD_SHORTCUTS,
  LIST_STYLES
} from './constants';
import { useEditor } from './context/EditorContext';

const Toolbar = () => {
  const { executeCommand, editorRef, setContent, content } = useEditor();
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState("#000000");

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && KEYBOARD_SHORTCUTS[e.key as keyof typeof KEYBOARD_SHORTCUTS]) {
        e.preventDefault();
        executeCommand(KEYBOARD_SHORTCUTS[e.key as keyof typeof KEYBOARD_SHORTCUTS]);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [executeCommand]);

  const handleHeadingChange = (tag: string) => {
    // Fix for formatBlock command
    const blockTag = `<${tag}>`;
    executeCommand('formatBlock', blockTag);
  };

  const handleListStyle = (listType: 'ordered' | 'unordered', style: string) => {
    // Fix for list styling
    if (listType === 'ordered') {
      document.execCommand('insertOrderedList', false);
      const list = editorRef.current?.querySelector('ol');
      if (list) {
        list.style.listStyleType = style;
      }
    } else {
      document.execCommand('insertUnorderedList', false);
      const list = editorRef.current?.querySelector('ul');
      if (list) {
        list.style.listStyleType = style;
      }
    }
  };


  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    executeCommand('foreColor', color);
    setColorPickerOpen(false);
  };

  const handleAlertInsert = (type: string) => {
    // Add a single newline if content doesn't end with one
    const prefix = content.endsWith('\n') ? '' : '\n';
    const alertBlock = `${prefix}:::${type}
Click to edit this ${type} message
:::
`; // Single newline after closing tag
    const updatedContent = content + alertBlock;
    setContent(updatedContent);
  };

  return (
    <div className="border-b p-2 flex gap-1 flex-wrap items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2" type="button">
            <Type size={16} className="mr-1" />
            Paragraph
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(HEADING_STYLES).map(([tag, style]) => (
            <DropdownMenuItem
              key={tag}
              onClick={() => handleHeadingChange(tag)}
              className={style.className}
            >
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('bold')}
        type="button"
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('italic')}
        type="button"
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('underline')}
        type="button"
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('strikeThrough')}
        type="button"
      >
        <Strikethrough size={16} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            <List size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-1">
            {LIST_STYLES.unordered.map((style) => (
              <Button
                key={style.value}
                variant="ghost"
                size="sm"
                onClick={() => handleListStyle('unordered', style.value)}
                className="justify-start"
                type="button"
              >
                <span className="mr-2">{style.icon}</span> {style.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            <ListOrdered size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-1">
            {LIST_STYLES.ordered.map((style) => (
              <Button
                key={style.value}
                variant="ghost"
                size="sm"
                onClick={() => handleListStyle('ordered', style.value)}
                className="justify-start"
                type="button"
              >
                <span className="mr-2">{style.icon}</span> {style.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="relative"
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={selectedColor} onChange={handleColorChange} />
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyLeft')}
        type="button"
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyCenter')}
        type="button"
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyRight')}
        type="button"
      >
        <AlignRight size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('justifyFull')}
        type="button"
      >
        <AlignJustify size={16} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => executeCommand('formatBlock', '<blockquote>')}
        type="button"
      >
        <Quote size={16} />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" type="button">
            <IconCodeBlock className='size-[16px]' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col gap-1">
            {CODE_BLOCK_STYLES.map((style) => (
              <Button
                key={style.value}
                variant="ghost"
                size="sm"
                onClick={() => handleAlertInsert(style.value)}
                className="justify-start w-full"
                type="button"
              >
                <span className="mr-2">{style.icon}</span> {style.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <CodeInsertDialog />

      {/* Other buttons remain the same */}
    </div>
  );
};

export default Toolbar;