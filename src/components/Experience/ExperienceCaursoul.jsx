import FSWrapper from '@/lib/FS'
import AddintionalSkills from './AddintionalSkills'
import MainSkills from './MainSkills'

function ExperienceCaursoul() {
  return (
    <>
      <FSWrapper
        frontFaceComponent={<MainSkills />}
        backFaceComponent={<AddintionalSkills />}
      />
    </>
  )
}

export default ExperienceCaursoul
