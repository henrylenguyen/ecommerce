import { AlertCircle, AlertTriangle, Info, Lightbulb, OctagonMinus } from "lucide-react";

export const KEYBOARD_SHORTCUTS = {
  'b': 'bold',
  'i': 'italic',
  'u': 'underline',
};

export const CODE_LANGUAGES = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'JSX', value: 'jsx' },
  { label: 'TSX', value: 'tsx' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
];

export const LIST_STYLES = {
  unordered: [
    { label: 'Default', value: 'disc', icon: '•' },
    { label: 'Circle', value: 'circle', icon: '○' },
    { label: 'Square', value: 'square', icon: '■' },
  ],
  ordered: [
    { label: 'Numbers', value: 'decimal', icon: '1.' },
    { label: 'Lowercase', value: 'lower-alpha', icon: 'a.' },
    { label: 'Roman', value: 'lower-roman', icon: 'i.' },
    { label: 'Uppercase', value: 'upper-alpha', icon: 'A.' },
  ],
};

export const HEADING_STYLES = {
  p: { label: 'Paragraph', className: 'text-base font-normal' },
  h1: { label: 'Heading 1', className: 'text-4xl font-bold' },
  h2: { label: 'Heading 2', className: 'text-3xl font-bold' },
  h3: { label: 'Heading 3', className: 'text-2xl font-bold' },
  h4: { label: 'Heading 4', className: 'text-xl font-bold' },
  h5: { label: 'Heading 5', className: 'text-lg font-bold' },
  h6: { label: 'Heading 6', className: 'text-base font-bold' },
};

export const CODE_BLOCK_STYLES = [
  {
    label: 'Tip', value: 'tip', icon: <Lightbulb className="text-green-600 dark:text-green-400 h-5 w-5" />
  },
  {
    label: 'Infor', value: 'info', icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  },
  {
    label: 'Warning', value: 'warning', icon: <AlertTriangle className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
  },
  {
    label: 'Danger', value: 'danger', icon: <OctagonMinus className="text-red-600 dark:text-red-400 h-5 w-5" />
  },
  {
    label: 'Caution', value: 'caution', icon: <AlertCircle className="text-orange-600 dark:text-orange-400 h-5 w-5" />
  },
]