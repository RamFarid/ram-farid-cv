'use client'

import updateClientNo from '@/utils/updateClientNo'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

function Clients({ clientsNo = 0 }) {
  const currentClientNo = useRef(clientsNo)
  const [isPending, setIsPending] = useState(false)
  const [clients, setClients] = useState(clientsNo)

  return (
    <>
      <div className='inp-co clients-no'>
        <label htmlFor='clientno'>Clients Number</label>
        <input
          type='number'
          id='clientno'
          placeholder=' '
          value={clients}
          min={0}
          onChange={(e) => setClients(e.target.value)}
        />
        <button
          className='primary-btn'
          disabled={isPending || currentClientNo.current === clients}
          onClick={async () => {
            setIsPending(true)
            try {
              const isUpdated = await updateClientNo(clients)
              if (isUpdated) toast.success('Clients number updated')
              currentClientNo.current = clients
            } catch (error) {
              toast.error("Can't update the client number" + error)
            } finally {
              setIsPending(false)
            }
          }}
        >
          {isPending ? 'Loading...' : 'Submit Client number'}
        </button>
      </div>
    </>
  )
}

export default Clients
