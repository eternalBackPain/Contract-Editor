import React from 'react'
import { ViewsProvider } from './contexts/ViewsContext'
import ActivityBar from './components/ActivityBar'
import SideBar from './components/SideBar'
import EditorView from './components/EditorView'
import RenderedView from './components/RenderedView'
import ExplorerView from './components/views/ExplorerView'

function App() {
  return (
    <>
      <ViewsProvider
        initialViews={[
          {
            id: 'explorer',
            title: 'Explorer',
            icon: '📁',
            component: ExplorerView
          }
        ]}
      >
        <div className="app">
          <ActivityBar />
          <SideBar />
          <main className="editor-area">Editor area (placeholder)</main>
          {/* <EditorView /> */}
          {/* <RenderedView /> */}
        </div>
      </ViewsProvider>
    </>
  )
}

export default App
