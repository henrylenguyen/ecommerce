// src/components/editor/hooks/useAlertTypeCompletion.ts
import { useCallback, useState, useEffect } from 'react';
import { useEditor } from '../context/EditorContext';

export const useAlertTypeCompletion = () => {
  const { setContent } = useEditor();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [currentRange, setCurrentRange] = useState<Range | null>(null);
  const [triggerNode, setTriggerNode] = useState<Node | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showTypeDropdown) {
        setShowTypeDropdown(false);
        setCurrentRange(null);
        setTriggerNode(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTypeDropdown]);

  const handleTripleColon = useCallback((e: KeyboardEvent, selection: Selection) => {
    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent || '';
    const position = range.startOffset;

    if (text.slice(position - 3, position) === ':::' && text[position] !== ':') {
      e.preventDefault();
      const rect = range.getBoundingClientRect();
      setDropdownPosition({
        x: rect.left,
        y: rect.bottom
      });
      setCurrentRange(range.cloneRange());
      setTriggerNode(range.startContainer);
      setShowTypeDropdown(true);
      return true;
    }
    return false;
  }, []);

  const insertAlertType = useCallback((type: string, selection: Selection) => {
    if (!currentRange || !triggerNode) return;

    // Remove the trigger ':::'
    const text = triggerNode.textContent || '';
    const position = currentRange.startOffset;
    triggerNode.textContent = text.slice(0, position - 3) + text.slice(position);

    // Create the alert block wrapper
    const blockId = `alert-block-${Math.random().toString(36).slice(2, 9)}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'alert-block-wrapper my-2';
    wrapper.contentEditable = 'false';
    wrapper.id = blockId;

    // Create the alert preview
    const preview = document.createElement('div');
    preview.className = 'alert-preview';
    preview.setAttribute('data-type', type);
    preview.setAttribute('data-content', 'Enter your content here');

    wrapper.appendChild(preview);
    currentRange.insertNode(wrapper);

    // Create a new paragraph for cursor positioning
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    wrapper.parentNode?.insertBefore(p, wrapper.nextSibling);

    // Position cursor after the alert block
    const newRange = document.createRange();
    newRange.setStart(p, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    // Update content in editor context
    if (wrapper.parentElement) {
      setContent(wrapper.parentElement.innerHTML);
    }

    setShowTypeDropdown(false);
    setCurrentRange(null);
    setTriggerNode(null);
  }, [currentRange, triggerNode, setContent]);

  return {
    showTypeDropdown,
    dropdownPosition,
    handleTripleColon,
    insertAlertType,
    setShowTypeDropdown
  };
};
