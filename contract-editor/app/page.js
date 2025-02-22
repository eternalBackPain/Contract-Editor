"use client";
import DefinedTerms from "./components/definedTerms";
import LivePreview from "./components/livePreview";
import TableOfContents from "./components/tableOfContents";
import TextEditor from "./components/textEditor";
import ToolBar from "./components/toolBar";
import { useState } from "react";

export default function Home() {
  const [XMLText, setXMLText] = useState("");
  const [HTMLText, setHTMLText] = useState("");

  const handleInputTextChange = async (value) => {
    // Parse to XML
    console.log("Client: Sending to server =>", value);
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });
      const { success, data } = await response.json();
      console.log("Client: Server response =>", { success, data });
      setXMLText(data);
    } catch (error) {
      console.error("Error parsing text:", error);
    }

    //Transform XML
    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: XMLText }),
      });
      const { success, data } = await response.json();
      console.log("Client: Server response =>", { success, data });
      setHTMLText(data);
    } catch (error) {
      console.error("Error parsing text:", error);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-screen w-screen">
      <ToolBar />
      <div className="flex flex-row flex-grow h-full w-full">
        <TableOfContents />
        <TextEditor handleEditorChange={handleInputTextChange} />
        <LivePreview htmlContent={XMLText} />
        <DefinedTerms />
      </div>
    </div>
  );
}
