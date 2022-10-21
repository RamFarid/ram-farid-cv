this.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open('main')
      .then((cach) => {
        console.log(cach)
      })
      .catch((er) => {
        console.log(er)
      })
  )
})
