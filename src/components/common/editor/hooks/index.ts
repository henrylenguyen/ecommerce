import { useState } from 'react';

export const useEditorState = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const saveState = (content: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, content]);
    setCurrentIndex(newHistory.length);
  };

  const undo = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const redo = () => currentIndex < history.length - 1 && setCurrentIndex(currentIndex + 1);

  return { saveState, undo, redo };
};
