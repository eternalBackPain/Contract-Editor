import MonacoEditor from './MonacoEditor'

function EditorPane({ onChange, value }) {
  return (
    <div className="editor-pane-body">
      <MonacoEditor onChange={onChange} value={value} />
    </div>
  )
}

export default EditorPane
