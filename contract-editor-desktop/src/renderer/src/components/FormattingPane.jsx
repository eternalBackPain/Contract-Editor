import formattingPaneIcon from '../assets/formatting-pane.svg'

function FormattingPane() {
  return (
    <div className="panel-placeholder">
      <h2 className="panel-placeholder-title panel-placeholder-title-row">
        <img src={formattingPaneIcon} alt="" className="panel-placeholder-title-icon" />
        <span>Formatting</span>
      </h2>
      <p className="panel-placeholder-text">Formatting controls will be shown here.</p>
    </div>
  )
}

export default FormattingPane
