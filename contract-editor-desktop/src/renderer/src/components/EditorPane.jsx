import { Editor, loader } from '@monaco-editor/react' //see https://github.com/suren-atoyan/monaco-react

function EditorPane() {
  return (
    <div>
      <p>Item 3</p>
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme="light"
        // onChange={handleEditorChange}
      />
    </div>
  )
}

export default EditorPane
