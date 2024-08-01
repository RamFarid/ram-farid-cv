import React from 'react'
import { BsPatchCheckFill } from 'react-icons/bs'

function AddintionalSkill({ head, skillRatio }) {
  return (
    <div className='add-skill'>
      <div className='icon'>
        <BsPatchCheckFill />
      </div>
      <div>
        <div>{head}</div>
        <div className='sub-text'>{skillRatio}</div>
      </div>
    </div>
  )
}

export default AddintionalSkill
