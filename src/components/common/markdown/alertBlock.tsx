import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Lightbulb, OctagonMinus } from 'lucide-react';
import React from 'react';
import { visit } from 'unist-util-visit';

interface AlertContainerProps {
  children: React.ReactNode;
  type: string;
}

export function remarkAlertDirective() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});
        const type = node.name;

        // Change node type to prevent nesting issues
        node.type = 'element';
        data.hName = 'div';
        data.hProperties = {
          className: `alert-block ${type}`,
          'data-alert-type': type
        };

        // Ensure children are properly structured
        if (node.children) {
          node.children = node.children.map(child => {
            if (child.type === 'paragraph') {
              return {
                ...child,
                type: 'element',
                data: {
                  hName: 'div'
                }
              };
            }
            return child;
          });
        }
      }
    });
  };
}
const AlertContainer: React.FC<AlertContainerProps> = ({ type, children }) => {
  const getAlertConfig = () => {
    switch (type.toLowerCase()) {
      case 'info':
        return {
          icon: <Info className="h-5 w-5" />,
          className: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
          iconClassName: "text-blue-600 dark:text-blue-400"
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          className: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
          iconClassName: "text-green-600 dark:text-green-400"
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          className: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950",
          iconClassName: "text-yellow-600 dark:text-yellow-400"
        };
      case 'danger':
        return {
          icon: <OctagonMinus className="h-5 w-5" />,
          className: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
          iconClassName: "text-red-600 dark:text-red-400"
        };
      case 'caution':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          className: "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950",
          iconClassName: "text-orange-600 dark:text-orange-400"
        };
      case 'tip':
        return {
          icon: <Lightbulb className="h-5 w-5" />,
          className: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
          iconClassName: "text-green-600 dark:text-green-400"
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          className: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
          iconClassName: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Alert className={`my-4 flex items-start ${config.className}`}>
      <div className={config.iconClassName}>{config.icon}</div>
      <AlertDescription className="ml-2">{children}</AlertDescription>
    </Alert>
  );
};
export default AlertContainer;