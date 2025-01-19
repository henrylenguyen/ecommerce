export interface EditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  listType: null | 'ordered' | 'unordered';
  listStyle: string;
  listLevel: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  currentHeading?: string;
  isQuote?: boolean;
}


export interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
  executeCommand: (command: string, value?: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  updateEditorState: () => void;
}

