'use client'
import { ToastContainer as ReactToastContainer } from 'react-toastify'

function ToastContanier() {
  return (
    <ReactToastContainer
      position='top-right'
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      progress={undefined}
    />
  )
}

export default ToastContanier
