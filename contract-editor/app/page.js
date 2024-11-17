"use client"
import DefinedTerms from "./components/definedTerms";
import LivePreview from "./components/livePreview";
import TableOfContents from "./components/tableOfContents";
import TextEditor from "./components/textEditor";
import ToolBar from "./components/toolBar";
import { useState } from "react";
import { marked } from "marked";

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [parsedHtml, setParsedHtml] = useState("");

  const handleEditorChange = (value) => {
    setMarkdownContent(value);
    // console.log(markdownContent);
    const html = marked.parse(markdownContent);
    setParsedHtml(html);
    console.log(parsedHtml)
  };

  return (
    <div className="flex flex-col flex-grow h-full">
      <ToolBar />
      <div className="flex flex-row flex-grow h-full">
        <TableOfContents />
        <TextEditor handleEditorChange={handleEditorChange}/>
        <LivePreview htmlContent={parsedHtml}/>
        <DefinedTerms />
      </div>
    </div>
  );
}
