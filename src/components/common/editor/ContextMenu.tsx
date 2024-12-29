"use client"
import React, { useState } from 'react';

const ContextMenu: React.FC = () => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
  };

  const handleClose = () => setMenuPosition(null);

  return (
    <div onContextMenu={handleContextMenu} onClick={handleClose} style={{ position: 'relative' }}>
      {menuPosition && (
        <ul
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            backgroundColor: 'white',
            border: '1px solid gray',
            listStyle: 'none',
            padding: '5px',
          }}
        >
          <li>Copy</li>
          <li>Paste</li>
          <li>Delete</li>
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
