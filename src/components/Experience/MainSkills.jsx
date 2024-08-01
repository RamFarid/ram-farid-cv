import Skill from './Skill'
import { mainSkills } from '../../../public/data/mainSkills'

function MainSkills({ className }) {
  return (
    <article className={`main-skills ${className || ''}`}>
      <div className='section-header'>Frontend development</div>
      {mainSkills.map((el, id) => {
        return (
          <Skill
            skill={el.skill}
            skillRatio={el.skillRatio}
            key={id + 14}
            order={id}
          />
        )
      })}
    </article>
  )
}

export default MainSkills
