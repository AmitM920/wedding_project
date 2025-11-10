import React, { useEffect, useRef } from 'react'

export default function About() {
  const containerRef = useRef(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return
    isInitialized.current = true

    // Check if UnicornStudio is already loaded
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false }
      const script = document.createElement('script')
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js"
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          UnicornStudio.init()
          window.UnicornStudio.isInitialized = true
        }
      }
      document.head.appendChild(script)
    }

    // Create the project container
    const projectDiv = document.createElement('div')
    projectDiv.setAttribute('data-us-project', 'xc5losgaLVGGwsbw0vQF')
    projectDiv.style.width = '1440px'
    projectDiv.style.height = '900px'

    // Add a class to target with CSS
    projectDiv.className = 'unicorn-container'

    if (containerRef.current) {
      containerRef.current.appendChild(projectDiv)
    }

    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(projectDiv)) {
        containerRef.current.removeChild(projectDiv)
      }
      isInitialized.current = false
    }
  }, [])

  return (
    <div style={{
      width: '1440px',
      height: '870px', // Reduced height to crop the badge area
      overflow: 'hidden',
      position: 'relative',
      margin: '0 auto'
    }}>
      <div ref={containerRef} />
    </div>
  )
}