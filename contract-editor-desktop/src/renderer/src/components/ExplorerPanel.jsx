import DefinedTermsPane from './DefinedTermsPane'
import FileExplorerPane from './FileExplorerPane'
import FormattingPane from './FormattingPane'
import TOCPane from './TOCPane'

function ExplorerPanel({ active, onFileSelect, selectedFilePath, onProjectOpened }) {
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
        <FormattingPane />
      </div>
    </>
  )
}

export default ExplorerPanel
