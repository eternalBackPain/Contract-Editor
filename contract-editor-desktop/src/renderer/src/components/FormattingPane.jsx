import formattingPaneIcon from '../assets/formatting-pane.svg'

function FormattingPane({
  draftText,
  parseError,
  diagnostics,
  isUsingDefault,
  onDraftChange,
  onApply,
  onReset
}) {
  return (
    <div className="formatting-pane">
      <h2 className="panel-placeholder-title panel-placeholder-title-row">
        <img src={formattingPaneIcon} alt="" className="panel-placeholder-title-icon" />
        <span>Formatting</span>
      </h2>
      <p className="panel-placeholder-text">
        Default style profile JSON is prefilled below. Edit and apply to update rendered output.
      </p>
      <textarea
        className="formatting-json-input"
        value={draftText}
        onChange={(event) => onDraftChange(event.target.value)}
        spellCheck={false}
      />
      <div className="formatting-actions">
        <button type="button" className="explorer-action-button" onClick={onApply}>
          Apply
        </button>
        <button type="button" className="explorer-action-button" onClick={onReset}>
          Load defaults
        </button>
      </div>
      {isUsingDefault ? (
        <p className="formatting-status">Using core default style profile.</p>
      ) : (
        <p className="formatting-status">Using custom style override.</p>
      )}
      {parseError ? <p className="formatting-error">{parseError}</p> : null}
      {diagnostics.length > 0 ? (
        <ul className="formatting-diagnostics">
          {diagnostics.map((diagnostic, index) => (
            <li key={`${diagnostic.code}-${index}`}>{diagnostic.message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default FormattingPane
