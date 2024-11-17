"use client";
import React from "react";
import { Editor } from "@monaco-editor/react"; //see https://github.com/suren-atoyan/monaco-react

const TextEditor = ({ handleEditorChange }) => {
  return (
    <div className="w-5/12 h-full">
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme="light"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default TextEditor;
