import { AiOutlineCloudUpload } from 'react-icons/ai'
import { GrGallery } from 'react-icons/gr'

function ImgsInput({
  setGallery,
  gallery,
  thumbnail,
  setThumbnail,
  noAccessEdit,
  defaultImgs,
}) {
  return (
    <>
      <div className='inp-co ic2 inp-file-co'>
        {(thumbnail || defaultImgs?.thumbnail) && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                thumbnail
                  ? URL.createObjectURL(thumbnail)
                  : defaultImgs?.thumbnail
              }
              alt='thumbnail'
            />
          </>
        )}
        <input
          id={'thumbnail'}
          type='file'
          accept='image/*'
          name='imgFile'
          required
          disabled={noAccessEdit}
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
        <label htmlFor={'thumbnail'} className='placeholder'>
          <AiOutlineCloudUpload color='var(--color-primary)' size={60} />{' '}
          <span>Upload Image</span>
        </label>
        <div className='file-name'>{thumbnail?.name}</div>
      </div>
      <div className='inp-co inp-gallery'>
        <input
          multiple
          disabled={noAccessEdit}
          type='file'
          name='gallery'
          id='gallery'
          onChange={(e) => setGallery(e.target.files)}
        />
        <label htmlFor='gallery' className='secondary-btn'>
          Gallery <GrGallery />
        </label>
      </div>
      <div className='gallery-view'>
        {Array.from(gallery || defaultImgs?.gallery || []).map((img, i) => (
          <div
            className='gallery-item'
            key={gallery ? `${img.name} ${img.size}` : defaultImgs.gallery[i]}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery ? URL.createObjectURL(img) : defaultImgs.gallery[i]}
              alt={img.name}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default ImgsInput
