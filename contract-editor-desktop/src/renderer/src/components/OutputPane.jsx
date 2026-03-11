import { useMemo } from 'react'
import { compileStyles } from '../lib/styleGenerator'
import defaultStyle from '../assets/default-style.json'

function OutputPane({ html }) {
  const cssText = useMemo(() => {
    return compileStyles(defaultStyle).cssText
  }, [])

  return (
    <div className="output-pane">
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <div className="output-document" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default OutputPane
