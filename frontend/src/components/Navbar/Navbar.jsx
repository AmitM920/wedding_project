import { Link } from 'react-router-dom';
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FaBars, FaTimes, FaHome, FaUser, FaCode, FaEnvelope } from 'react-icons/fa';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemRefs = useRef([]);
  function handleMenuClicked() {
    setMenuOpen(prev => !prev)
    console.log(menuOpen)
  }
  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/about', label: 'About', icon: <FaUser /> },
    { path: '/projects', label: 'Projects', icon: <FaCode /> },
    { path: '/contact', label: 'Contact', icon: <FaEnvelope /> }
  ];

  useGSAP(() => {
    const radius = 120;
    const startAngle = 0;
    const endAngle = 90;
    const angleStep = (endAngle - startAngle) / (navItems.length - 1);

    if (menuOpen) {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = (startAngle + i * angleStep) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        gsap.set(el, { x: 0, y: 0, opacity: 0 });
        gsap.to(el, {
          x,
          y,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: "back.out(1.7)",
        });
      });
    } else {
      gsap.to(itemRefs.current, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
      });
    }
  }, [menuOpen]); // re-runs when menuOpen changes

  return (
    <nav>
      <div className="menu" onClick={() => handleMenuClicked()}>
        {menuOpen ? (
          <>
            <FaTimes />
            <ul className={menuOpen ? "active" : ""}>
              {navItems.map((item, index) => (
                <li
                  key={item.path}
                  ref={(el) => (itemRefs.current[index] = el)}
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    opacity: 0,
                  }}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <FaBars />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
