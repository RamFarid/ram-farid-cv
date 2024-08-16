export default function getStorageURL(PATH) {
  return `https://firebasestorage.googleapis.com/v0/b/ram-farid-cv-c3d7f.appspot.com/o/${encodeURIComponent(
    PATH
  )}?alt=media`
}
