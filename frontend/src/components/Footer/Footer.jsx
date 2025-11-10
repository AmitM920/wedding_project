import React from 'react'
import { apiservices } from '../../services/api'

function Footer() {
  // Changed from "message" to "djangoMessage" to avoid confusion
  const [djangoMessage, setDjangoMessage] = React.useState('Waiting for Django...')

  React.useEffect(() => {
    apiservices.helloDjango()
      .then(data => {
        // data.message comes from Django, we store it in djangoMessage
        setDjangoMessage(data.message)
      })
      .catch(error => {
        setDjangoMessage('Django is sleeping 😴')
      })
  }, [])

  return (
    <>
      <div className='footer'>
        {/* Now showing djangoMessage instead of message */}
        <p>Django says: <strong>{djangoMessage}</strong></p>
        <p>Footer Content</p>
      </div>
    </>
  )
}

export default Footer