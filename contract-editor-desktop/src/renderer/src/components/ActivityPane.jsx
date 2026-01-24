import fileIcon from '../assets/file.svg'
import listTreeIcon from '../assets/list-tree.svg'
import dictionaryIcon from '../assets/dictionary.svg'
import formattingIcon from '../assets/formatting.svg'

function ActivityPane({ active, onSelect }) {
  return (
    <div className='flex flex-col justify-center m-2'>
      <button
        type="button"
        onClick={() => onSelect('files')}
        aria-label="File explorer"
        aria-pressed={active === 'files'}
      >
        <img src={fileIcon} alt="" className="w-8 h-8 mb-2 cursor-pointer" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('toc')}
        aria-label="Table of contents"
        aria-pressed={active === 'toc'}
      >
        <img src={listTreeIcon} alt="" className="w-8 h-8 mb-2 cursor-pointer" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('defined-terms')}
        aria-label="Defined terms"
        aria-pressed={active === 'defined-terms'}
      >
        <img src={dictionaryIcon} alt="" className="w-8 h-8 cursor-pointer" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('formatting')}
        aria-label="Formatting"
        aria-pressed={active === 'formatting'}
      >
        <img src={formattingIcon} alt="" className="w-8 h-8 cursor-pointer" />
      </button>
    </div>
  )
}

export default ActivityPane
