import MonacoEditor from './MonacoEditor'

function EditorPane(props) {
  return (
    <div className="editor-pane-body">
      <MonacoEditor {...props} />
    </div>
  )
}

export default EditorPane
