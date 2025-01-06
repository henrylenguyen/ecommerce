import { cn } from '@/utils';
import { useEditor } from './context/EditorContext';

const Content = () => {
  const { setContent, editorRef } = useEditor();

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      className={cn(
        "w-full min-h-[200px] p-4 focus:outline-none",
        "overflow-y-auto whitespace-pre-wrap",
        "prose prose-sm max-w-none"
      )}
      suppressContentEditableWarning={true}
    />
  );
};

export default Content;