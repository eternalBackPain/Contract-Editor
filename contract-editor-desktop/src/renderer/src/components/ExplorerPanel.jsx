import DefinedTermsPane from './DefinedTermsPane'
import FileExplorerPane from './FileExplorerPane'
import FormattingPane from './FormattingPane'
import TOCPane from './TOCPane'

function ExplorerPanel({ active }) {
  switch (active) {
    case 'files':
      return <FileExplorerPane />
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
