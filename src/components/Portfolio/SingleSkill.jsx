function SingleSkill({ img, title }) {
  return (
    <div className={'single-skill'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={title}
        className={title.toLowerCase() === 'reactjs' ? 'react' : ''}
      />
    </div>
  )
}

export default SingleSkill
