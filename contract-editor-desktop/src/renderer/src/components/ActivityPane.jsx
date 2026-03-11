import fileIcon from '../assets/file.svg'
import listTreeIcon from '../assets/list-tree.svg'
import dictionaryIcon from '../assets/dictionary.svg'
import formattingIcon from '../assets/formatting.svg'

const EXPLORER_ITEMS = [
  { id: 'files', label: 'File explorer', icon: fileIcon },
  { id: 'toc', label: 'Table of contents', icon: listTreeIcon },
  { id: 'defined-terms', label: 'Defined terms', icon: dictionaryIcon },
  { id: 'formatting', label: 'Formatting', icon: formattingIcon }
]

function ActivityPane({ active, onSelect }) {
  return (
    <div className="activity-pane">
      {EXPLORER_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`activity-button ${active === item.id ? 'is-active' : ''}`}
          onClick={() => onSelect(item.id)}
          aria-label={item.label}
          aria-pressed={active === item.id}
          title={item.label}
        >
          <img src={item.icon} alt="" className="activity-button-icon" />
        </button>
      ))}
    </div>
  )
}

export default ActivityPane
