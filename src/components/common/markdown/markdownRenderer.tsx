import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import AlertContainer, { remarkAlertDirective } from './alertBlock';
import CodeBlock from './codeblock/codeBlock';
import { schema } from './interface';
import MarkdownComponent from './markdownComponent';
import MermaidComponent from './mermaid';


interface MarkdownRendererProps {
  children: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  const components = {
    ...MarkdownComponent,
    div: ({ className, children }: { className?: string, children?: React.ReactNode }) => {
      const type = className?.split(' ')[1]
      if (className?.split(' ')[0] === 'alert-block' && type) {
        return <AlertContainer type={type}>{children}</AlertContainer>;
      }
      return <div className={className} >{children}</div>;
    },
    code: ({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      if (language === 'mermaid') {
        return <MermaidComponent chart={String(children).trim()} />;
      }

      return <CodeBlock inline={inline} className={className} {...props}>{children}</CodeBlock>;
    }
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
          remarkAlertDirective,
          remarkDirective,
          [remarkEmoji, { emoticon: true }],
          [remarkToc, { heading: "mục lục", tight: true }]
        ]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, {
            ...schema,
            attributes: {
              ...schema.attributes,
              div: [...(schema.attributes.div || []), 'data-alert-type']
            }
          }],
          [rehypeKatex, { strict: false }]
        ]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};


export default MarkdownRenderer;