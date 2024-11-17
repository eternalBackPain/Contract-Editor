import DefinedTerms from "./components/definedTerms";
import LivePreview from "./components/livePreview";
import TableOfContents from "./components/tableOfContents";
import TextEditor from "./components/textEditor";
import ToolBar from "./components/toolBar";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow h-full">
      <ToolBar />
      <div className='flex flex-row flex-grow h-full'>
        <TableOfContents initialWidth={200} />
        <TextEditor />
        <LivePreview />
        <DefinedTerms />
      </div>
    </div>
  );
}
