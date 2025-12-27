

import React, { useRef, useState, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
const LiquidGlassContainer = lazy(() =>
    import('@tinymomentum/liquid-glass-react')
        .then(module => ({ default: module.LiquidGlassContainer }))
);

const LiquidGlassButton = lazy(() =>
    import('@tinymomentum/liquid-glass-react')
        .then(module => ({ default: module.LiquidGlassButton }))
);

const LiquidGlassLink = lazy(() =>
    import('@tinymomentum/liquid-glass-react')
        .then(module => ({ default: module.LiquidGlassLink }))
);

// import '@tinymomentum/liquid-glass-react/dist/components/LiquidGlassBase.css';
import * as Icons from "react-icons/fa6";
import { Link as ScrollLink } from 'react-scroll';
// import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { FaBars, FaTimes } from "react-icons/fa";
import ShinyText from "../../components/ui/shiny-text"
import BlurText from "../../components/ui/BlurText";
// import DarkVeil from '../../components/ui//DarkVeil';
import Timer from "../Timer/Timer";
import logo from "../../assets/images/sections/logo.svg"

gsap.registerPlugin(useGSAP, ScrollTrigger);



function Navamit() {

    // ✅ Move static data outside component
    const LIST_ITEMS = useMemo(() => [
        { id: "1", title: "Home", scrollTo: "hero-section" },
        { id: "2", title: "How We Met", scrollTo: "profile-section" },
        { id: "3", title: "Capture the Love", scrollTo: "gallery-section" },
        { id: "4", title: "About", scrollTo: "about-section" },

    ], []);
    const [Menu, setMenu] = useState(false);
    const menuRef = useRef(null);
    const barsRef = useRef(null);
    const timesRef = useRef(null);
    const t1 = useRef(null);
    const iconTl = useRef(null);
    const itemRefs = useRef([]);


    // ✅ Enhanced debug function
    // Replace your handleScrollClick function with this:
    const handleScrollClick = useCallback((scrollTo) => {
        console.log(`=== Scroll Click: ${scrollTo} ===`);

        // Method 1: Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const element = document.getElementById(scrollTo);

            if (!element) {
                console.error(`Element #${scrollTo} not found!`);

                // Debug: Show all elements with IDs
                const allIds = Array.from(document.querySelectorAll('[id]'))
                    .map(el => el.id)
                    .filter(Boolean);
                console.log('Available IDs:', allIds);
                return;
            }

            console.log(`Found element #${scrollTo}:`, element);
            console.log(`Element position: ${element.offsetTop}px`);

            // Calculate navbar height
            const navbar = document.querySelector('.main-nav') ||
                document.querySelector('.parent') ||
                document.querySelector('nav');
            const navbarHeight = navbar ? navbar.offsetHeight : 100;
            console.log(`Navbar height: ${navbarHeight}px`);

            // Calculate scroll position with offset
            const scrollPosition = element.offsetTop - navbarHeight;
            console.log(`Scrolling to: ${scrollPosition}px`);

            // Scroll smoothly
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });

        }, 100); // 100ms delay to ensure DOM is ready
    }, []);
    // *****************

    // ✅ Memoized animation handlers
    const animationHandlers = useMemo(() => {
        const radius = 50;
        const startAngle = -170;
        const endAngle = -180;
        const angleStep = (endAngle - startAngle) / (LIST_ITEMS.length - 1);

        return {
            createMenuAnimation: () => {
                const timeline = gsap.timeline({
                    paused: true,
                    defaults: { duration: 0.5, ease: "back.out(1.7)" },
                });

                itemRefs.current.forEach((el, i) => {
                    if (!el) return;
                    const angle = (startAngle + i * angleStep) * (Math.PI / 180);
                    const x = Math.cos(angle) * radius - 60;
                    const y = Math.sin(angle) * radius + 40;

                    timeline.fromTo(
                        el,
                        { x: 0, y: 0, opacity: 0, pointerEvents: 'none' },
                        { x, y, opacity: 1, pointerEvents: 'auto', delay: i * 0.1 },
                        0
                    );
                });

                return timeline;
            },
            createIconAnimation: () => {
                const timeline = gsap.timeline({ paused: true });
                gsap.set(timesRef.current, { opacity: 0, scale: 0, rotate: -90 });
                gsap.set(barsRef.current, { opacity: 1, scale: 1, rotate: 0 });

                timeline.to(barsRef.current, {
                    opacity: 0,
                    scale: 0,
                    rotate: 90,
                    duration: 0.3,
                    ease: "back.in(1.5)",
                }).to(
                    timesRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 0.4,
                        ease: "back.out(1.5)",
                    },
                    "<"
                );

                return timeline;
            }
        };
    }, [LIST_ITEMS.length]);

    useGSAP(() => {
        if (!menuRef.current) return;

        const introTl = gsap.timeline();
        introTl.to("body", {
            backgroundColor: "black",
            duration: 1.5,
            ease: "power2.out",
        }).fromTo(
            ".logo-img",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
            "-=1"
        );

        // ✅ Initialize animations only once
        t1.current = animationHandlers.createMenuAnimation();
        iconTl.current = animationHandlers.createIconAnimation();

        // Scroll animation
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "0px top",
                end: "130px top",
                scrub: 1.2,
                markers: false,
            },
        });

        scrollTl.to([".logo-img"], {
            scale: 1,
            borderRadius: "10px",
            duration: 1,
            ease: "power2.out",
            force3D: true,
        }, 0).to(['.logo-img img'], {
            scale: 1,
            borderRadius: "8px",
            duration: 1,
            ease: "power2.out",
            force3D: true,
        }, 0).to(".nav-middle-content", {
            opacity: 1,
            y: '0vh',
            duration: 0.8,
            ease: "power2.out",

        }, 0.2)

    }, [animationHandlers]);

    // ✅ Memoized menu handler
    const handleOpenMenu = useCallback(() => {
        setMenu(prev => {
            const newState = !prev;
            if (newState) {
                t1.current?.play();
                iconTl.current?.play();
            } else {
                t1.current?.reverse();
                iconTl.current?.reverse();
            }
            return newState;
        });
    }, []);

    const handleAnimationComplete = useCallback(() => {
        console.log('Animation completed!');
    }, []);
    if (!LIST_ITEMS || !Array.isArray(LIST_ITEMS)) {
        return <div className="nav-right">Navigation loading...</div>;
    }

    return (
        <div className="parent">

            <div className="logo">
                <div className="img-mid-content-wrapper">
                    <div className="logo-img">
                        <img src={logo} alt="logo" />
                    </div>

                    <div className="nav-middle-content">
                        <BlurText
                            text="Our Special Day"
                            delay={200}
                            animateBy="words"
                            className="romantic-tagline"
                        />
                        <div className="wedding-date"><Timer></Timer></div>
                    </div>
                </div>
                {/* if nav-main dont exist then this div shows up */}
                <div className="nav-middle-content_center">
                    <BlurText
                        text="Our Special Day"
                        delay={200}
                        animateBy="words"
                        className="romantic-tagline"
                    />
                    <div className="wedding-date"><Timer></Timer></div>
                </div>
                {/* ----------- */}
                <LiquidGlassContainer
                    borderRadius={28}
                    innerShadowColor="#000000"
                    innerShadowBlur={21}
                    innerShadowSpread={-8}
                    glassTintColor="rgba(255, 255, 255, 0)"
                    glassTintOpacity={0}
                    frostBlurRadius={10}
                    noiseFrequency={0.048}
                    noiseStrength={120}
                    className="main-nav"
                    id="main-nav"
                >

                    {LIST_ITEMS.map((item) => (

                        <LiquidGlassButton
                            borderRadius={12}
                            innerShadowColor="#000000"
                            innerShadowBlur={15}
                            innerShadowSpread={0}
                            glassTintColor="rgba(255, 255, 255, 0.03)"
                            glassTintOpacity={3}
                            frostBlurRadius={0}
                            noiseFrequency={0.001}
                            noiseStrength={22}
                            key={item.id} className="nav-sec"
                            // onClick={() => navigate(item.path)}
                            onClick={() => handleScrollClick(item.scrollTo)}

                        >
                            {/* <Link to={item.path}>{item.title}</Link> */}
                            <ScrollLink
                                to={item.scrollTo}
                                smooth={true}
                                duration={800}
                                spy={true}
                                activeClass="nav-active"
                                offset={-100}
                                className="scroll-nav-link"
                            >
                                {item.title}
                            </ScrollLink>
                        </LiquidGlassButton>
                    ))}

                </LiquidGlassContainer>

                {/* <Suspense fallback={
                    <div className="nav-right fallback-container">
                        <div className="loading">Loading glass effect...</div>
                    </div>
                }>
                    <LiquidGlassContainer
                        borderRadius={28}
                        innerShadowColor="#000000"
                        innerShadowBlur={21}
                        innerShadowSpread={-8}
                        glassTintColor="rgba(255, 255, 255, 0)"
                        glassTintOpacity={0}
                        frostBlurRadius={2}
                        noiseFrequency={0.018}
                        noiseStrength={120}
                    // className="main-nav"

                    >


                        {LIST_ITEMS.map((item) => (
                            <Suspense key={item.id} fallback={
                                <div className="nav-sec fallback-item">
                                    <div className="loading-dot">•</div>
                                </div>
                            }>
                                <LiquidGlassLink
                                    href={item.path}
                                    borderRadius={8}
                                    innerShadowColor="#000000"
                                    innerShadowBlur={10}
                                    innerShadowSpread={0}
                                    glassTintColor="rgba(255, 255, 255, 0.02)"
                                    glassTintOpacity={2}
                                    frostBlurRadius={0}
                                    noiseFrequency={0.0005}
                                    noiseStrength={5}
                                    className="nav-sec"
                                >
                                    {item.title}
                                </LiquidGlassLink>
                            </Suspense>
                        ))}


                    </LiquidGlassContainer>
                </Suspense> */}



                <nav onClick={handleOpenMenu}>
                    <div className="icon-wrapper">
                        <FaBars ref={barsRef} className="fabars" />
                        <FaTimes ref={timesRef} className="fatimes" />
                    </div>
                    <div className="menu cursor-pointer">
                        <ul ref={menuRef} onClick={(e) => e.stopPropagation()}>
                            {LIST_ITEMS.map((item, index) => (
                                <li
                                    key={item.id}
                                    className="html-li"
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    style={{ position: "relative", top: 0, left: 60, opacity: 0 }}
                                >
                                    <ScrollLink
                                        to={item.scrollTo}
                                        smooth={true}
                                        duration={800}
                                        spy={true}
                                        activeClass="nav-active"
                                        offset={-100}
                                        className="li"
                                        onClick={handleOpenMenu} // Close menu after clicking
                                    >
                                        <ShinyText className="shinytext" text={item.title} speed={3} />
                                    </ScrollLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </div >
    );
}

export default React.memo(Navamit);