import React from 'react';
import MonacoEditor from './MonacoEditor';

// function handleEditorChange(value) {
//   console.log('Value passed in: ', value);
// }

function EditorPane({onChange}) {
  return (
    <div className='flex h-screen'>
      <MonacoEditor onChange={onChange} />
    </div>
  )
}

export default EditorPane
