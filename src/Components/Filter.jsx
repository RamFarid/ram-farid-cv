import React from 'react'
import './css/filteration.css'
function Filter({ setProjectStatus, projectStatus }) {
  return (
    <React.Fragment>
      {/* <div className='filteration'>Filter:</div> */}
      <div className='filteration-co'>
        <div
          className='filter-item'
          onClick={() =>
            setProjectStatus({
              ...projectStatus,
              pure: !projectStatus.pure || true,
            })
          }
        >
          HTML & CSS & JS
        </div>
        <div
          className='filter-item'
          onClick={() =>
            setProjectStatus({
              ...projectStatus,
              react: !projectStatus.react || true,
            })
          }
        >
          React js
        </div>
        <div
          className='filter-item'
          onClick={() =>
            setProjectStatus({
              ...projectStatus,
              sass: !projectStatus.sass || true,
            })
          }
        >
          SASS
        </div>
        <div
          className='filter-item'
          onClick={() =>
            setProjectStatus({
              ...projectStatus,
              bootStrap: !projectStatus.bootStrap || true,
            })
          }
        >
          BootStrap
        </div>
      </div>
    </React.Fragment>
  )
}

export default Filter
