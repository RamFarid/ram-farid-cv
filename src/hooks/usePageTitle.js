import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    let PageTitle = title
    document.title = `Ram Farid | ${PageTitle || ''}`
  })
}

export default usePageTitle
