//TODO: add UI for amending styles (add as part of activity and explorer pane)

import { useMemo } from 'react'
import { compileStyles } from '../lib/styleGenerator'
import defaultStyle from '../assets/default-style.json'

function OutputPane({ html }) {
  const cssText = useMemo(() => {
    return compileStyles(defaultStyle).cssText
  }, [])

  return (
    <div className="p-4 h-full overflow-auto text-[14px] leading-relaxed">
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default OutputPane
