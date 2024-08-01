import AddintionalSkill from './AddintionalSkill'
import { knowledgeSkill } from '../../../public/data/knowledgeSkill'

function AddintionalSkills({ className }) {
  return (
    <article
      className={`knowlege-skills ${className || ''}`}
      // initial={{ opacity: 0, x: 150 }}
      // whileInView={{ opacity: 1, x: 0 }}
      // transition={{ duration: 1, delay: 0.5 }}
      // viewport={{ once: true }}
    >
      <div className='section-header'>I also have knowledge in:</div>
      <div className='ad-skills-container'>
        {knowledgeSkill.map((el, id) => {
          return (
            <AddintionalSkill
              head={el.head}
              skillRatio={el.skillRatio}
              key={id + 12}
            />
          )
        })}
      </div>
    </article>
  )
}

export default AddintionalSkills
