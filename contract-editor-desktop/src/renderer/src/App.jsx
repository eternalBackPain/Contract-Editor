import React from 'react'
import ActivityPane from './components/ActivityPane'
import EditorPane from './components/EditorPane'
import ExplorerPane from './components/ExplorerPane'
import OutputPane from './components/OutputPane'

function App() {
  return (
    <>
      <div className="flex h-screen">
        <div className="bg-slate-400 w-14">
          <ActivityPane />
        </div>
        <div className="bg-slate-300 w-1/5">
          <ExplorerPane />
        </div>
        <div className="bg-slate-200 flex-1">
          <EditorPane />
        </div>
        <div className="bg-slate-100 flex-1">
          <OutputPane />
        </div>
      </div>
    </>
  )
}

export default App
