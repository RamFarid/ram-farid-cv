import handleElderImgs from './handleElderImgs'
import uploadProjectImg from './uploadProjectImg'

export default async function uploadProjectImgs(
  files,
  slugName,
  noAccessEdit,
  isUpdate
) {
  if (noAccessEdit) return
  try {
    isUpdate && (await handleElderImgs(slugName, files))
    let imagesPromises = []
    files.forEach((img, index) => {
      if (img) {
        const fileData = img.name.split('.')
        const memetype = fileData[fileData.length - 1]
        if (index === 0) {
          imagesPromises.push(
            uploadProjectImg(img, `${slugName}/thumbnail.${memetype}`)
          )
          return
        }
        imagesPromises.push(
          uploadProjectImg(img, `${slugName}/${index}.${memetype}`)
        )
      }
    })
    const imagesPaths = await Promise.all(imagesPromises)
    return imagesPaths
  } catch (error) {
    throw error
  }
}
