import React from 'react'
import { apiServices } from '../../services/api' // Changed from apiservices to apiServices
import './Footer.css'

function Footer() {
  const [backendStatus, setBackendStatus] = React.useState('Checking...')

  React.useEffect(() => {
    apiServices.helloDjango() // Changed from apiservices to apiServices
      .then(data => setBackendStatus(`✅ ${data.message}`))
      .catch(() => setBackendStatus('❌ Backend offline'))
  }, [])

  return (
    <footer className='footer'>
      <div className="backend-status">
        <p>{backendStatus}</p>
      </div>
      <div className="footer-content">
        <p>© 2025 Wedding Photography. All rights reserved.</p>
        <p className="tagline">Capturing moments that last forever 💕</p>
      </div>
    </footer>
  )
}

export default Footer