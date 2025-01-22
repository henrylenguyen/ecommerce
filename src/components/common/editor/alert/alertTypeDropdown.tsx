// src/components/editor/components/AlertTypeDropdown.tsx
import React, { useEffect, useRef } from 'react';
import { CODE_BLOCK_STYLES } from '../constants';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface AlertTypeDropdownProps {
  position: { x: number; y: number };
  onSelect: (type: string) => void;
  onClose: () => void;
}

export const AlertTypeDropdown: React.FC<AlertTypeDropdownProps> = ({
  position,
  onSelect,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        top: position.y,
        left: position.x
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Command>
        <CommandInput placeholder="Search alert type..." />
        <CommandEmpty>No alert type found.</CommandEmpty>
        <CommandGroup>
          {CODE_BLOCK_STYLES.map((style) => (
            <CommandItem
              key={style.value}
              onSelect={() => {
                onSelect(style.value);
              }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="flex items-center">
                {style.icon}
                <span className="ml-2">{style.label}</span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};