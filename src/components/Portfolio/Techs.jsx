import SingleSkill from '@/components/Portfolio/SingleSkill'
import extractTechs from '@/utils/extractTechs'

function Techs({ usages }) {
  const {
    hasReact,
    hasNext,
    hasMui,
    hasSASS,
    hasCSS,
    isPure,
    hasFirebase,
    hasNode,
    hasTelegramBot,
    hasMongoDB,
  } = extractTechs(usages)
  return (
    <div className='skills-co'>
      {hasReact && (
        <SingleSkill img={'/Assets/react-svg.svg'} title={'Reactjs'} />
      )}
      {hasNext && (
        <SingleSkill img={'/Assets/next-logo.svg'} title={'Nextjs'} />
      )}
      {isPure && (
        <>
          <SingleSkill img={'/Assets/html-logo.svg'} title={'HTML'} />
          <SingleSkill
            img={'/Assets/javascript-logo.svg'}
            title={'JavaScript'}
          />
        </>
      )}
      {hasCSS && <SingleSkill img={'/Assets/css-logo.svg'} title={'CSS'} />}
      {hasSASS && <SingleSkill img={'/Assets/sass-logo.svg'} title={'SASS'} />}
      {hasMui && (
        <SingleSkill img={'/Assets/material-ui-logo.svg'} title={'MUI'} />
      )}
      {hasNode && (
        <SingleSkill img={'/Assets/nodejs-logo.svg'} title={'Nodejs'} />
      )}
      {hasFirebase && (
        <SingleSkill img={'/Assets/firebase-logo.svg'} title={'Firebase'} />
      )}
      {hasTelegramBot && (
        <SingleSkill
          img={'/Assets/bot-father-logo.jpg'}
          title={'Telegram bot'}
        />
      )}
      {hasMongoDB && (
        <SingleSkill img={'/Assets/mongodb.svg'} title={'MongoDB'} />
      )}
    </div>
  )
}

export default Techs
