"use client";
import DefinedTerms from "./components/definedTerms";
import LivePreview from "./components/livePreview";
import TableOfContents from "./components/tableOfContents";
import TextEditor from "./components/textEditor";
import ToolBar from "./components/toolBar";
import { useState } from "react";

export default function Home() {
  const [textEditorContent, setTextEditorContent] = useState("");
  const [parsedTextEditorText, setParsedTextEditorText] = useState("");

  const handleTextEditorChange = async (value) => {
    setTextEditorContent(value);
    
    // 1) Log the data we’re about to send to the server
    console.log("Client: Sending to server =>", value);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });

      // 2) Expect a JSON response from the server
      const { success, data } = await response.json();
      
      // 3) Log the full JSON response from the server
      console.log("Client: Server response =>", { success, data });

      // 4) Update preview
      setParsedTextEditorText(data);

    } catch (error) {
      console.error("Error parsing text:", error);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-screen w-screen">
      <ToolBar />
      <div className="flex flex-row flex-grow h-full w-full">
        <TableOfContents />
        <TextEditor handleEditorChange={handleTextEditorChange} />
        <LivePreview htmlContent={parsedTextEditorText} />
        <DefinedTerms />
      </div>
    </div>
  );
}
