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
    console.log("Client: Sending to server =>", value);
    try {
      // 1. Parse to XML
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const { success: ok1, data: xml } = await parseRes.json();
      console.log("Client: Parse response =>", { ok1, xml });
      setXMLText(xml);

      // 2. Transform XML to HTML
      const transformRes = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: xml }),
      });
      const { success: ok2, data: html } = await transformRes.json();
      console.log("Client: Transform response =>", { ok2, html });
      setHTMLText(html);
    } catch (err) {
      console.error("Error in parse/transform flow:", err);
    }
  }


  return (
    <div className="flex flex-col flex-grow h-screen w-screen">
      <ToolBar />
      <div className="flex flex-row flex-grow h-full w-full">
        <TableOfContents />
        <TextEditor handleEditorChange={handleInputTextChange} />
        <LivePreview htmlContent={HTMLText} />
        <DefinedTerms />
      </div>
    </div>
  );
}
