import React, { useRef, useState } from "react";
import * as Icons from "react-icons/fa6";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaBars, FaTimes } from "react-icons/fa";

gsap.registerPlugin(useGSAP);

function Navamit() {
    const Listitems = [
        { id: "1", title: "fas", path: "/about" },
        { id: "2", title: "fs", path: "/" },
        { id: "3", title: "fd", path: "/" },
        { id: "4", title: "fdf", path: "/" },
        { id: "5", title: "fsa", path: "/" },
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
        const radius = 150;
        const startAngle = -65;
        const endAngle = -290;
        const angleStep = (endAngle - startAngle) / (Listitems.length - 1);
        if (!menuRef.current) return;

        gsap.to("body", { backgroundColor: "black", duration: 1 });

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
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            t1.current.fromTo(
                el,
                { x: 0, y: 0, opacity: 0 },
                {
                    x,
                    y,
                    opacity: 1,
                    duration: 0.4,

                    delay: i * 0.1,
                    ease: "back.out(1.7)",
                }, 0
            );
        });
        // t1.current.from(menuRef.current, {
        //     autoAlpha: 1,
        //     y: 90,

        //     duration: 0.7,
        //     ease: "power3.out",
        // });

        // t1.current.from(
        //     menuRef.current.querySelectorAll("li"),
        //     {
        //         opacity: 0,
        //         x: 0,
        //         duration: 0.4,
        //         stagger: 0.2,
        //         ease: "back.out(1.5)",
        //     },
        //     "-=0.2"
        // );

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

    return (
        <nav
            onClick={() => handleOpenMenu()}
            className={` flex justify-end items-center ${Menu ? "open" : "closing"
                }`}
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
                                style={{ position: "relative", top: 100, left: -200, opacity: 0 }}
                            >
                                {IconComponent && <IconComponent className="icons" />}
                                <Link className="li" to={item.path}>{item.title}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

export default Navamit;
