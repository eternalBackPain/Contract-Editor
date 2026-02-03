import fileIcon from '../assets/file.svg'
import listTreeIcon from '../assets/list-tree.svg'
import dictionaryIcon from '../assets/dictionary.svg'
import formattingIcon from '../assets/formatting.svg'

function ActivityPane({ active, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect('files')}
        aria-label="File explorer"
        aria-pressed={active === 'files'}
        className="h-10 w-10 grid place-items-center rounded-md border border-transparent text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 aria-pressed:bg-blue-500/15 aria-pressed:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      >
        <img src={fileIcon} alt="" className="h-5 w-5 opacity-90" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('toc')}
        aria-label="Table of contents"
        aria-pressed={active === 'toc'}
        className="h-10 w-10 grid place-items-center rounded-md border border-transparent text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 aria-pressed:bg-blue-500/15 aria-pressed:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      >
        <img src={listTreeIcon} alt="" className="h-5 w-5 opacity-90" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('defined-terms')}
        aria-label="Defined terms"
        aria-pressed={active === 'defined-terms'}
        className="h-10 w-10 grid place-items-center rounded-md border border-transparent text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 aria-pressed:bg-blue-500/15 aria-pressed:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      >
        <img src={dictionaryIcon} alt="" className="h-5 w-5 opacity-90" />
      </button>
      <button
        type="button"
        onClick={() => onSelect('formatting')}
        aria-label="Formatting"
        aria-pressed={active === 'formatting'}
        className="h-10 w-10 grid place-items-center rounded-md border border-transparent text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 aria-pressed:bg-blue-500/15 aria-pressed:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      >
        <img src={formattingIcon} alt="" className="h-5 w-5 opacity-90" />
      </button>
    </div>
  )
}

export default ActivityPane
