"use client";
import DefinedTerms from "./components/definedTerms";
import LivePreview from "./components/livePreview";
import TableOfContents from "./components/tableOfContents";
import TextEditor from "./components/textEditor";
import ToolBar from "./components/toolBar";
import { useState } from "react";

export default function Home() {
  const [DSLContent, setDSLContent] = useState("");
  const [parsedDSL, setParsedDSL] = useState("");

  const handleEditorChange = async (value) => {
    setDSLContent(value);
    
    // 1) Log the data we’re about to send to the server
    console.log("Client: Sending DSL to server =>", value);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dsl: value }),
      });

      // 2) Expect a JSON response (not text) since we’re returning JSON on the server
      const { success, parsedDSL } = await response.json();
      
      // 3) Log the full JSON response from the server
      console.log("Client: Server response =>", { success, parsedDSL });

      // 4) Update preview
      setParsedDSL(parsedDSL);

    } catch (error) {
      console.error("Error parsing DSL:", error);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-screen w-screen">
      <ToolBar />
      <div className="flex flex-row flex-grow h-full w-full">
        <TableOfContents />
        <TextEditor handleEditorChange={handleEditorChange} />
        <LivePreview htmlContent={parsedDSL} />
        <DefinedTerms />
      </div>
    </div>
  );
}
