import React from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'
import Button from './Button'

import './css/work-desc.css'
function WorkDesc({
  drewer,
  website,
  liveDemoHandler,
  detectedGithub,
  setDrewer,
}) {
  return (
    <BottomSheet
      open={drewer}
      style={{ background: '#1f1f38' }}
      onDrop={() => setDrewer(false)}
    >
      <div className='sheet-co'>
        <div style={{ flex: 1 }}></div>
        <div className='sheet-btns'>
          <Button primary='true' href={website} onClick={liveDemoHandler}>
            Live Show
          </Button>
          <Button onClick={(e) => detectedGithub(e)}>Github</Button>
        </div>
      </div>
    </BottomSheet>
  )
}

export default WorkDesc
