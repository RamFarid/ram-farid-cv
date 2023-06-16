'use client'
import '@/styles/filteration.css'
function Filter({ filters, setFilters }) {
  return (
    <>
      <div className='filteration-co'>
        <div className='filteration'>Filters:</div>
        <select
          name='fw'
          value={filters[0]}
          onChange={(e) =>
            setFilters((pre) => {
              const currentFilter = [...pre]
              currentFilter[0] = e.target.value
              return currentFilter
            })
          }
        >
          <option value='all'>Framework</option>
          <option value='pure'>HTML & CSS & JS</option>
          <option value='react'>React js</option>
          <option value='next'>Next js</option>
          <option value='other'>Other</option>
        </select>
        {/* <select
          name='styles'
          value={filters[1]}
          onChange={(e) =>
            setFilters((pre) => {
              const currentFilter = [...pre]
              currentFilter[1] = e.target.value
              return currentFilter
            })
          }
        >
          <option value='all'>Styles</option>
          <option value='sass'>SASS</option>
          <option value='mui'>MUI</option>
          <option value='css'>CSS</option>
        </select> */}
      </div>
    </>
  )
}

export default Filter
