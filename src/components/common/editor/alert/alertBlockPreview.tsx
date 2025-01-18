import React, { useRef, useCallback, useState, useEffect } from 'react';
import AlertContainer from '@/components/common/markdown/alertBlock';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Link,
  Type,
  Check,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HEADING_STYLES } from '../constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/utils';

interface AlertBlockPreviewProps {
  content: string;
  type: string;
  onEdit?: (newContent: string) => void;
}

const AlertBlockPreview: React.FC<AlertBlockPreviewProps> = ({
  content: initialContent,
  type,
  onEdit
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);

  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const executeCommand = useCallback((command: string, value?: string) => {
    if (contentEditableRef.current) {
      document.execCommand(command, false, value);
      contentEditableRef.current.focus();
      setEditedContent(contentEditableRef.current.innerHTML);
    }
  }, []);

  const handleContentChange = useCallback(() => {
    if (contentEditableRef.current) {
      setEditedContent(contentEditableRef.current.innerHTML);
    }
  }, []);

  const handleSave = () => {
    if (onEdit && editedContent !== initialContent) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(initialContent);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = initialContent;
    }
    setIsEditing(false);
  };

  const handleHeadingChange = useCallback((tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  }, [executeCommand]);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    executeCommand('foreColor', color);
    setColorPickerOpen(false);
  }, [executeCommand]);

  const handleListStyle = useCallback((listType: 'ordered' | 'unordered', style: string) => {
    if (listType === 'ordered') {
      executeCommand('insertOrderedList');
    } else {
      executeCommand('insertUnorderedList');
    }

    if (contentEditableRef.current) {
      const list = contentEditableRef.current.querySelector(listType === 'ordered' ? 'ol' : 'ul');
      if (list) {
        list.style.listStyleType = style;
      }
    }
  }, [executeCommand]);

  const handleImageInsert = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  }, [executeCommand]);

  const handleLinkInsert = useCallback(() => {
    const url = prompt('Enter link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      setIsEditing(true);
      // Prevent immediate content editing when first clicking to enter edit mode
      e.preventDefault();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="group relative rounded-md transition-all duration-200">
          <div
            className={cn(
              "cursor-pointer transition-all duration-200",
              !isEditing && "hover:ring-2 hover:ring-offset-2 hover:ring-gray-200 dark:hover:ring-gray-700 rounded-lg"
            )}
            onClick={handleContainerClick}
          >
            <AlertContainer type={type}>
              <div
                ref={contentEditableRef}
                contentEditable={isEditing}
                onInput={handleContentChange}
                className={cn(
                  "break-words relative min-h-[24px] w-full",
                  isEditing ? "cursor-text focus:outline-none" : "cursor-pointer"
                )}
                dangerouslySetInnerHTML={{ __html: editedContent }}
                suppressContentEditableWarning
              />

              {!isEditing && (
                <div className="absolute -top-5 inset-0 flex  justify-center">
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-60 transition-opacity duration-200 pointer-events-none">
                    Click to edit
                  </span>
                </div>
              )}
            </AlertContainer>
          </div>

          {isEditing && (
            <div className="absolute -top-5 right-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 shadow hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleSave}
                title="Save changes"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 shadow  hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleCancel}
                title="Cancel changes"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      {isEditing && (
        <ContextMenuContent className="w-64">
          <ContextMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Type size={16} className="mr-2" />
                  Heading
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
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => executeCommand('bold')}>
            <Bold size={16} className="mr-2" /> Bold
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('italic')}>
            <Italic size={16} className="mr-2" /> Italic
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('underline')}>
            <Underline size={16} className="mr-2" /> Underline
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('strikeThrough')}>
            <Strikethrough size={16} className="mr-2" /> Strikethrough
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: selectedColor }}
                  />
                  Text Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={selectedColor} onChange={handleColorChange} />
              </PopoverContent>
            </Popover>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => executeCommand('justifyLeft')}>
            <AlignLeft size={16} className="mr-2" /> Align Left
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('justifyCenter')}>
            <AlignCenter size={16} className="mr-2" /> Align Center
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('justifyRight')}>
            <AlignRight size={16} className="mr-2" /> Align Right
          </ContextMenuItem>
          <ContextMenuItem onClick={() => executeCommand('justifyFull')}>
            <AlignJustify size={16} className="mr-2" /> Justify
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <List size={16} className="mr-2" /> Bullet List
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleListStyle('unordered', 'disc')}>
                  • Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleListStyle('unordered', 'circle')}>
                  ○ Circle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleListStyle('unordered', 'square')}>
                  ■ Square
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ContextMenuItem>

          <ContextMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ListOrdered size={16} className="mr-2" /> Numbered List
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleListStyle('ordered', 'decimal')}>
                  1. Numbers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleListStyle('ordered', 'lower-alpha')}>
                  a. Lowercase
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleListStyle('ordered', 'upper-alpha')}>
                  A. Uppercase
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleListStyle('ordered', 'lower-roman')}>
                  i. Roman
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onClick={handleImageInsert}>
            <Image size={16} className="mr-2" /> Insert Image
          </ContextMenuItem>
          <ContextMenuItem onClick={handleLinkInsert}>
            <Link size={16} className="mr-2" /> Insert Link
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default AlertBlockPreview;