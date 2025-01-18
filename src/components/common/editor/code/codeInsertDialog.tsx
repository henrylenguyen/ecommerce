import { insertCodeBlock } from "@/components/common/editor/utils";
import CodeBlock from '@/components/common/markdown/codeblock/codeBlock';
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Code, Eye } from 'lucide-react';
import { SetStateAction, useState } from 'react';
import { useEditor } from "../context/EditorContext";

const CodeInsertDialog = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('js');
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const { content, setContent } = useEditor();
  const CODE_LANGUAGES = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'JSX', value: 'jsx' },
    { label: 'TSX', value: 'tsx' },
    { label: 'CSS', value: 'css' },
    { label: 'HTML', value: 'html' },
    { label: 'JSON', value: 'json' },
  ];

  const handleCodeChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCode(e.target.value);
    setHasChanges(true);
  };

  const PreviewContent = () => (
    <CodeBlock className={`language-${language}`}>
      {code}
    </CodeBlock>
  );

  const handleInsert = () => {
    if (!code.trim()) return;

    const updatedContent = insertCodeBlock(content, code.trim(), language);
    setContent(updatedContent);
    setIsOpen(false);
    setCode('');
    setLanguage('js');
  };

  const resetAndClose = () => {
    setCode('');
    setLanguage('js');
    setHasChanges(false);
    setIsOpen(false);
    setShowPreviewModal(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsOpen(true);
          }
        }}
        modal={true}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            title="Insert Code"
            onClick={() => setIsOpen(true)}
          >
            <Code size={16} />
          </Button>
        </DialogTrigger>

        <DialogContent
          className="w-screen h-screen max-w-none max-h-none m-0 !rounded-none p-0"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col h-full">
            <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
              <DialogTitle>Insert Code</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <div className="mb-4">
                <Select
                  value={language}
                  onValueChange={setLanguage}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {CODE_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className={`flex-1 min-h-0 grid ${code && 'grid-cols-2'} gap-4`}>
                <div className="flex-1 min-h-0 flex flex-col">
                  <Textarea
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Paste your code here..."
                    className="flex-1 min-h-0 font-mono resize-none h-full focus-visible:ring-0 rounded-xl shadow"
                  />
                </div>

                {!isMobile && code && (
                  <div className="flex-1 min-h-0">
                    <PreviewContent />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                {isMobile && code && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPreviewModal(true)}
                    className="mr-auto"
                  >
                    <Eye size={16} className="mr-2" />
                    Preview
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => hasChanges ? setShowAlert(true) : resetAndClose()}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInsert}
                  disabled={!code.trim()}
                  variant={code.trim() ? 'primary' : 'default'}
                >
                  Insert
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal for Mobile */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none">
          <DialogHeader>
            <DialogTitle>Code Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6">
            <PreviewContent />
          </div>
          <DialogFooter className="px-6 py-4 border-t">
            <Button onClick={() => setShowPreviewModal(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard Changes Alert */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes will be lost if you close without inserting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose} className='bg-red-500 hover:bg-red-600 w-[150px]'>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CodeInsertDialog;