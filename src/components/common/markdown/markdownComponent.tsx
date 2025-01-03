import { Components } from 'react-markdown';
import CodeBlock from './codeblock/codeBlock';

// Define custom components with TypeScript types
const MarkdownComponent: Components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: CodeBlock as any,
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 border-b pb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-bold mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic">
      {children}
    </blockquote>
  ),
};

export default MarkdownComponent;