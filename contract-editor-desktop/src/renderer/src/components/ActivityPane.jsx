import fileIcon from '../assets/file.svg'
import listTreeIcon from '../assets/list-tree.svg'

function ActivityPane() {
  return (
    <div className='flex flex-col justify-center m-2'>
      <img src={fileIcon} className="w-8 h-8 mb-2"></img>
      <img src={listTreeIcon} className="w-8 h-8"></img>
    </div>
  )
}

export default ActivityPane
