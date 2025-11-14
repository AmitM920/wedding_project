import React, { useState, useRef, useEffect, useCallback } from 'react'
import './Mid_compo.css'

export default function Mid_compo() {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const iframeRef = useRef(null)
    const containerRef = useRef(null)

    // ✅ Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px' // Load 50px before entering viewport
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const handleLoad = useCallback(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div ref={containerRef} className="mid-compo-wrapper">
            {/* Loading placeholder */}
            {!isLoaded && (
                <div className="iframe-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading magical moments...</p>
                </div>
            )}

            {/* Only render iframe when visible */}
            {isVisible && (
                <iframe
                    ref={iframeRef}
                    // src="https://www.unicorn.studio/embed/mv8DVEZFyA3h5zQfwj7L"
                    src="https://www.unicorn.studio/embed/oriF5C3aHDSSOu2sfEmy"
                    className={`unicorn-iframe ${isLoaded ? 'loaded' : 'loading'}`}
                    title="Our Love Story"
                    allowFullScreen
                    loading="lazy"
                    onLoad={handleLoad}
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                        border: 'none',
                        borderRadius: '10px',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                />
            )}
        </div>
    )
}