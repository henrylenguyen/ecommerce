"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="mermaid">
      {chart}
    </div>
  );
};

export default dynamic(() => Promise.resolve(MermaidDiagram), { ssr: false });