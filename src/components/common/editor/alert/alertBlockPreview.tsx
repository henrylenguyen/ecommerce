// src/components/editor/components/AlertBlockPreview.tsx
import React, { useRef, useState, useLayoutEffect } from 'react';
import AlertContainer from '@/components/common/markdown/alertBlock';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertBlockPreviewProps {
  content: string;
  type: 'tip' | 'info' | 'warning' | 'danger' | 'caution';
  onEdit?: (newContent: string) => void;
}

const AlertBlockPreview: React.FC<AlertBlockPreviewProps> = ({
  content: initialContent,
  type,
  onEdit
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const savedContentRef = useRef(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useLayoutEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      const lastChild = contentEditableRef.current.lastChild;

      if (lastChild) {
        range.selectNodeContents(lastChild);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isEditing) {
      setIsEditing(true);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = savedContentRef.current;
      }
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML;
      if (newContent !== savedContentRef.current) {
        savedContentRef.current = newContent;
        if (onEdit) {
          // Trigger an input event after saving
          const inputEvent = new Event('input', { bubbles: true });
          contentEditableRef.current.dispatchEvent(inputEvent);
          onEdit(newContent);
        }
      }
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (contentEditableRef.current?.innerHTML !== savedContentRef.current) {
      setShowDiscardDialog(true);
    } else {
      exitEditMode();
    }
  };

  const discardChanges = () => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = savedContentRef.current;
    }
    exitEditMode();
  };

  const exitEditMode = () => {
    setIsEditing(false);
    setShowDiscardDialog(false);
  };

  return (
    <>
      <div className="group relative rounded-md transition-all duration-200">
        <div
          className={cn(
            "cursor-pointer transition-all duration-200",
            !isEditing && "hover:ring-2 hover:ring-offset-2 hover:ring-gray-200 dark:hover:ring-gray-700 rounded-lg"
          )}
          onClick={handleEdit}
        >
          <AlertContainer type={type}>
            <div
              ref={contentEditableRef}
              contentEditable={isEditing}
              onKeyDown={handleKeyDown}
              className={cn(
                "break-words relative min-h-[24px] whitespace-pre-wrap",
                isEditing ? "cursor-text focus:outline-none" : "cursor-pointer"
              )}
              dangerouslySetInnerHTML={{ __html: savedContentRef.current }}
              suppressContentEditableWarning
            />
          </AlertContainer>
        </div>

        {isEditing && (
          <div
            className="absolute -top-5 right-2 flex gap-2"
            onClick={e => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 shadow hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={handleSave}
              title="Save changes"
              type="button"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 shadow hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={handleCancel}
              title="Cancel changes"
              type="button"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={showDiscardDialog}
        onOpenChange={(open) => !open && setShowDiscardDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard your changes? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                discardChanges();
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AlertBlockPreview;