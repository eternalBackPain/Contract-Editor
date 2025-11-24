//TODO: HANDLE ONCHANGE

import React, { useEffect, useRef } from 'react';
import { monaco } from '../monaco';

function MonacoEditor() {
  // This ref will point to a normal <div> in the DOM
  const containerRef = useRef(null);
  // We'll store the editor instance here so we can clean it up later
  const editorRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the Monaco editor inside the <div> referenced by containerRef
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: "Insert your text here",
      language: 'plaintext',
      automaticLayout: true, // makes it resize when the container size changes
      wordWrap: 'on',
      minimap: {enabled: false}
    });

    // Cleanup function: React will call this when the component unmounts
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []); // empty array = run once when component mounts

  // This <div> is where Monaco will render the editor.
  // Make sure it has a size (width/height) or you'll see nothing.
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default MonacoEditor;
