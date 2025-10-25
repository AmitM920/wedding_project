import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react'
import Lenis from "@studio-freight/lenis";
import Contact from "./components/contact/Contact"
import Education from "./components/education/Education";
import Experience from "./components/experience/Experience";
import Footer from "./components/Footer/Footer";
import LiquidEther from "./components/liquidEther/LiquidEther";
import Navbar from "./components/navbar/Navbar";
import Skills from "./components/skills/Skills";
import Work from "./components/work/Work";

import { ScrollTrigger, SplitText } from 'gsap/all';
import Navamit from './components/Navbar/Navamit';
import About from './components/About/About';
import Herosection from './components/Herosetion/Herosection';
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
    <main className='thin-scrollbar'>



      <Routes>
        <Route path="/" element={<>
          <Navamit />
        </>} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Work />} />
        <Route path="/education" element={<Education />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/footer" element={<Footer />} />

        <Route path="/footer" element={<p>not found</p>} />
      </Routes>
      <Herosection />
      <Footer></Footer>
    </main>




  )
}
