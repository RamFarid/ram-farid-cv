function extractTechs(usages) {
  const hasReact = usages?.includes('react')
  const hasNext = usages?.includes('next')
  const hasMui = usages?.includes('mui')
  const hasSASS = usages?.includes('sass')
  const hasCSS = usages?.includes('css')
  const isPure = usages?.includes('pure')
  const hasFirebase = usages?.includes('firebase')
  const hasNode = usages?.includes('node.js')
  const hasTelegramBot = usages?.includes('telegraf.js')
  const hasMongoDB = usages?.find(
    (u) =>
      u.toLowerCase().replace(' ', '') === 'mongodb' ||
      u.toLowerCase().replace(' ', '') === 'mongo'
  )
  return {
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
  }
}

export default extractTechs
