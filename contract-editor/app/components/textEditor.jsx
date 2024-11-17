"use client"
import React from 'react';
import { Editor } from '@monaco-editor/react';

const TextEditor = () => {
  return (
    <div className='w-5/12 h-full border border-black'>
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme="vs-dark"
      />
    </div>
  );
};

export default TextEditor;
