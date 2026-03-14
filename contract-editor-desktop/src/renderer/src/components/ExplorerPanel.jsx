import DefinedTermsPane from './DefinedTermsPane'
import FileExplorerPane from './FileExplorerPane'
import FormattingPane from './FormattingPane'
import TOCPane from './TOCPane'

function ExplorerPanel({
  active,
  onFileSelect,
  selectedFilePath,
  onProjectOpened,
  formattingState
}) {
  function paneClass(name) {
    return active === name ? 'w-full h-full' : 'hidden w-full h-full'
  }

  return (
    <>
      <div className={paneClass('files')}>
        <FileExplorerPane
          onFileSelect={onFileSelect}
          selectedFilePath={selectedFilePath}
          onProjectOpened={onProjectOpened}
        />
      </div>
      <div className={paneClass('toc')}>
        <TOCPane />
      </div>
      <div className={paneClass('defined-terms')}>
        <DefinedTermsPane />
      </div>
      <div className={paneClass('formatting')}>
        <FormattingPane
          draftText={formattingState.draftText}
          parseError={formattingState.parseError}
          diagnostics={formattingState.diagnostics}
          isUsingDefault={formattingState.isUsingDefault}
          onDraftChange={formattingState.onDraftChange}
          onApply={formattingState.onApply}
          onReset={formattingState.onReset}
        />
      </div>
    </>
  )
}

export default ExplorerPanel
