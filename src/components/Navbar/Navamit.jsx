import React, { useRef, useState } from "react";
import * as Icons from "react-icons/fa6";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { FaBars, FaTimes } from "react-icons/fa";
import ShinyText from '/Users//Asus/Desktop/portfolio/src/components/ui/shiny-text';
import BlurText from "/Users//Asus/Desktop/portfolio/src/components/ui/BlurText";
import DarkVeil from '/Users//Asus/Desktop/portfolio/src/components/ui//DarkVeil';
import Timer from "../Timer/Timer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Navamit() {
    const Listitems = [
        { id: "1", title: "Home", path: "/about" },
        { id: "2", title: "Capture the Love", path: "/" },
        { id: "3", title: "How We Met", path: "/" },
        { id: "4", title: "Celebration Details", path: "/" },
        { id: "5", title: "Join Our Celebration", path: "/" },
        // { id: "6", title: "fsa", path: "/" },
        // { id: "6", title: "fsa", path: "/" },
        // { id: "6", title: "fsa", path: "/" },
        // { id: "6", title: "fsa", path: "/" },

    ];

    const [Menu, setMenu] = useState(false);
    const menuRef = useRef(null);
    const barsRef = useRef(null);
    const timesRef = useRef(null);
    const t1 = useRef(null);
    const iconTl = useRef(null);
    const itemRefs = useRef([]); // stores refs to each li
    // const iconWrapperRef = useRef(null); 

    useGSAP(() => {
        const radius = 90;
        const startAngle = -170;
        const endAngle = -180;
        const angleStep = (endAngle - startAngle) / (Listitems.length - 1);
        if (!menuRef.current) return;



        const introTl = gsap.timeline();

        // Step 1 — Fade in background (body)
        introTl.to("body", {
            backgroundColor: "black",
            duration: 1.5,
            ease: "power2.out",
        });

        // Step 2 — Fade in DarkVeil smoothly with a delay
        introTl.fromTo(
            ".DarkVeil, .darkveil-bg, .darkveil-canvas",
            { opacity: 0, scale: 1.05 },   // slightly zoomed in and invisible
            { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
            0.3                              // overlap start with background fade
        );

        // Step 3 — (optional) Fade in logo slightly later
        introTl.fromTo(
            ".logo-img",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
            "-=1"
        );

        // ✅ Menu animation
        t1.current = gsap.timeline({
            paused: true,
            onStart: () => console.log("Menu animation started"),
            onReverseComplete: () => console.log("Menu animation reversed"),
            defaults: { duration: 0.5, ease: "back.out(1.7)" },
        });
        // semi - circle 
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const angle = (startAngle + i * angleStep) * (Math.PI / 180);
            const x = Math.cos(angle) * radius - 60;
            const y = Math.sin(angle) * radius + 40;

            t1.current.fromTo(
                el,
                {
                    x: 0,
                    y: 0,
                    opacity: 0,
                    cursor: 'none',
                    pointerEvents: 'none'
                },
                {
                    x,
                    y,
                    opacity: 1,
                    duration: 0.4,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    delay: i * 0.1,
                    ease: "back.out(1.7)",
                }, 0
            );
        });


        // ✅ Icon transition timeline
        iconTl.current = gsap.timeline({ paused: true });

        gsap.set(timesRef.current, { opacity: 0, scale: 0, rotate: -90 });
        gsap.set(barsRef.current, { opacity: 1, scale: 1, rotate: 0 });

        iconTl.current.to(barsRef.current, {
            opacity: 0,
            scale: 0,
            rotate: 90,
            duration: 0.3,
            ease: "back.in(1.5)",
        });

        iconTl.current.to(
            timesRef.current,
            {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.4,
                ease: "back.out(1.5)",
            },
            "<" // start at same time
        );
        // animation with scroll effect
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",      // your section wrapper
                start: "100px top",        // when top of .parent hits top of viewport
                end: "bottom top",       // when bottom of .parent hits top
                scrub: 1.2,              // smooth scrolling effect
                markers: true,
            },
        });

        // Logo animation
        scrollTl.to(".logo-img", {
            x: "-35vw",
            scale: 0.8,
            duration: 1,
            ease: "power2.out",
        }, 0);
        // Middle content fades out
        scrollTl.to(".nav-middle-content", {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.out",
        }, 0.2);
        // Main-nav appears
        scrollTl.to(".main-nav", {
            opacity: 1,
            y: 0,
            display: "inline-flex",
            pointerEvents: "auto",
            duration: 1,
            ease: "power2.out",
        }, 0.3);
        // Fade & slight pan (move upward) for DarkVeil background
        // scrollTl.to(".DarkVeil, .darkveil-bg, .darkveil-canvas", {
        //     opacity: 0.7,
        //     // y: "-10vh",         
        //     duration: 1.5,
        //     ease: "power1.out",
        // }, 0);

        // Fade-in nav after DarkVeil starts fading
        // scrollTl.fromTo(".main-nav",
        //     { opacity: 0, y: -20, pointerEvents: "none" },
        //     { opacity: 1, y: 0, pointerEvents: "auto", duration: 1.2, ease: "power2.out" },
        //     0.3
        // );

        // Fade out floating icons
        scrollTl.to(".icon-wrapper", {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.8,
        }, 0.4);
    }, []);

    // ✅ Single handler controlling both timelines
    function handleOpenMenu() {
        setMenu((prev) => {
            const newState = !prev;

            if (newState) {
                t1.current.play();
                iconTl.current.play();
            } else {
                t1.current.reverse();
                iconTl.current.reverse();
            }

            return newState;
        });
    }
    const handleAnimationComplete = () => {
        console.log('Animation completed!');
    };
    return (<>



        <div className="parent">
            <div className="canvas-wrapper relative h-[20vh] " >
                <DarkVeil />
            </div>
            <div className="logo">
                <div className="logo-img">
                    <img src="https://img1.wsimg.com/isteam/ip/0b1b43fa-6e68-44ec-ab39-4990fb08c755/blob.png/:/rs=w:88,h:88,cg:true,m/cr=w:88,h:88/qt=q:95" alt="" />
                    <BlurText
                        text="A ♡ K"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        onAnimationComplete={handleAnimationComplete}
                        className="logotext"
                    />

                </div>
                <div className="nav-middle-content">
                    <BlurText
                        text="Together Forever"
                        delay={200}
                        animateBy="words"
                        className="romantic-tagline"
                    />
                    <div className="wedding-date"><Timer></Timer></div>
                </div>
                <div className="nav-right"> <div className="main-nav">{Listitems.map((item, index) => (<div key={item.id} className="nav-sec"><Link to={item.path}>{item.title}</Link></div>))}</div></div>
                {/* <div className="extra"></div> */}
                <nav
                    onClick={() => handleOpenMenu()}
                >


                    {/* Icon Wrapper */}
                    <div className="icon-wrapper "  >
                        <FaBars ref={barsRef} className="fabars" />
                        <FaTimes ref={timesRef} className="fatimes" />
                    </div>
                    {/* Menu Items */}
                    <div className="menu cursor-pointer ">
                        <ul ref={menuRef} onClick={(e) => e.stopPropagation()}>
                            {Listitems.map((item, index) => {
                                const IconComponent = Icons[`Fa${item.id}`];
                                return (
                                    <li className="html-li" key={item.id}
                                        ref={(el) => (itemRefs.current[index] = el)} // assign ref
                                        style={{ position: "relative", top: 0, left: 0, opacity: 0 }}
                                    >

                                        {/* {IconComponent && <IconComponent className="icons" />} */}
                                        <Link className="li" to={item.path}> <ShinyText className="shinytext" text={item.title} speed={3} /></Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </div>



        </div>
    </>
    );
}

export default Navamit;
