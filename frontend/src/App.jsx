import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react'
import { Element } from 'react-scroll';
import Lenis from "@studio-freight/lenis";


import Footer from "./components/Footer/Footer";
import Navamit from './components/Navbar/Navamit';
import About from './components/About/About';
// import Full_HeroSection from './components/HeroSection/Full_Herosection/Full_Herosection';

import ProfileCard_section from './components/ProfileCard_section/ProfileCard_section';
import Particles from './components/ui/Particles'; // Import Particles
import BlackStar_HeroSection from './components/HeroSection/BlackStar_Herosection/BlackStar_Herosection';
import Gallery from './components/Gallery/Gallery';
import EventGallery from './components/Gallery/EventGallery';
// import Black_HeroSection from './components/HeroSection/Black_Herosection/Black_Herosection';


// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(255,0,0,0.1)',
          margin: '20px',
          borderRadius: '10px'
        }}>
          <h3>Component Error</h3>
          <p>This section couldn't load properly.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '10px 20px', margin: '10px' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <Router>
      {/* Full-page Particles Background */}
      <Particles
        className="full-page-particles"
        particleCount={2500} // Increased for full page
        particleSpread={30} // Increased spread
        speed={0.1}
        moveParticlesOnHover={true}
        particleHoverFactor={3}
        alphaParticles={false}
        particleBaseSize={100}
        sizeRandomness={1}
        cameraDistance={100}
        disableRotation={true}
      />

      <main className='app' id='app'>
        <Routes>
          <Route path="/" element={
            <>
              <Navamit className='nav-compo' />
              {/* <Full_HeroSection /> */}
              {/* <Black_HeroSection></Black_HeroSection> */}

              <Element name="hero-section">
                <div id="hero-section">
                  <BlackStar_HeroSection />
                </div>
              </Element>


              <ErrorBoundary>

                <section id="profile-section">
                  <ProfileCard_section />
                </section>

                <Element name="gallery-section">
                  <div id="gallery-section">
                    <Gallery />
                  </div>
                </Element>

                <Element name="about-section">
                  <div id="about-section">
                    <About />
                  </div>
                </Element>
              </ErrorBoundary>

              <Footer />
            </>
          } />
          <Route path="/gallery/:eventId" element={<EventGallery />} />


          <Route path="*" element={<p style={{ color: "white" }}>not found</p>} />
        </Routes>
      </main>
    </Router>
  )
}