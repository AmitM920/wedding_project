import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react'
import Lenis from "@studio-freight/lenis";
import Contact from "./components/contact/Contact"
import Education from "./components/education/Education";
import Footer from "./components/Footer/Footer";
import Navamit from './components/Navbar/Navamit';
import About from './components/About/About';
import Full_HeroSection from './components/HeroSection/Full_Herosection/Full_Herosection';
import ProfileCard_section from './components/ProfileCard_section/ProfileCard_section';

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
      <main className='app'>
        <Routes>
          <Route path="/" element={
            <>
              <Navamit className='nav-compo' />
              <Full_HeroSection />
              <ErrorBoundary>
                <ProfileCard_section />
              </ErrorBoundary>

              <Footer />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<p style={{ color: "white" }}>not found</p>} />
        </Routes>
      </main>
    </Router>
  )
}