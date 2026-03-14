function OutputPane({ html }) {
  return (
    <div className="output-pane">
      <div className="output-document" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default OutputPane
