import DefinedTermsPane from './DefinedTermsPane'
import FileExplorerPane from './FileExplorerPane'
import FormattingPane from './FormattingPane'
import TOCPane from './TOCPane'

function ExplorerPanel({ active, onFileSelect, projectTree, selectedFilePath }) {
  switch (active) {
    case 'files':
      return (
        <FileExplorerPane
          onFileSelect={onFileSelect}
          project={projectTree}
          selectedFilePath={selectedFilePath}
        />
      )
    case 'defined-terms':
      return <DefinedTermsPane />
    case 'formatting':
      return <FormattingPane />
    case 'toc':
    default:
      return <TOCPane />
  }
}

export default ExplorerPanel